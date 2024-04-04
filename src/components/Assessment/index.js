
import Cookies from 'js-cookie'
import {v4 as uuid} from 'uuid'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Header from '../Header'
import ContextContainer from '../../Context/ContextComponent'
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

const optionsTypeConstants = {
  default: 'DEFAULT',
  image: 'IMAGE',
  singleSelect: 'SINGLE_SELECT',
}

class Assessment extends Component {
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

  clickNextButton = () => {
    const {currentAnswerId, questionList, currentQuestion} = this.state
    const findItem = questionList[currentQuestion - 1].options.find(
      eachItem => eachItem.id === currentAnswerId,
    )
    console.log(findItem)
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
  }

  submitAssessment = () =>{
      this.clickNextButton()
      <Redirect to="/result"/>
  }

  renderSideContainer = () => {
    const {
      answerScore,
      unAnswerScore,
      questionList,
      displayTime,
      questionNumberList,
    } = this.state
    return (
      <div className="assessment-side-container">
        <div className="assessment-time-question-number-container">
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
              {questionNumberList.map(eachNumber => {
                const clickQuestionNumber = () => {
                  /* const {currentQuestion} = this.state */

                  const findItem = questionNumberList.find(
                    eachItem =>
                      eachItem.questionNumber === eachNumber.questionNumber,
                  )
                  if (findItem.questionStatus !== 'SUCCESS') {
                    this.setState(
                      {currentQuestion: eachNumber.questionNumber},
                      this.changeQuestionInitialToProgress,
                    )
                  }
                }
                const eachItemStatus = () => {
                  if (eachNumber.questionStatus === questionStatus.initial) {
                    return 'initial-status'
                  }
                  if (eachNumber.questionStatus === questionStatus.inProgress) {
                    return 'progress-status'
                  }
                  return 'answered-status'
                }

                const questionsNumberStatus =
                  eachNumber.questionStatus !== 'SUCCESS'
                    ? 'questions-number-status'
                    : ''

                return (
                  <li
                    className={`${eachItemStatus()} questions-item`}
                    key={eachNumber.id}
                  >
                    <button
                      type="button"
                      className={`${questionsNumberStatus} questions-number-button`}
                      onClick={clickQuestionNumber}
                    >
                      {eachNumber.questionNumber}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="submit-button-container">
          <button
            type="button"
            className="submit-assessment-button"
            onClick={this.submitAssessment}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    )
  }

  clickOption = event => {
    // console.log(event.target.id)
    this.setState({currentAnswerId: event.target.id})
  }

  renderDefaultOptions = () => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    const {options} = questionList[currentQuestion - 1]
    // console.log(options)
    return (
      <ul className="question-default-container">
        {options.map(eachItem => (
          <li className="question-default-item" key={eachItem.id}>
            <button
              id={eachItem.id}
              type="button"
              className={
                currentAnswerId === eachItem.id
                  ? 'active-default-button question-and-answer-default-button'
                  : 'question-and-answer-default-button'
              }
              onClick={this.clickOption}
            >
              {eachItem.text}
            </button>
          </li>
        ))}
      </ul>
    )
  }

  renderImageOptions = () => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    const {options} = questionList[currentQuestion - 1]
    // console.log(questionList[currentQuestion - 1])
    return (
      <ul className="question-image-container">
        {options.map(eachItem => {
          let optionsImage
          if (eachItem.text === 'flex start') {
            optionsImage =
              'https://res.cloudinary.com/dhwz560kk/image/upload/v1711733196/t8s3g8v5szdaltu5wlf9.png'
          }
          if (eachItem.text === 'flex center') {
            optionsImage =
              'https://res.cloudinary.com/dhwz560kk/image/upload/v1711735685/ysa27uxni7piyxlohkm7.png'
          }
          if (eachItem.text === 'space between') {
            optionsImage =
              'https://res.cloudinary.com/dhwz560kk/image/upload/v1711735513/bx8jx0jxgd5zbwzvdtlv.png'
          }
          if (eachItem.text === 'flex end') {
            optionsImage =
              'https://res.cloudinary.com/dhwz560kk/image/upload/v1711735513/zdylxw8fqvyn4dbvwu66.png'
          }
          return (
            <li className="question-image-item" key={eachItem.id}>
              <button
                id={eachItem.id}
                type="button"
                className={
                  currentAnswerId === eachItem.id
                    ? 'active-image-button question-and-answer-image-button'
                    : 'question-and-answer-image-button'
                }
                onClick={this.clickOption}
              >
                <img
                  id={eachItem.id}
                  src={optionsImage}
                  alt={eachItem.text}
                  className="question-button-image"
                />
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  clickSelectItem = event => {
    console.log(event.target.value)
    this.setState({
      currentAnswerId: event.target.value,
      selectItem: event.target.value,
    })
  }

  renderSingleSelectOptions = () => {
    const {questionList, currentQuestion, selectItem} = this.state
    const {options} = questionList[currentQuestion - 1]
    return (
      <select
        value={selectItem}
        onChange={this.clickSelectItem}
        className="question-select-container"
        defaultValue={options[0].id}
      >
        {options.map(eachItem => (
          <option
            id={eachItem.id}
            key={eachItem.id}
            value={eachItem.id}
            className="question-select-item"
          >
            {eachItem.text}
          </option>
        ))}
      </select>
    )
  }

  renderMainAnswerOptionsContainer = () => {
    const {questionList, currentQuestion} = this.state
    const {optionsType} = questionList[currentQuestion - 1]

    switch (optionsType) {
      case optionsTypeConstants.default:
        return this.renderDefaultOptions()
      case optionsTypeConstants.image:
        return this.renderImageOptions()
      case optionsTypeConstants.singleSelect:
        return this.renderSingleSelectOptions()
      default:
        return null
    }
  }

  renderSuccess = () => {
    const {questionList, currentQuestion, yourScore, timeTaken} = this.state
    const {questionText} = questionList[currentQuestion - 1]
    // console.log(currentQuestion)
    // console.log(questionList[currentQuestion])
    return (
      <ContextContainer.Provider
        value={{
          yourScore,
          timeTaken,
          clickReattempt: this.clickReattempt,
        }}
      >
        <Header />
        <div className="main-assessment-container">
          {this.renderSideContainer()}
          <div className="question-and-answer-container">
            <div className="question-choice-container">
              <div className="question-number-and-text-container">
                <span className="question-number">{currentQuestion}.</span>
                <p className="question-text">{questionText}</p>
              </div>
              <hr className="question-hr-line" />
              <div>{this.renderMainAnswerOptionsContainer()}</div>
            </div>
            {questionList.length !== currentQuestion && (
              <div className="next-question-button-container">
                <button
                  type="button"
                  className="next-question-button"
                  onClick={this.clickNextButton}
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </div>
      </ContextContainer.Provider>
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
