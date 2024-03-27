import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import './App.css'

const App = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route exact path="/" component={Home} />
    <Route exact path="/assessment" component={Assessment} />
  </Switch>
)

export default App
