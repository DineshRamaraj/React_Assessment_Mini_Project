import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'
import './index.css'

class Assessment extends Component {
  state = {
    questionList: [],
    answerScore: 0,
    unAnswerScore: 10,
    displayTime: 0,
  }

  componentDidMount() {
    this.getQuestionsList()
  }

  getQuestionsList = async () => {
    const apiUrl = 'https://apis.ccbp.in/assets/questions'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
  }

  render() {
    const {answerScore, unAnswerScore, questionList, displayTime} = this.state
    return (
      <>
        <Header />
        <div className="assessment-container">
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
              <li className="questions-item">{1}</li>
            </ul>
            <button type="button" className="submit-assessment-button">
              Submit Assessment
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default Assessment
