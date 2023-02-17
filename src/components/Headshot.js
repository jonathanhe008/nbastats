import React, { Component } from 'react'
import teams from '../assets/teams.json'

class Headshot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: props.option.category === "Player" ? `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${props.option.id}.png`
             : teams[props.option.apiId].logo
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.option !== prevProps.option) {
          this.setState({
            src: this.props.option.category === "Player" ? `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${this.props.option.id}.png`
                 : teams[this.props.option.apiId].logo
          });
        }
    }
    render() {
        return <img alt="Headshot" src={this.state.src} height="100px"/>;
    }
    
}

export default Headshot;