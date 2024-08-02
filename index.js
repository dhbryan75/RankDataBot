import dotenv from 'dotenv';
import fetch from "node-fetch";
import mysql from "mysql2/promise";
import { randomSelect } from './Functions.js';

const selectRiotAccount = `SELECT 
riotAccountId,
gamename,
tagline
FROM RiotAccount`;


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


const riotApiBaseUrl = "https://asia.api.riotgames.com";
const accountPath = "riot/account/v1/accounts/by-riot-id";
const matchByPuuidPath = "lol/match/v5/matches/by-puuid";


const requestRiot = async(path, params) => {
	const url = `${riotApiBaseUrl}/${path}?api_key=${riotApiKey}&${params}`;
	const res = await fetch(url);
	return await res.json();
};

const main = async() => {
	try {
        const conn = await pool.getConnection();
		const [rows] = await conn.query(selectRiotAccount);
		const { gamename, tagline } = randomSelect(rows);
		const { puuid } = await requestRiot(`${accountPath}/${gamename}/${tagline}`);
		console.log(puuid);
		const matchIds = await requestRiot(`${matchByPuuidPath}/${puuid}/ids`, `type=ranked`);
		console.log(matchIds);
	} catch (error) {
		console.log(error);
	}
};

main();