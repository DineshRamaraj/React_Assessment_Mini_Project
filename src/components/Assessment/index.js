import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'
import './index.css'

class Assessment extends Component {
  state = {
    questionList: [],
    answerScore: 0,
    unAnswerScore: 10,
    displayTime: 10,
    currentQuestion: 0,
  }

  componentDidMount() {
    this.getQuestionsList()
  }

  updatedData = data => ({
    id: data.id,
    optionsType: data.options_type,
    questionText: data.question_text,
    options: data.options.map(eachItem => ({
      id: eachItem.id,
      text: eachItem.text,
      isCorrect: eachItem.is_correct,
    })),
  })

  getQuestionsList = async () => {
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
    const updatedData = data.questions.map(eachItem =>
      this.updatedData(eachItem),
    )
    // console.log(updatedData)
    if (response.ok) {
      this.setState({questionList: updatedData})
    }
  }

  render() {
    const {
      answerScore,
      unAnswerScore,
      questionList,
      displayTime,
      currentQuestion,
    } = this.state
    const questionItem = questionList[currentQuestion]
    console.log(questionItem)
    console.log(currentQuestion)
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
              <li className="questions-item">{1}</li>
            </ul>
            <button type="button" className="submit-assessment-button">
              Submit Assessment
            </button>
          </div>
        </div>
        <div className="question-and-answer-container">
          <p className="question-title">
            {currentQuestion}
            {/* {questionText} */}
          </p>
          {/* <ul className="question-default-container">
            {questionList[currentQuestion].options.map(eachItem => (
              <li className="question-default-item" key={eachItem.id}>
                <button type="button" onClick={this.clickOption}>
                  {eachItem.text}
                </button>
              </li>
            ))}
          </ul> */}
        </div>
      </>
    )
  }
}

export default Assessment
