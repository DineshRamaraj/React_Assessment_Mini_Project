/* eslint-disable import/no-unresolved */
import {Switch, Route, Redirect} from 'react-router-dom'
import {Component} from 'react'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Result from './components/Result'
import NotFound from './components/NotFound'
import Failure from './components/Failure'
import './App.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/assessment" component={Assessment} />
        <Route exact path="/results" component={Result} />
        <Route exact path="/failure" component={Failure} />
        <Route exact path="/bad-path" component={NotFound} />
        <Redirect to="/bad-path" />
      </Switch>
    )
  }
}

export default App
