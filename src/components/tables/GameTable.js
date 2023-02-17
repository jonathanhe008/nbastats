import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { fetchGameData } from '../../api/api';
import teams from '../../assets/teams.json'

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

const GameTable = ({ option }) => {
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
        const isAsc = orderBy === cellId && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(cellId);
    };
    
    const sortedData = gameData ? stableSort(gameData, getComparator(order, orderBy), orderBy) : [];

    if (!gameData) {
      return <div>Loading...</div>;
    }
  
  
  return (
    
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>
            <TableSortLabel
              active={orderBy === "date"}
              direction={orderBy === "date" ? order : "asc"}
              onClick={() => handleSortRequest("date")}
            >
              Date
            </TableSortLabel>
          </TableCell>
          <TableCell>Game</TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "min"}
              direction={orderBy === "min" ? order : "asc"}
              onClick={() => handleSortRequest("min")}
            >
              Min
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "pts"}
              direction={orderBy === "pts" ? order : "asc"}
              onClick={() => handleSortRequest("pts")}
            >
              Pts
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "ast"}
              direction={orderBy === "ast" ? order : "asc"}
              onClick={() => handleSortRequest("ast")}
            >
              Ast
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "reb"}
              direction={orderBy === "reb" ? order : "asc"}
              onClick={() => handleSortRequest("reb")}
            >
              Reb
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "stl"}
              direction={orderBy === "stl" ? order : "asc"}
              onClick={() => handleSortRequest("stl")}
            >
              Stl
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "blk"}
              direction={orderBy === "blk" ? order : "asc"}
              onClick={() => handleSortRequest("blk")}
            >
              Blk
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "turnover"}
              direction={orderBy === "turnover" ? order : "asc"}
              onClick={() => handleSortRequest("turnover")}
            >
              Tov
            </TableSortLabel>
          </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((d) => {
            return (
            <TableRow key={d.game.id}>
                <TableCell component="th" scope="row">
                {formatDate(d.game.date)}
                </TableCell>
                <TableCell>
                <img src={teams[d.game.visitor_team_id].logo} alt="visitor team logo" width="5%"/>
                {teams[d.game.visitor_team_id].name} @{" "}
                <img src={teams[d.game.home_team_id].logo} alt="home team logo" width="5%"/>
                {teams[d.game.home_team_id].name}
                </TableCell>
                {isDnp(d) ? 
                (<TableCell colSpan={7} align="center">
                DNP
                </TableCell>) : (
                <>
                <TableCell>{d.min}</TableCell>
                <TableCell>{d.pts}</TableCell>
                <TableCell>{d.ast}</TableCell>
                <TableCell>{d.reb}</TableCell>
                <TableCell>{d.stl}</TableCell>
                <TableCell>{d.blk}</TableCell>
                <TableCell>{d.turnover}</TableCell>
                </>
                )}
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
  );
};

export default GameTable;
