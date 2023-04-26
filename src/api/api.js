import memoize from 'memoize-one';
import players from '../assets/players.json'
import teamPlayers from '../assets/team_players.json'
import teams from '../assets/teams.json'

export async function fetchPlayer(apiId) {
    var url = new URL(`https://www.balldontlie.io/api/v1/players/${apiId}`);
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    console.log("fetchPlayer => ", data);

    return data;
}

export async function fetchPlayerStats(player, yearRange) {
    var player_id = player ? player['id'] : 237;
    const seasons = Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i);
    // const seasons = ['2022', '2021'];
    const perPage = 100;
    let currentPage = 1;
    let data = [];
  
    while (true) {
      let url = new URL("https://www.balldontlie.io/api/v1/stats");
      const params = {
        "player_ids[]": player_id,
        "per_page": perPage,
        "page": currentPage,
      };
      url.search = new URLSearchParams(params).toString();
      seasons.forEach(id => {
        url.searchParams.append('seasons[]', id);
      });

      let response = await fetch(url, { method: "GET" });
      const data_response = await response.json();
      data = data.concat(data_response.data);
  
      if (data_response.meta.next_page === null) {
        break;
      } else {
        currentPage++;
      }
    }

    var sorted_data = data.sort((a, b) => {
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

    var fg3 = [];
    var fg = [];
    var ft = [];

    for (let d of sorted_data) {
        if (!d.min || d.min === "00" || d.min === "" || d.min === "0" || d.min === "0:00") {
             continue;
        }
        var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min"];
        const minutes = parseInt(d["min"], 10);
        stats.forEach(function(stat) {
            if (stat === "min") {
                stat_map[stat][minutes] = (stat_map[stat][minutes] || 0) + 1;
                trend_map[stat][d.game.date.substring(0,10)] = minutes
            } else {
                stat_map[stat][d[stat]] = (stat_map[stat][d[stat]] || 0) + 1;
                trend_map[stat][d.game.date.substring(0,10)] = d[stat];
            }
        });
        let fg_pct = d['fg_pct'] <= 1 ? d['fg_pct'] * 100 : d['fg_pct']
        let fg3_pct = d['fg3_pct'] <= 1 ? d['fg3_pct'] * 100 : d['fg3_pct']
        let ft_pct = d['ft_pct'] <= 1 ? d['ft_pct'] * 100 : d['ft_pct']
        fg3.push({ x: d['fg3a'],  y: fg3_pct.toFixed(1),  r: d['fg3m'], label: d.game.date.substring(0,10)})
        fg.push({ x: d['fga'],  y: fg_pct.toFixed(1),  r: d['fgm'], label: d.game.date.substring(0,10)})
        ft.push({ x: d['fta'],  y: ft_pct.toFixed(1),  r: d['ftm'], label: d.game.date.substring(0,10)})
    }

    console.log("stat_map => ", stat_map);
    console.log("trend_map => ", trend_map);
    console.log("fg3 =>", fg3);
    console.log("fg =>", fg);
    console.log("ft =>", ft);
    return {
        stat: stat_map,
        trend: trend_map,
        data: sorted_data,
        fg3: fg3,
        fg: fg,
        ft: ft
    };
}

export async function fetchSeasonAverages(players) {
    var totals_map = {
        "pts": {},
        "ast": {},
        "reb": {},
        "blk": {},
        "stl": {},
        "turnover": {},
        "min": {},
        "ft_pct": {},
        "fg_pct": {},
        "fg3_pct": {},
    };
    
    const playerIds = players.map(player => player['apiId']);
    var url = new URL("https://www.balldontlie.io/api/v1/season_averages");
    var params = {
        'season': '2022'
    };
    url.search = new URLSearchParams(params).toString();

    playerIds.forEach(id => {
      url.searchParams.append('player_ids[]', id);
    });
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    console.log("fetchSeasonAverages => ", data);
    data.data.sort((a, b) => b.pts - a.pts)
    const player_dict = players.reduce((acc, obj) => {
        acc[obj.apiId] = obj;
        return acc;
    }, {});

    console.log("PlayerDict => ", player_dict);

    for (let averages of data.data) {
        let player = player_dict[averages['player_id']];
        var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min", "ft_pct", "fg_pct", "fg3_pct"];
        stats.forEach(function(stat) {
            let avg_stat = averages[stat]
            if (stat === "min") {
                const parts = averages[stat].split(":");
                const minutes = parseInt(parts[0])+ (parseInt(parts[1])/60);
                avg_stat = minutes.toFixed(1);
            } else if (stat === "ft_pct" || stat === "fg3_pct" || stat === "fg_pct") {
                avg_stat = (averages[stat]*100).toFixed(1)
            } else {
                avg_stat = averages[stat].toFixed(1);
            }

            totals_map[stat][`${player['firstName']} ${player['lastName']}`] = avg_stat
        });
    }

    console.log("team_totals_map => ", totals_map);
    return totals_map;
}

export async function fetchSeasonAverage(player) {
  var url = new URL("https://www.balldontlie.io/api/v1/season_averages");
  var params = {
      'season': '2022', 
      'player_ids[]': [player],
  };
  url.search = new URLSearchParams(params).toString();
  let response = await fetch(url, { method: "GET" });
  let data = await response.json();

  console.log("fetchSeasonAverage => ", data);
  const playerAverage = data.data[0]
  var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min", "ft_pct", "fg_pct", "fg3_pct"];
  stats.forEach(function(stat) {
      if (stat === "min") {
        const parts = playerAverage['min'].split(":");
        const minutes = parseInt(parts[0])+ (parseInt(parts[1])/60);
        playerAverage['min'] = minutes.toFixed(1);
      } else if (stat === "ft_pct" || stat === "fg3_pct" || stat === "fg_pct") {
        playerAverage[stat] = (playerAverage[stat]*100).toFixed(1) + "%"
      } else {
        playerAverage[stat] = playerAverage[stat].toFixed(1);
      }
  });

  return playerAverage;
}

export async function fetchBoxScore(isHome, game) {
  var url = new URL("https://www.balldontlie.io/api/v1/stats");
  var params = {
    'game_ids[]': game,
    'per_page': 100
  };
  url.search = new URLSearchParams(params).toString();

  let response = await fetch(url, { method: "GET" });
  let data = await response.json();
  const filteredData = data.data.filter((stats) => isHome ? stats.game.home_team_id === stats.team.id : stats.game.visitor_team_id === stats.team.id);
  filteredData.sort((a, b) => b.pts - a.pts)
  var score_map = {
    "pts": {},
    "ast": {},
    "reb": {},
    "blk": {},
    "stl": {},
    "turnover": {},
    "min": {},
    "fg3": {},
    "fg": {},
    "ft": {}
  };

  for (let player_stats of filteredData) {
    if (!player_stats.player) {
      continue;
    }
    var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min", "fg3", "fg", "ft"];

    if (!(!player_stats["min"] || player_stats["min"] === "00" || player_stats["min"] === "" || player_stats["min"] === "0" || player_stats["min"] === "0:00")) {
      stats.forEach(function(stat) {
        let value = -1;
        if (stat === "min") {
          value = parseInt(player_stats[stat], 10);
        } else if (stat === "fg") {
          value = `${player_stats['fgm']}-${player_stats['fga']}`;
        } else if (stat === "fg3") {
          value = `${player_stats['fg3m']}-${player_stats['fg3a']}`;
        } else if (stat === "ft") {
          value = `${player_stats['ftm']}-${player_stats['fta']}`;
        } else {
          value = player_stats[stat]
        }

        score_map[stat][`${player_stats['player'].first_name} ${player_stats['player'].last_name}`] = value;
      });
    } else {
      stats.forEach(function(stat) {
        score_map[stat][`${player_stats['player'].first_name} ${player_stats['player'].last_name}`] = -1;
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

export async function fetchTrendingGames(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const url = "https://www.balldontlie.io/api/v1/games";
  const seasons = ["2022"];
  const dates = [formattedDate];
  const perPage = 100;

  
  const params = {
    "seasons[]": seasons,
    "dates[]": dates,
    "per_page": perPage,
  };
  const apiUrl = `${url}?${new URLSearchParams(params).toString()}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.data.length === 0) {
    return [];
  }

  let game_list = [];
  for (let game of data.data) {
    game_list.push({...game, home_team_id: game.home_team.id, visitor_team_id: game.visitor_team.id});
  }

  console.log("Trending Games =>", game_list);
  return game_list;
}

const fetchPlayerStatsMemoized = memoize(fetchPlayerStats);
const fetchSeasonAveragesMemoized = memoize(fetchSeasonAverages);
const fetchBoxScoreMemoized = memoize(fetchBoxScore);
const fetchSeasonAverageMemoized = memoize(fetchSeasonAverage);

export const fetchAverageData = memoize(async function(player) {
  try {
    const season_stats = await fetchSeasonAverageMemoized(player);
    return season_stats;
  } catch (error) {
    console.log(error)
    return {
      error: 'An error occurred while fetching the data.',
    };
  }
});

export const fetchTotalsData = memoize(async function(players) {
    try {
      const totals_map = await fetchSeasonAveragesMemoized(players);
      return totals_map;
    } catch (error) {
      console.log(error)
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchGameData = memoize(async function(isHome, id) {
  try {
    const box_map = await fetchBoxScoreMemoized(isHome, id);
    return box_map;
  } catch (error) {
    console.log(error)
    return {
      error: 'An error occurred while fetching the data.',
    };
  }
});


export const fetchPlayerGameData = memoize(async function(selection, yearRange, selectedTeam) {
    try {
      const player = selection.info;
      const maps = await fetchPlayerStatsMemoized(player, yearRange);
      const games = maps.data;
      const teamId = parseInt(selectedTeam, 10);
      if (teamId) {
        const dataQueried = games.filter((stats) =>  stats.game.home_team_id === teamId || stats.game.visitor_team_id === teamId);
        console.log("Game data => ", dataQueried)
        return dataQueried;
      } else {
        console.log("Game data => ", games)
        return games;
      }
    } catch (error) {
      console.log(error)
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchPieData = memoize(async function(isHome, id, stat) {
  try {
    const box_map = await fetchBoxScoreMemoized(isHome, id);
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
    console.log(error)
    return {
      error: 'An error occurred while fetching the data.',
    };
  }
});

export const fetchDoughnutData = memoize(async function(selection, stat) {
    try {
      const player_list = selection.info;
      const totals_map = await fetchSeasonAveragesMemoized(player_list);
      const data = getSpecificStat(totals_map, stat);
      data.sort((a, b) => b.count - a.count)
      return {
        labels: data.map(row => row.stat),
        data: data.map(row => row.count),
        title: `${selection.title} ${stat} this Season`,
        stat: stat
      };
    } catch (error) {
      console.log(error)
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchBarData = memoize(async function(selection, stat, yearRange) {
    try {
      const player = selection.info;
      const maps = await fetchPlayerStatsMemoized(player, yearRange);
      const stat_map = maps.stat;
      const bar_data = getSpecificStat(stat_map, stat)
      return {
        labels: bar_data.map(row => row.stat),
        data: bar_data.map(row => row.count),
        title: `${player['first_name']} ${player['last_name']} ${stat} this Season`,
        stat: stat
      };
    } catch (error) {
      console.log(error)
      return {
        error: 'An error occurred while fetching the data.',
      };
    }
});

export const fetchBubbleData = memoize(async function(selection, stat, yearRange) {
  try {
    const player = selection.info;
    const maps = await fetchPlayerStatsMemoized(player, yearRange);
    const fgdata = stat === '3PT' ? maps.fg3 : stat === 'FG' ? maps.fg : maps.ft;
    return {
      data: fgdata,
      title: `${player['first_name']} ${player['last_name']} ${stat} Efficiency this Season`,
    };
  } catch (error) {
    console.log(error)
    return {
      error: 'An error occurred while fetching the data.',
    };
  }
});

export const fetchLineData = memoize(async function(selection, stat, yearRange) {
    try {
      const player = selection.info;
      const maps = await fetchPlayerStatsMemoized(player, yearRange);
      const trend_map = maps.trend;
      const trend_data = getSpecificStat(trend_map, stat).reverse();
      return {
        labels: trend_data.map(row => row.stat),
        data: trend_data.map(row => row.count),
        title: `${player['first_name']} ${player['last_name']} ${stat} this Season`,
        stat: stat
      };
    } catch (error) {
      console.log(error)
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

export function fetchTeamList(id) {
  let player_list = [];
  const team_players = teamPlayers[teams[id].abbrev];
  console.log("Official team list: ", team_players);
  players['league']['standard'].forEach(player => {
    if (team_players.includes(`${player['firstName']} ${player['lastName']}`))
      player_list.push(player);
  });

  return player_list;
}