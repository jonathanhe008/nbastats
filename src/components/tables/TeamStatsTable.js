import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Container, styled, Typography, TableContainer } from '@mui/material';
import { fetchTotalsData, fetchPlayer } from '../../api/api';
import players from '../../assets/players.json'

function sortObject(obj, order) {
    const sortedEntries = Object.entries(obj).sort((a, b) => {
      if (order === "desc") {
        return b[1] - a[1];
      } else {
        return a[1] - b[1];
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

class TeamStatsTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        totalsData: null,
        orderBy: "pts",
        order: "desc",
        players: props.option.info
      };
      this.handleSortRequest = this.handleSortRequest.bind(this);
    }
  
    async componentDidMount() {
      const data = await fetchTotalsData(this.props.option.info);
      this.setState({ totalsData: data });
    }
  
    async componentDidUpdate(prevProps) {
      if (this.props.option !== prevProps.option) {
        const data = await fetchTotalsData(this.props.option.info);
        this.setState({ totalsData: data, players: this.props.option.info });
      }
    }
  
    handleSortRequest(cellId) {
      const { orderBy, order } = this.state;
      const isDesc = orderBy === cellId && order === "desc";
      this.setState({
        order: isDesc ? "asc" : "desc",
        orderBy: cellId,
      });
    }

    async getPlayer(player_name) {
      const player_obj = player_content.find(obj => obj.title === player_name);
      const player = await fetchPlayer(player_obj.apiId);
      this.props.onSelect({
          ...player_obj,
          info: player,
      });
    }

    createTableRows(totalsMap, players, order, orderBy) {
      const rows = [];
      const playerDict = players.reduce((acc, obj) => {
          acc[`${obj['firstName']} ${obj['lastName']}`] = obj;
          return acc;
      }, {});
      
      const iter = sortObject(totalsMap[orderBy], order);
      for (let playerId in iter) {
        const player = playerDict[playerId];
        rows.push(
          <TableRow key={playerId}>
            <StyledTableCell sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player['personId']}.png`} 
              alt={`${player['firstName']} ${player['lastName']}`} style={{ marginRight: "0.5rem", width: "5em", height: "5em", objectFit: "contain" }} />
              <Typography
                component="a"
                href="player"
                onClick={(e) => { e.preventDefault(); this.getPlayer(`${player['firstName']} ${player['lastName']}`) }}
                variant="highlight"
                sx={{ marginRight: "0.5rem" }}
              >
                {`${player['firstName']} ${player['lastName']}`}
              </Typography>
            </StyledTableCell>
            <StyledTableCell>{new Intl.NumberFormat().format(totalsMap['min'][playerId])}</StyledTableCell>
            <StyledTableCell>{totalsMap['pts'][playerId]}</StyledTableCell>
            <StyledTableCell>{totalsMap['ast'][playerId]}</StyledTableCell>
            <StyledTableCell>{totalsMap['reb'][playerId]}</StyledTableCell>
            <StyledTableCell>{totalsMap['stl'][playerId]}</StyledTableCell>
            <StyledTableCell>{totalsMap['blk'][playerId]}</StyledTableCell>
            <StyledTableCell>{totalsMap['turnover'][playerId]}</StyledTableCell>
            <StyledTableCell>{totalsMap['fg_pct'][playerId]}%</StyledTableCell>
            <StyledTableCell>{totalsMap['fg3_pct'][playerId]}%</StyledTableCell>
            <StyledTableCell>{totalsMap['ft_pct'][playerId]}%</StyledTableCell>
          </TableRow>
        );
      }
      return rows;
  }
  
    render() {
      const { totalsData, orderBy, order, players } = this.state;
  
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
              onClick={() => this.handleSortRequest("min")}
            >
              <b>Min</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "pts"}
              direction={orderBy === "pts" ? order : "desc"}
              onClick={() => this.handleSortRequest("pts")}
            >
              <b>Pts</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "ast"}
              direction={orderBy === "ast" ? order : "desc"}
              onClick={() => this.handleSortRequest("ast")}
            >
              <b>Ast</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "reb"}
              direction={orderBy === "reb" ? order : "desc"}
              onClick={() => this.handleSortRequest("reb")}
            >
              <b>Reb</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "stl"}
              direction={orderBy === "stl" ? order : "desc"}
              onClick={() => this.handleSortRequest("stl")}
            >
              <b>Stl</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "blk"}
              direction={orderBy === "blk" ? order : "desc"}
              onClick={() => this.handleSortRequest("blk")}
            >
              <b>Blk</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "turnover"}
              direction={orderBy === "turnover" ? order : "desc"}
              onClick={() => this.handleSortRequest("turnover")}
            >
              <b>Tov</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "fg_pct"}
              direction={orderBy === "fg_pct" ? order : "desc"}
              onClick={() => this.handleSortRequest("fg_pct")}
            >
              <b>FG</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "fg3_pct"}
              direction={orderBy === "fg3_pct" ? order : "desc"}
              onClick={() => this.handleSortRequest("fg3_pct")}
            >
              <b>3PT</b>
            </TableSortLabel>
          </StyledTableCell>
          <StyledTableCell>
            <TableSortLabel
              active={orderBy === "ft_pct"}
              direction={orderBy === "ft_pct" ? order : "desc"}
              onClick={() => this.handleSortRequest("ft_pct")}
            >
              <b>FT</b>
            </TableSortLabel>
          </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {this.createTableRows(totalsData, players, order, orderBy)}
        </TableBody>

        </Table>
        </TableContainer>
        </Container>
      );
    }
  }
  
export default TeamStatsTable;