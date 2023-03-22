import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Container, styled, Typography, TableContainer } from '@mui/material';
import { fetchGameData, fetchPlayer } from '../../api/api';
import players from '../../assets/players.json'

function sortObject(obj, order) {
  const sortedEntries = Object.entries(obj).sort((a, b) => {
    if (typeof a[1] === "string") {
      a = a[1].split("-").map(Number)[0];
    } else {
      a = a[1];
    }
    
    if (typeof b[1] === "string") {
      b = b[1].split("-").map(Number)[0];
    } else {
      b = b[1];
    }
    
    if (a === -1 && b === -1) {
      return 0;
    } else if (a === -1) {
      return 1;
    } else if (b === -1) {
      return -1;
    } else if (order === "desc") {
      return b - a;
    } else {
      return a - b;
    }
  });
  return Object.fromEntries(sortedEntries);
}


const StyledTableCell = styled(TableCell)({
  padding: '.2rem .2rem'
})

const player_content = players['league']['standard'].map(function(player) {
  return {
    title: `${player.firstName} ${player.lastName}`,
    id: player.personId,
    apiId: player.apiId,
    category: 'Player'
  }
});


function BoxScoreTable(props) {
    const { team, id, onSelect } = props;
    const [orderBy, setOrderBy] = useState("min");
    const [order, setOrder] = useState("desc");
    const [totalsData, setTotalsData] = useState(null);
  
    useEffect(() => {
        async function fetchData() {
            const data = await fetchGameData(team, id);
            setTotalsData(data);
        }
        fetchData();
    }, [team, id]);
  
    const handleSortRequest = (cellId) => {
      const isDesc = orderBy === cellId && order === "desc";
      setOrder(isDesc ? "asc" : "desc");
      setOrderBy(cellId);
    }

    const getPlayer = async (player_name) => {
      const player_obj = player_content.find(obj => obj.title === player_name);
      const player = await fetchPlayer(player_obj.apiId);
      onSelect({
          ...player_obj,
          info: player,
      });
    }

    const createTableRows = (totalsMap, players, order, orderBy) => {
      const rows = [];
      const playerDict = players.reduce((acc, obj) => {
          acc[`${obj['firstName']} ${obj['lastName']}`] = obj;
          return acc;
      }, {});
      const iter = sortObject(totalsMap[orderBy], order);
      for (let playerId in iter) {
        const player = playerDict[playerId];
        if (!(`${player['firstName']} ${player['lastName']}` in totalsMap['pts'])) {
            continue;
        }

        rows.push(
          <TableRow key={playerId}>
            <StyledTableCell sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player['personId']}.png`} 
              alt={`${player['firstName']} ${player['lastName']}`} style={{ marginRight: "0.5rem", width: "5em", height: "5em", objectFit: "contain" }} />
              <Typography
                component="a"
                href="player"
                onClick={(e) => { e.preventDefault(); getPlayer(`${player['firstName']} ${player['lastName']}`) }}
                variant="highlight"
                sx={{ marginRight: "0.5rem" }}
              >
                {`${player['firstName']} ${player['lastName']}`}
              </Typography>
            </StyledTableCell>
            {totalsMap['min'][playerId] === -1 ? 
            <>
                <StyledTableCell colSpan={9} align="center">DNP</StyledTableCell>
            </>
            :
            <>
                <StyledTableCell>{new Intl.NumberFormat().format(totalsMap['min'][playerId])}</StyledTableCell>
                <StyledTableCell>{totalsMap['pts'][playerId]}</StyledTableCell>
                <StyledTableCell>{totalsMap['ast'][playerId]}</StyledTableCell>
                <StyledTableCell>{totalsMap['reb'][playerId]}</StyledTableCell>
                <StyledTableCell>{totalsMap['stl'][playerId]}</StyledTableCell>
                <StyledTableCell>{totalsMap['blk'][playerId]}</StyledTableCell>
                <StyledTableCell>{totalsMap['turnover'][playerId]}</StyledTableCell>
                <StyledTableCell>{totalsMap['fg'][playerId]}</StyledTableCell>
                <StyledTableCell>{totalsMap['fg3'][playerId]}</StyledTableCell>
            </>
            }
          </TableRow>
        );
      }
      return rows;
    }
  
      if (!totalsData) {
        return <div>Loading...</div>;
      }
  
      return (
        <Container fixed>
        <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
          <TableRow>
          <StyledTableCell><b>Player</b></StyledTableCell>
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
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "fg"}
              direction={orderBy === "fg" ? order : "desc"}
              onClick={() => handleSortRequest("fg")}
            >
              <b>FG</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "fg3"}
              direction={orderBy === "fg3" ? order : "desc"}
              onClick={() => handleSortRequest("fg3")}
            >
              <b>3PT</b>
            </TableSortLabel>
          </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {createTableRows(totalsData, team, order, orderBy)}
        </TableBody>

        </Table>
        </TableContainer>
        </Container>
      );
    }
  
export default BoxScoreTable;