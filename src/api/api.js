import memoize from 'memoize-one';
import players from '../assets/players.json'

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
                totals_map[stat][`${player['firstName']} ${player['lastName']}`] = minutes.toFixed(1);
            } else {
                totals_map[stat][`${player['firstName']} ${player['lastName']}`] = averages[stat].toFixed(1);
            }
        });
    }

    console.log("team_totals_map => ", totals_map);
    return totals_map;
}

export async function fetchBoxScore(players, game) {
  const playerIds = players.map(player => player['apiId']);
  var url = new URL("https://www.balldontlie.io/api/v1/stats");
  var params = {
    'seasons[]': ['2022'], 
    'game_ids[]': game,
    'per_page': 100
  };
  url.search = new URLSearchParams(params).toString();

  playerIds.forEach(id => {
    url.searchParams.append('player_ids[]', id);
  });

  let response = await fetch(url, { method: "GET" });
  let data = await response.json();

  data.data.sort((a, b) => b.pts - a.pts)
  const player_dict = players.reduce((acc, obj) => {
      acc[obj.apiId] = obj;
      return acc;
  }, {});
  
  var score_map = {
    "pts": {},
    "ast": {},
    "reb": {},
    "blk": {},
    "stl": {},
    "turnover": {},
    "min": {}
  };
  function hasNonZeroStats(player_stats) {
    var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min"];
    return stats.some(stat => parseInt(player_stats[stat], 10) !== 0);
  }
  
  for (let player_stats of data.data) {
    let player = player_dict[player_stats['player'].id];
    var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min"];
    if (hasNonZeroStats(player_stats)) {
      stats.forEach(function(stat) {
        let value = player_stats[stat];
        if (stat === "min") {
          value = parseInt(value, 10);
        }
        score_map[stat][`${player['firstName']} ${player['lastName']}`] = value;
      });
    } else {
      stats.forEach(function(stat) {
        score_map[stat][`${player['firstName']} ${player['lastName']}`] = -1;
      });
    }
  }
  
  

  console.log("box_score_map => ", score_map);
  return score_map;
}

function comparePlayers(a, b) {
  const aPerformance = (a.pts + 1.2*a.reb + 1.5*a.ast + 2*a.stl + 2*a.blk + a.fg_pct) * 100;
  const bPerformance = (b.pts + 1.2*b.reb + 1.5*b.ast + 2*b.stl + 2*b.blk + b.fg_pct) * 100;

  if (aPerformance < bPerformance) {
    return 1;
  } else if (aPerformance > bPerformance) {
    return -1;
  } else {
    return 0;
  }
}


export async function fetchTrendingPlayers(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const url = "https://www.balldontlie.io/api/v1/stats";
  const seasons = ["2022"];
  const dates = [formattedDate];
  const perPage = 100;
  let currentPage = 1;
  let allData = [];

  while (true) {
    const params = {
      "seasons[]": seasons,
      "dates[]": dates,
      "per_page": perPage,
      "page": currentPage,
    };
    const apiUrl = `${url}?${new URLSearchParams(params).toString()}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const finalData = data.data.filter(item => item.game.status === 'Final');
    allData = allData.concat(finalData);

    if (data.meta.next_page === null) {
      break;
    } else {
      currentPage++;
    }
  }
  if (allData.length === 0) {
    return [];
  }
  
  const sortedArray = allData.sort(comparePlayers);
  let top_five = [];
  for (const stat of sortedArray) {
    if (top_five.length === 5) {
      break;
    }
    const player_obj = players.league.standard.find(p => `${p.firstName} ${p.lastName}` === `${stat.player.first_name} ${stat.player.last_name}`);

    if (!player_obj) {
      continue;
    }
    const playerInfo = await fetchPlayer(player_obj.apiId);
    stat.headshotId = player_obj.personId;
    stat.selectedOptionObj = {
      title: `${player_obj.firstName} ${player_obj.lastName}`,
      id: player_obj.personId,
      apiId: player_obj.apiId,
      category: 'Player',
      info: playerInfo
    };
    top_five.push(stat);
  }    

  return top_five;
}

const fetchPlayerStatsMemoized = memoize(fetchPlayerStats);
const fetchSeasonAverageMemoized = memoize(fetchSeasonAverage);
const fetchBoxScoreMemoized = memoize(fetchBoxScore);

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

export const fetchGameData = memoize(async function({ team, id }) {
  try {
    const box_map = await fetchBoxScoreMemoized(team, id);
    return box_map;
  } catch (error) {
    return {
      error: 'An error occurred while fetching the data.',
    };
  }
});


export const fetchPlayerGameData = memoize(async function(selection) {
    try {
      const player = selection.info;
      const maps = await fetchPlayerStatsMemoized(player);
      const games = maps.data;
      console.log("Game data => ", games)
      return games;
    } catch (error) {
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchPieData = memoize(async function(team, id, stat) {
  try {
    const box_map = await fetchBoxScoreMemoized(team, id);
    const data = getSpecificStat(box_map, stat);
    const filteredData = data.filter((player) => player.count !== -1);
    filteredData.sort((a, b) => b.count - a.count);
    return {
      labels: filteredData.map(row => row.stat),
      data: filteredData.map(row => row.count),
      title: `${stat} this Season`,
      stat: stat
    };
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