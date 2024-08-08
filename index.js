import dotenv from 'dotenv';
import fetch from "node-fetch";
import mysql from "mysql2/promise";
import { randomSelect, dateToStringDetail } from './Functions.js';
import { 
	msPerDay, 
	msPerSecond, 
	selectRankgameIdByMatchId, 
	queue, 
	tiers, 
	leagueByTierUrl, 
	summonerByIdUrl, 
	matchIdsByPuuidUrl, 
	matchByIdUrl, 
	blueTeamId,
	insertRankgame,
	insertPlayer,
	secondPerMinute,
	localtimeOffset,
} from './Constants.js';

let conn;

dotenv.config();
const riotApiKey = process.env.RIOT_API_KEY;
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 10,
});


const requestRiot = async(url, params) => {
	const res = await fetch(`${url}?api_key=${riotApiKey}&${params}`);
	return await res.json();
};

const main = async() => {
	try {
        conn = await pool.getConnection();
		const { tier, division } = randomSelect(tiers);
		const entries = await requestRiot(`${leagueByTierUrl}/${queue}/${tier}/${division}`);
		const entry = randomSelect(entries);
		const { summonerId } = entry;
		const summoner = await requestRiot(`${summonerByIdUrl}/${summonerId}`);
		const { puuid } = summoner;
		const secondBefore30Days = Math.round((Date.now() - 30 * msPerDay) / msPerSecond);
		const matchIds = await requestRiot(`${matchIdsByPuuidUrl}/${puuid}/ids`, `startTime=${secondBefore30Days}&type=ranked`);
		let matchId;
		for(matchId of matchIds) {
			const [rows] = await conn.query(selectRankgameIdByMatchId, [matchId]);
			if(rows.length === 0) {
				break;
			}
		}
		if(!matchId) {
			throw("NO DATA");
		}
		const match = await requestRiot(`${matchByIdUrl}/${matchId}`);
		const { info } = match;
		const { participants, teams, gameDuration, gameStartTimestamp, gameVersion } = info;
		if(participants.length !== 10) {
			throw("CORRUPTED DATA");
		}
		if(gameDuration < 15 * secondPerMinute) {
			throw("TOO SHORT GAME");
		}
		let isBlueWin = true;
		let blueDragonKill, blueHordeKill, blueHeraldKill, blueBaronKill, redDragonKill, redHordeKill, redHeraldKill, redBaronKill;
		teams.forEach((team) => {
			const { teamId, win, objectives } = team;
			const { baron, dragon, horde, riftHerald } = objectives;
			if(teamId === blueTeamId) {
				isBlueWin = win;
				blueBaronKill = baron.kills;
				blueDragonKill = dragon.kills;
				blueHordeKill = horde.kills;
				blueHeraldKill = riftHerald.kills;
			}
			else {
				redBaronKill = baron.kills;
				redDragonKill = dragon.kills;
				redHordeKill = horde.kills;
				redHeraldKill = riftHerald.kills;
			}
		});
		await conn.beginTransaction();
		const startedAt = new Date(gameStartTimestamp + localtimeOffset).toISOString().slice(0, 19).replace('T', ' ');
		const [result] = await conn.query(insertRankgame, [
			matchId, 
			gameVersion, 
			isBlueWin ? 1 : 0, 
			tier, 
			division, 
			gameDuration, 
			blueDragonKill, 
			blueHordeKill, 
			blueHeraldKill, 
			blueBaronKill, 
			redDragonKill, 
			redHordeKill, 
			redHeraldKill, 
			redBaronKill,
			startedAt,
		]);
		const rankgameId = result.insertId;
		for(const participant of participants) {
			const { 
				teamId, 
				teamPosition, 
				riotIdGameName, 
				riotIdTagline, 
				puuid,
				goldEarned,
				championId,
				deaths,
				kills,
				assists,
				totalMinionsKilled,
				neutralMinionsKilled,
				totalDamageDealtToChampions,
				summoner1Id,
				summoner2Id,
				champLevel,
			} = participant;

			await conn.query(insertPlayer, [
				rankgameId,
				riotIdGameName,
				riotIdTagline,
				puuid,
				teamId === blueTeamId ? 1 : 0,
				teamPosition, 
				championId,
				summoner1Id,
				summoner2Id,
				kills,
				deaths,
				assists,
				champLevel,
				totalMinionsKilled + neutralMinionsKilled,
				goldEarned,
				totalDamageDealtToChampions
			]);
		}
		await conn.commit();
		const isUpperTier = tier === "CHALLENGER" || tier === "GRANDMASTER" || tier === "MASTER";
		console.log(`${dateToStringDetail(new Date())}: ${tier}${isUpperTier ? "" : " " + division}`);
		

		// const [row] = await conn.query(selectRankgameById, [rankgameId]);
		// console.log(row);
	} catch (error) {
		if(conn) await conn.rollback();
		console.log(error);
	} finally {
        if(conn) conn.release();
        process.exit();
    }
};

main();