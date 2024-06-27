/* eslint-disable import/no-unresolved */
import {Switch, Route, Redirect} from 'react-router-dom'
import {Component} from 'react'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Result from './components/Result'
import TimeUp from './components/TimeUp'
import NotFound from './components/NotFound'
import Failure from './components/Failure'
import ContextContainer from './Context/ContextComponent'
import './App.css'

class App extends Component {
  state = {
    resultTime: 0,
    score: 0,
  }

  //   componentWillUnmount() {
  //     this.setState({score: 0, resultTime: 0})
  //   }

  submitAnswer = (myScore, displayTime) => {
    this.setState({score: myScore, resultTime: displayTime})
  }

  clickReattempt = () => {
    this.setState({resultTime: 0, score: 0})
  }

  render() {
    const {score, resultTime} = this.state
    return (
      <ContextContainer.Provider
        value={{
          score,
          resultTime,
          submitAnswer: this.submitAnswer,
          clickReattempt: this.clickReattempt,
        }}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/assessment" component={Assessment} />
          <Route exact path="/results" component={Result} />
          <Route exact path="/time-up" component={TimeUp} score={score} />
          <Route exact path="/failure" component={Failure} />
          <Route exact path="/bad-path" component={NotFound} />
          <Redirect to="/bad-path" />
        </Switch>
      </ContextContainer.Provider>
    )
  }
}

export default App
