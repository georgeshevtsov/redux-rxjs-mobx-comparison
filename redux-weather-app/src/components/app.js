import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeather } from "../actions/weatherActions";
import { get } from 'lodash';

class App extends Component {
    state = {
        input: ''
    };
  getTemperature = (data) => {
      let temp = get(data, 'data.main.temp', false);
      return temp ? temp + '°C' : '';
  };
  getCityName = (data) => {
      return get(data, 'data.name', '')
  };
  fetchWeather = () => {
      if (this.state.input.length) {
          this.props.fetchWeather(this.state.input);
          this.setState({ input : ''})
      }
  };
  render() {
      console.log(this.props.weather);
    return (
      <div>
          <input type="text" onChange={(e) => this.setState({ input: e.target.value})} value={this.state.input}/>
          <button onClick={this.fetchWeather} disabled={!this.state.input.length}>Get weather</button>
          <h2>{`${this.getCityName(this.props.weather)} ${this.getTemperature(this.props.weather)}`}</h2>
      </div>
    );
  }
}
function mapStateToProps(state) {
    return {
        weather: state.weather
    }
}
export default connect(mapStateToProps, ({ fetchWeather }))(App);

