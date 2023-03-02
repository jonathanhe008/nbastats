import React, { Component } from 'react';
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

class GameTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameData: null,
      orderBy: "date",
      order: "desc"
    };
    this.handleSortRequest = this.handleSortRequest.bind(this);
  }

  async componentDidMount() {
    const data = await fetchGameData(this.props.option);
    this.setState({ gameData: data });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.option !== prevProps.option) {
      const data = await fetchGameData(this.props.option);
      this.setState({ gameData: data});
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

  getGameResult(data) {
    const isHome = data.game.home_team_id === data.team.id;
    const homeScore = data.game.home_team_score;
    const visitorScore = data.game.visitor_team_score;
    const isFinal = data.game.status === "Final";
    const result = isHome ? (homeScore > visitorScore ? "W" : "L") : (visitorScore > homeScore ? "W" : "L");
    const color = result === "W" ? "green" : "red";

    if (isFinal) {
      return (
        <span style={{ color: color }}>
          {" "}
          {result} {isHome ? `${homeScore} - ${visitorScore}` : `${visitorScore} - ${homeScore}`}
        </span>
      );
    }
    return `${visitorScore} - ${homeScore}`;
  }

  getGame(data) {
    const homeTeam = teams[data.game.home_team_id];
    const visitorTeam = teams[data.game.visitor_team_id];
    const homeLogo = <img src={homeTeam.logo} alt="home team logo" style={{ marginRight: "0.5rem", marginLeft: "0.5rem", width: "2em", height: "2em", objectFit: "contain" }} />;
    const visitorLogo = <img src={visitorTeam.logo} alt="visitor team logo" style={{ marginRight: "0.5rem", marginLeft: "0.5rem", width: "2em", height: "2em", objectFit: "contain" }} />;
    const homeName = <Typography component="a" href="team" onClick={(e) => { e.preventDefault(); this.getTeam(homeTeam.name) }} variant="highlight" sx={{ marginRight: "0.5rem" }}>{homeTeam.name}</Typography>;
    const visitorName = <Typography component="a" href="team" onClick={(e) => { e.preventDefault(); this.getTeam(visitorTeam.name) }} variant="highlight" sx={{ marginRight: "0.5rem" }}>{visitorTeam.name}</Typography>;
    const separator = " @ ";
  
    if (data.game.home_team_id === data.team.id) {
      return (
        <>
          {homeLogo}
          {homeName}
          {" vs "} 
          {visitorLogo}
          {visitorName}
        </>
      );
    }
    
    return (
      <>
        {visitorLogo}
        {visitorName}
        {separator}
        {homeLogo}
        {homeName}
      </>
    );
  }

  async getTeam(team_name) {

    const team = team_content.find(obj => obj.title === team_name);
    let player_list = [];
    const team_players = teamPlayers[teams[team.apiId].abbrev];
    console.log("Official team list: ", team_players);
    players['league']['standard'].forEach(player => {
        if (team_players.includes(`${player['firstName']} ${player['lastName']}`))
        player_list.push(player);
    });
    console.log("Team list found: ", player_list);
    this.props.onSelect({
        ...team,
        info: player_list,
    });
  }

  render() {
    const { gameData, orderBy, order } = this.state;

    if (!gameData) {
      return <div>Loading...</div>;
    }
    const sortedData = stableSort(gameData, getComparator(order, orderBy), orderBy);
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
                onClick={() => this.handleSortRequest("date")}
              >
                <b>Date</b>
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell><b>Game</b></StyledTableCell>
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
                    {this.getGame(d)}
                    <div style={{ marginLeft: "auto", marginRight: "1rem" }}>{this.getGameResult(d)}</div>
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

 }
}

export default GameTable;
