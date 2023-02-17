import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { fetchTotalsData } from '../../api/api';

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

function createTableRows(totalsMap, players, order, orderBy) {
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
          <TableCell>
            <img src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player['personId']}.png`} 
            alt={`${player['firstName']} ${player['lastName']}`} width="50px" />
            {`${player['firstName']} ${player['lastName']}`}
          </TableCell>
          <TableCell>{totalsMap['pts'][playerId]}</TableCell>
          <TableCell>{totalsMap['ast'][playerId]}</TableCell>
          <TableCell>{totalsMap['reb'][playerId]}</TableCell>
          <TableCell>{totalsMap['stl'][playerId]}</TableCell>
          <TableCell>{totalsMap['blk'][playerId]}</TableCell>
          <TableCell>{totalsMap['turnover'][playerId]}</TableCell>
          <TableCell>{new Intl.NumberFormat().format(totalsMap['min'][playerId])}</TableCell>
        </TableRow>
      );
    }
    return rows;
}

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
      const data = await fetchTotalsData(this.props.option);
      this.setState({ totalsData: data });
    }
  
    async componentDidUpdate(prevProps) {
      if (this.props.option !== prevProps.option) {
        const data = await fetchTotalsData(this.props.option);
        this.setState({ totalsData: data, players: this.props.option.info });
      }
    }
  
    handleSortRequest(cellId) {
      const { orderBy, order } = this.state;
      const isAsc = orderBy === cellId && order === "asc";
      this.setState({
        order: isAsc ? "desc" : "asc",
        orderBy: cellId,
      });
    }
  
    render() {
      const { totalsData, orderBy, order, players } = this.state;
  
      if (!totalsData) {
        return <div>Loading...</div>;
      }
  
      return (
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
          <TableRow>
          <TableCell>Player</TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "pts"}
              direction={orderBy === "pts" ? order : "asc"}
              onClick={() => this.handleSortRequest("pts")}
            >
              Pts
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "ast"}
              direction={orderBy === "ast" ? order : "asc"}
              onClick={() => this.handleSortRequest("ast")}
            >
              Ast
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "reb"}
              direction={orderBy === "reb" ? order : "asc"}
              onClick={() => this.handleSortRequest("reb")}
            >
              Reb
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "stl"}
              direction={orderBy === "stl" ? order : "asc"}
              onClick={() => this.handleSortRequest("stl")}
            >
              Stl
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "blk"}
              direction={orderBy === "blk" ? order : "asc"}
              onClick={() => this.handleSortRequest("blk")}
            >
              Blk
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "turnover"}
              direction={orderBy === "turnover" ? order : "asc"}
              onClick={() => this.handleSortRequest("turnover")}
            >
              Tov
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === "min"}
              direction={orderBy === "min" ? order : "asc"}
              onClick={() => this.handleSortRequest("min")}
            >
              Min
            </TableSortLabel>
          </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {createTableRows(totalsData, players, order, orderBy)}
        </TableBody>

        </Table>
      );
    }
  }
  
export default TeamStatsTable;