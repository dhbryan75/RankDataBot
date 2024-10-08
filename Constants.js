export const msPerSecond = 1000;
export const secondPerMinute = 60;
export const msPerMinute = secondPerMinute * msPerSecond;
export const minutePerHour = 60;
export const msPerHour = minutePerHour * msPerMinute;
export const hourPerDay = 24;
export const msPerDay = hourPerDay * msPerHour;

export const localtimeOffset = msPerHour * 9;


// QUERIES
export const selectRankgameIdByMatchId = `SELECT 
rankgameId
FROM Rankgame
WHERE riotMatchId = ?`;

export const insertRankgame = `INSERT INTO Rankgame(
riotMatchId, 
version, 
isBlueWin, 
tier, 
division, 
duration, 
blueDragonKill, 
blueHordeKill, 
blueHeraldKill, 
blueBaronKill, 
redDragonKill, 
redHordeKill, 
redHeraldKill, 
redBaronKill, 
startedAt)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export const insertPlayer = `INSERT INTO Player(rankgameId, gamename, tagline, riotPuuid, isBlue, position, championId, spell0Id, spell1Id, \`kill\`, death, assist, level, cs, gold, deal)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


// RIOT
export const queue = "RANKED_SOLO_5x5";
export const tiers = [
	{
		tier: "CHALLENGER",
		division: "I"
	},
	{
		tier: "CHALLENGER",
		division: "I"
	},
	{
		tier: "CHALLENGER",
		division: "I"
	},
	{
		tier: "CHALLENGER",
		division: "I"
	},
	{
		tier: "GRANDMASTER",
		division: "I"
	},
	{
		tier: "GRANDMASTER",
		division: "I"
	},
	{
		tier: "GRANDMASTER",
		division: "I"
	},
	{
		tier: "GRANDMASTER",
		division: "I"
	},
	{
		tier: "MASTER",
		division: "I"
	},
	{
		tier: "MASTER",
		division: "I"
	},
	{
		tier: "MASTER",
		division: "I"
	},
	{
		tier: "MASTER",
		division: "I"
	},
	{
		tier: "DIAMOND",
		division: "I"
	},
	{
		tier: "DIAMOND",
		division: "II"
	},
	{
		tier: "DIAMOND",
		division: "III"
	},
	{
		tier: "DIAMOND",
		division: "IV"
	},
	{
		tier: "PLATINUM",
		division: "I"
	},
	{
		tier: "PLATINUM",
		division: "II"
	},
	{
		tier: "PLATINUM",
		division: "III"
	},
	{
		tier: "PLATINUM",
		division: "IV"
	},
	{
		tier: "GOLD",
		division: "I"
	},
	{
		tier: "GOLD",
		division: "II"
	},
	{
		tier: "GOLD",
		division: "III"
	},
	{
		tier: "GOLD",
		division: "IV"
	},
	{
		tier: "SILVER",
		division: "I"
	},
	{
		tier: "SILVER",
		division: "II"
	},
	{
		tier: "SILVER",
		division: "III"
	},
	{
		tier: "SILVER",
		division: "IV"
	},
	{
		tier: "BRONZE",
		division: "I"
	},
	{
		tier: "BRONZE",
		division: "II"
	},
	{
		tier: "BRONZE",
		division: "III"
	},
	{
		tier: "BRONZE",
		division: "IV"
	},
	{
		tier: "IRON",
		division: "I"
	},
	{
		tier: "IRON",
		division: "II"
	},
	{
		tier: "IRON",
		division: "III"
	},
	{
		tier: "IRON",
		division: "IV"
	},
];

export const leagueByTierUrl = "https://kr.api.riotgames.com/lol/league-exp/v4/entries";
export const summonerByIdUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners";
export const matchIdsByPuuidUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid";
export const matchByIdUrl = "https://asia.api.riotgames.com/lol/match/v5/matches";

export const blueTeamId = 100;
export const redTeamId = 200;