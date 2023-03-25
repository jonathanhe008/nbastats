import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, styled, Typography, TableContainer } from '@mui/material';
import { fetchAverageData } from '../../api/api';
import teams from '../../assets/teams.json'
import players from '../../assets/players.json'
import teamPlayers from '../../assets/team_players.json'

const StyledTableCell = styled(TableCell)({
  padding: '.5rem .5rem',
})

const team_content = Object.entries(teams).map(([key, value]) => ({ 
    title: value.name,
    apiId: key,
    id: value.id,
    category: 'Team'
}));

class SeasonAverageTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      averageData: null,
    };
  }

  async componentDidMount() {
    console.log(this.props.option)
    const data = await fetchAverageData(this.props.option.apiId);
    this.setState({ averageData: data });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.option !== prevProps.option) {
      const data = await fetchAverageData(this.props.option.apiId);
      this.setState({ averageData: data });
    }
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
    const { averageData } = this.state;

    if (!averageData) {
      return <div>Loading...</div>;
    }
    const team = this.props.option.info.team;
    return (
      <TableContainer sx={{ overflowX: "auto", maxWidth: "85%", margin: "0 auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
            <StyledTableCell>
                <b>Season Stats</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>Min</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>Pts</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>Ast</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>Reb</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>Stl</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>Blk</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>Tov</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>FG</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>3PT</b>
            </StyledTableCell>
            <StyledTableCell>
                <b>FT</b>
            </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
            <StyledTableCell sx={{ display: "flex", alignItems: "center" }}>
            <img src={teams[team.id].logo} alt="team logo" style={{ marginRight: "1rem", marginLeft: "0.5rem", width: "2em", height: "2em", objectFit: "contain" }} /> 
            <Typography component="a" href="team" onClick={(e) => { e.preventDefault(); this.getTeam(team.full_name) }} variant="highlight" sx={{ marginRight: "12.75rem" ,
            '@media screen and (max-width: 767px)': { marginRight: "0.5rem" }}}>{team.full_name}</Typography>
            </StyledTableCell>
            <StyledTableCell>{averageData.min}</StyledTableCell>
            <StyledTableCell>{averageData.pts}</StyledTableCell>
            <StyledTableCell>{averageData.ast}</StyledTableCell>
            <StyledTableCell>{averageData.reb}</StyledTableCell>
            <StyledTableCell>{averageData.stl}</StyledTableCell>
            <StyledTableCell>{averageData.blk}</StyledTableCell>
            <StyledTableCell>{averageData.turnover}</StyledTableCell>
            <StyledTableCell>{averageData.fg_pct}</StyledTableCell>
            <StyledTableCell>{averageData.fg3_pct}</StyledTableCell>
            <StyledTableCell>{averageData.ft_pct}</StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
        </TableContainer>
    );

 }
}

export default SeasonAverageTable;
