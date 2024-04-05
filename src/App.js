import Cookies from 'js-cookie'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Component} from 'react'
import {v4 as uuid} from 'uuid'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Result from './components/Result'
import NotFound from './components/NotFound'
import ContextContainer from './Context/ContextComponent'
import './App.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const questionStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    questionNumberList: [],
    questionList: [],
    answerScore: 0,
    unAnswerScore: 10,
    displayTime: 10,
    currentQuestion: 1,
    currentAnswerId: '',
    selectItem: '',
    timeTaken: 0,
    yourScore: 0,
  }

  componentDidMount() {
    this.getQuestionsList()
  }

  numberOfQuestions = questionsLength => {
    let newObject
    const newNumberList = []
    for (let i = 1; i <= questionsLength; i += 1) {
      if (i === 1) {
        newObject = {
          id: uuid(),
          questionNumber: i,
          questionStatus: questionStatus.inProgress,
        }
      } else {
        newObject = {
          id: uuid(),
          questionNumber: i,
          questionStatus: questionStatus.initial,
        }
      }
      newNumberList.push(newObject)
    }
    this.setState({questionNumberList: newNumberList})
  }

  getQuestionsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/assess/questions'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const updatedData = data.questions.map(eachItem => ({
      id: eachItem.id,
      optionsType: eachItem.options_type,
      questionText: eachItem.question_text,
      options: eachItem.options.map(optionItem => ({
        id: optionItem.id,
        text: optionItem.text,
        isCorrect: optionItem.is_correct,
      })),
    }))
    this.numberOfQuestions(updatedData.length)
    console.log(updatedData)
    if (response.ok) {
      this.setState({
        questionList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeQuestionInitialToProgress = () => {
    const {currentQuestion, currentAnswerId, questionList} = this.state
    const isSuccessItem = questionList[
      currentQuestion - 2 < 0 ? 0 : currentQuestion - 2
    ].options.find(eachOption => eachOption.id === currentAnswerId)
    const isSuccessId = isSuccessItem ? isSuccessItem.id : undefined

    if (isSuccessId) {
      this.setState(prevState => ({
        answerScore: prevState.answerScore + 1,
        unAnswerScore: prevState.unAnswerScore - 1,
      }))
    }

    this.setState(prevState => ({
      questionNumberList: prevState.questionNumberList.map(eachItem => {
        //   console.log(index)
        //   console.log('current ', currentQuestion - 2)
        if (
          currentQuestion - 1 === eachItem.questionNumber &&
          isSuccessId === currentAnswerId
        ) {
          return {...eachItem, questionStatus: questionStatus.success}
        }

        if (
          currentQuestion === eachItem.questionNumber &&
          eachItem.questionStatus !== 'SUCCESS'
        ) {
          return {...eachItem, questionStatus: questionStatus.inProgress}
        }

        if (
          (eachItem.questionStatus === 'INITIAL' ||
            eachItem.questionStatus === 'IN_PROGRESS') &&
          currentQuestion !== eachItem.questionNumber
        ) {
          return {...eachItem, questionStatus: questionStatus.initial}
        }
        return {...eachItem}
      }),
      currentAnswerId: '',
    }))
  }

  clickReattempt = () => {
    this.setState(
      {
        apiStatus: apiStatusConstants.initial,
        questionNumberList: [],
        questionList: [],
        answerScore: 0,
        unAnswerScore: 10,
        displayTime: 10,
        currentQuestion: 1,
        currentAnswerId: '',
        selectItem: '',
        timeTaken: 0,
        yourScore: 0,
      },
      this.getQuestionsList,
    )
  }

  clickOption = event => {
    // console.log(event.target.id)
    this.setState({currentAnswerId: event.target.id})
  }

  clickQuestionNumber = questionNumber => {
    this.setState(
      {currentQuestion: questionNumber},
      this.changeQuestionInitialToProgress,
    )
  }

  changeSelectItem = selectValue => {
    console.log(selectValue)
    this.setState({
      currentAnswerId: selectValue,
      selectItem: selectValue,
    })
  }

  clickNext = () => {
    const {currentAnswerId, questionList, currentQuestion} = this.state
    if (currentAnswerId !== '') {
      const findItem = questionList[currentQuestion - 1].options.find(
        eachItem => eachItem.id === currentAnswerId,
      )
      if (findItem.isCorrect === 'true') {
        this.setState(
          prevState => ({
            currentQuestion: prevState.currentQuestion + 1,
            yourScore: prevState.yourScore + 1,
          }),
          this.changeQuestionInitialToProgress,
        )
      } else {
        this.setState(
          prevState => ({
            currentQuestion: prevState.currentQuestion + 1,
          }),
          this.changeQuestionInitialToProgress,
        )
      }
    } else {
      this.setState({showErrorMsg: true})
    }
  }

  clickRetry = () => {
    this.getQuestionsList()
  }

  render() {
    const {
      apiStatus,
      questionNumberList,
      questionList,
      answerScore,
      unAnswerScore,
      yourScore,
      displayTime,
      selectItem,
      timeTaken,
      currentQuestion,
      currentAnswerId,
    } = this.state
    return (
      <ContextContainer.Provider
        value={{
          apiStatus,
          questionNumberList,
          questionList,
          answerScore,
          unAnswerScore,
          yourScore,
          displayTime,
          selectItem,
          timeTaken,
          currentQuestion,
          currentAnswerId,
          clickQuestionNumber: this.clickQuestionNumber,
          clickOption: this.clickOption,
          changeSelectItem: this.changeSelectItem,
          clickNext: this.clickNext,
          clickReattempt: this.clickReattempt,
          clickRetry: this.clickRetry,
        }}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/assessment" component={Assessment} />
          <Route exact path="/results" component={Result} />
          <Route exact path="/bad-path" component={NotFound} />
          <Redirect to="/bad-path" />
        </Switch>
      </ContextContainer.Provider>
    )
  }
}

export default App
