import {Switch, Route, Redirect} from 'react-router-dom'
import {Component} from 'react'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Result from './components/Result'
import NotFound from './components/NotFound'
import ContextContainer from './Context/ContextComponent'
import './App.css'

// const questionStatus = {
//   initial: 'INITIAL',
//   inProgress: 'IN_PROGRESS',
//   success: 'SUCCESS',
// }

class App extends Component {
  state = {
    displayTime: 10,
    score: 0,
  }

  interval = null

  componentDidMount() {
    this.setState(prevState => ({displayTime: prevState.displayTime * 60}))
    this.triggerTime()
  }

  triggerTime = () => {
    this.interval = setInterval(() => {
      this.setState(prevState => ({displayTime: prevState.displayTime - 1}))
      const {displayTime} = this.state
      if (displayTime === 0) {
        clearInterval(this.interval)
      }
    }, 1000)
  }

  stopTriggerTime = () => {
    clearInterval(this.interval)
  }

  submitAnswer = myScore => {
    this.setState({score: myScore}, this.stopTriggerTime)
  }

  clickReattempt = () => {
    this.setState(
      {
        displayTime: 10 * 60,
        score: 0,
      },
      this.triggerTime,
    )
  }

  clickRetry = () => {
    this.getQuestionsList()
  }

  render() {
    const {score, displayTime} = this.state
    return (
      <ContextContainer.Provider
        value={{
          score,
          displayTime,
          clickQuestionNumber: this.clickQuestionNumber,
          clickOption: this.clickOption,
          changeSelectItem: this.changeSelectItem,
          clickNext: this.clickNext,
          clickReattempt: this.clickReattempt,
          clickRetry: this.clickRetry,
          submitAnswer: this.submitAnswer,
        }}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/assessment" component={Assessment} />
          <Route exact path="/result" component={Result} />
          <Route exact path="/bad-path" component={NotFound} />
          <Redirect to="/bad-path" />
        </Switch>
      </ContextContainer.Provider>
    )
  }
}

export default App
