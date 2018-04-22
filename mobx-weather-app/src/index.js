import {observable, computed, action } from 'mobx';
import {observer, Provider} from 'mobx-react';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
const APPID = "6c9bb64443d124019b41ea00de26732e"

class Temperature {
  @observable temperatureCelsius = '';
  @observable location = '';
  @observable loading = false;

  @action fetch() {
     window.fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${APPID}&q=${this.location}&units=metric`)
    .then(res => res.json()
    .then(action(json => {
      this.temperatureCelsius = json.main.temp;
      this.location = json.name;
      this.loading = false;
    })))
  }
  @action setLocation(city) {
    this.location = city;
    this.fetch();
  }

   
  @computed get temperature() {
    let tempString = this.temperatureCelsius != '' ? this.temperatureCelsius + "ºC" : ''
    return tempString;
  }
}

const App = observer(
  ["temperature"],
  ({ temperature }) => (
  <div>
    <TemperatureInput />
    <h2>
        {`${temperature.location} ${temperature.loading ? "loading.." : temperature.temperature}`}
      </h2>
  </div>
))

@observer(["temperature"])
class TemperatureInput extends React.Component {
  @observable input = "";
  render() {
    return (
      <div>
        <input 
          onChange={this.onChange}
          value={this.input}
        />
        <button onClick={this.onSubmit}>Get Weather</button>
      </div>
    )
  }

  @action onChange = (e) => {
    this.input = e.target.value
  }
  
  @action onSubmit = () => {
    this.props.temperature.setLocation(this.input);
    this.input = ""
  }
}

const temp = observable(new Temperature())

ReactDOM.render(
  <Provider temperature={temp}>
    <App />
  </Provider>,
  document.getElementById("root")
)