import memoize from 'memoize-one';

export async function fetchPlayer(apiId) {
    var url = new URL(`https://www.balldontlie.io/api/v1/players/${apiId}`);
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    console.log("fetchPlayer => ", data);

    return data;
}

export async function fetchPlayerStats(player) {
    var player_id = player ? player['id'] : 237;
    var url = new URL("https://www.balldontlie.io/api/v1/stats");
    var params = {
        'seasons[]': ['2022'], 
        'player_ids[]': [player_id],
        'per_page': 100
    };
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    if (data.data.length === 0) {
        const img = document.querySelector("#headshot");
        img.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2544.png`;
        let url = new URL("https://www.balldontlie.io/api/v1/stats");
        let params = {
            'seasons[]': ['2022'], 
            'player_ids[]': [237],
            'per_page': 100
        };
        url.search = new URLSearchParams(params).toString();
        let response = await fetch(url, { method: "GET" });
        data = await response.json();
    }

    var sorted_data = data.data.sort((a, b) => {
        return new Date(b.game.date) - new Date(a.game.date);
    });

    var stat_map = {
        "pts": {},
        "ast": {},
        "reb": {},
        "blk": {},
        "stl": {},
        "turnover": {},
        "min": {}
    };

    var trend_map = {
        "pts": {},
        "ast": {},
        "reb": {},
        "blk": {},
        "stl": {},
        "turnover": {},
        "min": {}
    }

    for (let d of sorted_data) {
        if (d.min === "00" || d.min === "" || d.min === "0" || d.min === "0:00") {
             continue;
        }
        var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min"];
        const minutes = parseInt(d["min"], 10);
        stats.forEach(function(stat) {
            if (stat === "min") {
                stat_map[stat][minutes] = (stat_map[stat][minutes] || 0) + 1;
                trend_map[stat][d.game.date.substring(0,10)] = minutes
            }
            else {
                stat_map[stat][d[stat]] = (stat_map[stat][d[stat]] || 0) + 1;
                trend_map[stat][d.game.date.substring(0,10)] = d[stat];
            }
        });
    }

    console.log("stat_map => ", stat_map);
    console.log("trend_map => ", trend_map);
    return {
        stat: stat_map,
        trend: trend_map,
        data: sorted_data
    };
}

export async function fetchSeasonAverage(players) {
    var totals_map = {
        "pts": {},
        "ast": {},
        "reb": {},
        "blk": {},
        "stl": {},
        "turnover": {},
        "min": {}
    };

    const playerIds = players.map(player => player['apiId']);
    var url = new URL("https://www.balldontlie.io/api/v1/season_averages");
    var params = {
        'season': '2022', 
        'player_ids[]': playerIds,
    };
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    console.log("fetchSeasonAverage => ", data);
    data.data.sort((a, b) => b.pts - a.pts)
    const player_dict = players.reduce((acc, obj) => {
        acc[obj.apiId] = obj;
        return acc;
    }, {});

    console.log("PlayerDict => ", player_dict);

    for (let averages of data.data) {
        let player = player_dict[averages['player_id']];
        var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min"];
        stats.forEach(function(stat) {
            if (stat === "min") {
                const parts = averages[stat].split(":");
                const minutes = parseInt(parts[0])+ (parseInt(parts[1])/60);
                totals_map[stat][`${player['firstName']} ${player['lastName']}`] = Math.ceil(minutes * averages['games_played']);
            } else {
                totals_map[stat][`${player['firstName']} ${player['lastName']}`] = Math.ceil(averages[stat] * averages['games_played']);
            }
        });
    }

    console.log("team_totals_map => ", totals_map);
    return totals_map;
}

// const fetchPlayerMemoized = memoize(fetchPlayer);
const fetchPlayerStatsMemoized = memoize(fetchPlayerStats);
const fetchSeasonAverageMemoized = memoize(fetchSeasonAverage);

export const fetchTotalsData = memoize(async function(selection) {
    try {
      const players = selection.info;
      const totals_map = await fetchSeasonAverageMemoized(players);
      return totals_map;
    } catch (error) {
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchGameData = memoize(async function(selection) {
    try {
      const player = selection.info;
      const maps = await fetchPlayerStatsMemoized(player);
      const games = maps.data;
      return games;
    } catch (error) {
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchDoughnutData = memoize(async function(selection, stat) {
    try {
      const player_list = selection.info;
      const totals_map = await fetchSeasonAverageMemoized(player_list);
      const data = getSpecificStat(totals_map, stat);
      data.sort((a, b) => b.count - a.count)
      return {
        labels: data.map(row => row.stat),
        data: data.map(row => row.count),
        title: `${selection.title} ${stat} this Season`,
        stat: stat
      };
    } catch (error) {
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchBarData = memoize(async function(selection, stat) {
    try {
    //   const player = await fetchPlayerMemoized(selection.apiId);
      const player = selection.info;
      const maps = await fetchPlayerStatsMemoized(player);
      const stat_map = maps.stat;
      const bar_data = getSpecificStat(stat_map, stat)
      return {
        labels: bar_data.map(row => row.stat),
        data: bar_data.map(row => row.count),
        title: `${player['first_name']} ${player['last_name']} ${stat} this Season`,
        stat: stat
      };
    } catch (error) {
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchLineData = memoize(async function(selection, stat) {
    try {
    //   const player = await fetchPlayerMemoized(selection.apiId);
      const player = selection.info;
      const maps = await fetchPlayerStatsMemoized(player);
      const trend_map = maps.trend;
      const trend_data = getSpecificStat(trend_map, stat).reverse();
      return {
        labels: trend_data.map(row => row.stat),
        data: trend_data.map(row => row.count),
        title: `${player['first_name']} ${player['last_name']} ${stat} this Season`,
        stat: stat
      };
    } catch (error) {
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});


export function getSpecificStat(stat_map, stat) {
    var stat_literal = {
      "Points": "pts",
      "Assists": "ast",
      "Rebounds": "reb",
      "Blocks": "blk",
      "Steals": "stl",
      "Turnovers": "turnover",
      "Minutes": "min"
    };
    let result = [];
    for (const [key, value] of Object.entries(stat_map[stat_literal[stat]])) {
        result.push({
            stat: key,
            count: value
        })
    }
    console.log("getSpecificStat => ", result);
    return result;
}