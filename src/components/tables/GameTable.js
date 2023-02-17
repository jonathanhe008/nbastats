import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Container, styled } from '@mui/material';
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


const StyledTableCell = styled(TableCell)({
  padding: '.5rem .5rem',
})

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
        const isDesc = orderBy === cellId && order === "desc";
        setOrder(isDesc ? "asc" : "desc");
        setOrderBy(cellId);
    };
    
    const sortedData = gameData ? stableSort(gameData, getComparator(order, orderBy), orderBy) : [];

    if (!gameData) {
      return <div>Loading...</div>;
    }
  
  
  return (
    <Container fixed>
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
                  <img
                    src={teams[d.game.visitor_team_id].logo}
                    alt="visitor team logo"
                    style={{ marginRight: "0.5rem", width: "2em", height: "2em", objectFit: "contain" }}
                  />
                  {teams[d.game.visitor_team_id].name} @{" "}
                  <img
                    src={teams[d.game.home_team_id].logo}
                    alt="home team logo"
                    style={{ marginRight: "0.5rem", marginLeft: "0.1rem", width: "2em", height: "2em", objectFit: "contain" }}
                  />
                  {teams[d.game.home_team_id].name}
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
    </Container>
  );
};

export default GameTable;
