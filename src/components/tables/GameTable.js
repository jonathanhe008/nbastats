import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Container, styled, Typography, TableContainer } from '@mui/material';
import { fetchGameData } from '../../api/api';
import teams from '../../assets/teams.json'
import players from '../../assets/players.json'
import teamPlayers from '../../assets/team_players.json'

function stableSort(array, comparator, orderBy) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    const stableComparator = (a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    };
    if (orderBy === "date") {
        return stabilizedThis.sort(stableComparator).map((el) => el[0]);
    }

    const filteredData = stabilizedThis.filter(([d, index]) => !isDnp(d));
    const sortedData = filteredData.sort(stableComparator).map((el) => el[0]);
    const dnpData = stabilizedThis.filter(([d, index]) => isDnp(d)).map((el) => el[0]);
    return [...sortedData, ...dnpData];
}
  
function isDnp(d) {
    return d.min === "00" || d.min === "" || d.min === "0" || d.min === "0:00";
}

function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => 
          orderBy === "date"
            ? new Date(formatDate(b.game.date)).getTime() - new Date(formatDate(a.game.date)).getTime()
            : b[orderBy] - a[orderBy]
      : (a, b) =>
          orderBy === "date"
            ? new Date(formatDate(a.game.date)).getTime() - new Date(formatDate(b.game.date)).getTime()
            : a[orderBy] - b[orderBy];
}

const formatDate = (dateString) => {
    const [year, month, day] = dateString.substring(0, 10).split('-');
    return `${month}/${day}/${year}`;
};


const StyledTableCell = styled(TableCell)({
  padding: '.5rem .5rem',
})

const team_content = Object.entries(teams).map(([key, value]) => ({ 
  title: value.name,
  apiId: key,
  id: value.id,
  category: 'Team'
}));

const GameTable = ({ option, onSelect }) => {
    const [gameData, setGameData] = useState(null);
    
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchGameData(option);
        setGameData(data);
      };
      fetchData();
    }, [option]);
    
    const [orderBy, setOrderBy] = useState("date");
    const [order, setOrder] = useState("desc");

    const handleSortRequest = (cellId) => {
        const isDesc = orderBy === cellId && order === "desc";
        setOrder(isDesc ? "asc" : "desc");
        setOrderBy(cellId);
    };
    
    const getGameResult = (game) => {
      const isHome = game.home_team_id === option.info.team.id;
      const homeScore = game.home_team_score;
      const visitorScore = game.visitor_team_score;
      const isFinal = game.status === "Final";
      const result = isHome ? (homeScore > visitorScore ? "W" : "L") : (visitorScore > homeScore ? "W" : "L");
      const color = result === "W" ? "green" : "red";

      if (isFinal) {
        return (
          <span style={{ color: color }}>
            {" "}
            {result} {visitorScore} - {homeScore}
          </span>
        );
      }
      return `${visitorScore} - ${homeScore}`;
    };

    const sortedData = gameData ? stableSort(gameData, getComparator(order, orderBy), orderBy) : [];

    const getTeam = (team_name) => {

      const team = team_content.find(obj => obj.title === team_name);
      let player_list = [];
      const team_players = teamPlayers[teams[team.apiId].abbrev];
      console.log("Official team list: ", team_players);
      players['league']['standard'].forEach(player => {
          if (team_players.includes(`${player['firstName']} ${player['lastName']}`))
          player_list.push(player);
      });
      console.log("Team list found: ", player_list);
      onSelect({
          ...team,
          info: player_list,
      });
    };

    if (!gameData) {
      return <div>Loading...</div>;
    }
  
  
  return (
    <Container fixed>
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
            <TableSortLabel
              active={orderBy === "date"}
              direction={orderBy === "date" ? order : "desc"}
              onClick={() => handleSortRequest("date")}
            >
              <b>Date</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell><b>Game</b></StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "min"}
              direction={orderBy === "min" ? order : "desc"}
              onClick={() => handleSortRequest("min")}
            >
              <b>Min</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "pts"}
              direction={orderBy === "pts" ? order : "desc"}
              onClick={() => handleSortRequest("pts")}
            >
              <b>Pts</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "ast"}
              direction={orderBy === "ast" ? order : "desc"}
              onClick={() => handleSortRequest("ast")}
            >
              <b>Ast</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "reb"}
              direction={orderBy === "reb" ? order : "desc"}
              onClick={() => handleSortRequest("reb")}
            >
              <b>Reb</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "stl"}
              direction={orderBy === "stl" ? order : "desc"}
              onClick={() => handleSortRequest("stl")}
            >
              <b>Stl</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "blk"}
              direction={orderBy === "blk" ? order : "desc"}
              onClick={() => handleSortRequest("blk")}
            >
              <b>Blk</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "turnover"}
              direction={orderBy === "turnover" ? order : "desc"}
              onClick={() => handleSortRequest("turnover")}
            >
              <b>Tov</b>
            </TableSortLabel>
          </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((d) => {
            return (
            <TableRow key={d.game.id} style={{ paddingBottom: "10px" }}>
                <StyledTableCell component="th" scope="row">
                {formatDate(d.game.date)}
                </StyledTableCell>
                <StyledTableCell sx={{ display: "flex", alignItems: "center" }}>
                  <img src={teams[d.game.visitor_team_id].logo} alt="visitor team logo" style={{ marginRight: "0.5rem", width: "2em", height: "2em", objectFit: "contain" }} />
                  <Typography component="a" href="#" onClick={() => getTeam(teams[d.game.visitor_team_id].name)} variant="highlight" sx={{ marginRight: "0.5rem" }}>
                    {teams[d.game.visitor_team_id].name}
                  </Typography>
                  {" @ "}
                  <img src={teams[d.game.home_team_id].logo} alt="home team logo" style={{ marginRight: "0.5rem", marginLeft: "0.3rem", width: "2em", height: "2em", objectFit: "contain" }} />
                  <Typography component="a" href="#" onClick={() => getTeam(teams[d.game.home_team_id].name)} variant="highlight" sx={{ marginRight: "0.5rem" }}>
                    {teams[d.game.home_team_id].name}
                  </Typography>
                  <div style={{ marginLeft: "auto", marginRight: "1rem" }}>{getGameResult(d.game)}</div>
                </StyledTableCell>
                {isDnp(d) ? 
                (<StyledTableCell colSpan={7} align="center">
                DNP
                </StyledTableCell>) : (
                <>
                <StyledTableCell>{d.min}</StyledTableCell>
                <StyledTableCell>{d.pts}</StyledTableCell>
                <StyledTableCell>{d.ast}</StyledTableCell>
                <StyledTableCell>{d.reb}</StyledTableCell>
                <StyledTableCell>{d.stl}</StyledTableCell>
                <StyledTableCell>{d.blk}</StyledTableCell>
                <StyledTableCell>{d.turnover}</StyledTableCell>
                </>
                )}
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </TableContainer>
    </Container>
  );
};

export default GameTable;
