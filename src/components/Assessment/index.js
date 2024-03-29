import Cookies from 'js-cookie'
import {v4 as uuid} from 'uuid'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Header from '../Header'
import './index.css'

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

class Assessment extends Component {
  state = {
    questionList: [],
    answerScore: 0,
    unAnswerScore: 10,
    displayTime: 10,
    currentQuestion: 0,
    apiStatus: apiStatusConstants.initial,
    questionNumberList: [],
  }

  componentDidMount() {
    this.getQuestionsList()
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
    // console.log(updatedData)
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

  renderLoading = () => (
    <>
      <Header />
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#263868" height={50} width={50} />
      </div>
    </>
  )

  numberOfQuestions = questionLength => {
    let newObject
    const newNumberList = []
    for (let i = 1; i <= questionLength; i += 1) {
      newObject = {
        id: uuid(),
        questionNumber: i,
        status: questionStatus.initial,
      }
      newNumberList.push(newObject)
    }
    this.setState({questionNumberList: newNumberList})
  }

  renderSuccess = () => {
    const {
      answerScore,
      unAnswerScore,
      questionList,
      displayTime,
      currentQuestion,
      questionNumberList,
    } = this.state

    const question = questionList[currentQuestion]
    return (
      <>
        <Header />
        <div className="assessment-side-container">
          <div className="time-container">
            <p className="time-title">Time Left</p>
            <p className="display-time">{displayTime}</p>
          </div>
          <div className="answer-details-container">
            <div className="answered-questions">
              <div className="answer-score-container">
                <p className="answer-score">{answerScore}</p>
              </div>
              <p className="answer-title">Answered Questions</p>
            </div>
            <div className="un-answered-questions">
              <div className="un-answer-score-container">
                <p className="un-answer-score">{unAnswerScore}</p>
              </div>
              <p className="un-answer-title">Unanswered Questions</p>
            </div>
            <hr className="horizontal-line" />
            <h1 className="question-topic">
              Questions ({questionList.length})
            </h1>
            <ul className="questions-list-container">
              {questionNumberList.map(eachNumber => (
                <li className="questions-item" key={eachNumber.id}>
                  {eachNumber.questionNumber}
                </li>
              ))}
            </ul>
            <button type="button" className="submit-assessment-button">
              Submit Assessment
            </button>
          </div>
        </div>
        <div className="question-and-answer-container">
          <p className="question-title">
            {currentQuestion}
            {question.questionText}
          </p>
          <ul className="question-default-container">
            {question.options.map(eachItem => (
              <li className="question-default-item" key={eachItem.id}>
                <button type="button" onClick={this.clickOption}>
                  {eachItem.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }
}

export default Assessment
