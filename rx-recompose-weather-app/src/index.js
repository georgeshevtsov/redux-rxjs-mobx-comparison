import React from "react"
import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import axios from 'axios';
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler,
  mapPropsStream,
  compose
} from "recompose"

setObservableConfig(config)

const APPID = '3c4703f7900ceea32c41dc6652ee61e9'

const fetchLocationStr = location => {
    return axios(`https://api.openweathermap.org/data/2.5/weather?appid=${APPID}&q=${location}&units=metric`)
}

const getWeather = mapPropsStream(props$ => {
    const {
        stream: onClick$,
        handler: onClick
    } = createEventHandler();

    const click$ = onClick$
    .startWith('')
    .switchMap(
      (v) => v.length 
        ? Observable
          .fromPromise(fetchLocationStr(v))
          .startWith({ data: { name: "loading..." }})
          .catch(err => Observable.of({
            data : {
              name: 'Not found...'
            }
          }))
          .pluck('data')
        : Observable.of(v)
    )
    return props$
      .switchMap(
        props => click$,
        (props, data) => ({ ...props, data, onClick, text: '' })
      )
})

const text = mapPropsStream(props$ => {
    const {
        stream: onChange$,
        handler: onChange
    } = createEventHandler();
    const text$ = onChange$
        .map(e => e.target.value)
        .startWith('') 
    return props$.switchMap(
        props => text$,
        (props, text) => ({...props, text, onChange})
    );
});


class FindWeather extends React.Component {
  findWeather = () => {
    this.props.onClick(this.props.text);
  }
  getTemperature = (data) => {
    return data.main ? data.main.temp + '°C' : ''
  }
  getCityName = data => {
    return data.name || '' 
  }
  render() {
    return (
      <div>
        <input type="text" onChange={this.props.onChange} value={this.props.text}/> 
        <button onClick={this.findWeather}>Get Weather</button>
        <h2>{`${this.getCityName(this.props.data)} ${this.getTemperature(this.props.data)}`}</h2>
      </div>
    );
  }
}

const FindWeatherComposed = compose(
  getWeather,
  text,
)(FindWeather)

const App = () => (
  <div>
    <FindWeatherComposed />
  </div>
)

render(<App />, document.getElementById("root"))
