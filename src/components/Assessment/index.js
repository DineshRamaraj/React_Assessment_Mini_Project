import Cookies from 'js-cookie'
import {v4 as uuid} from 'uuid'
import Loader from 'react-loader-spinner'
import {Redirect} from 'react-router-dom'
import {Component} from 'react'

import Header from '../Header'
import Failure from '../Failure'
import SideContainer from '../SideAssessment'
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
    currentQuestion: 1,
    currentAnswerId: 0,
    selectItem: '',
    answeredScore: 0,
    unAnsweredScore: 0,
    score: 0,
    displayTime: 10,
  }

  interval = null

  componentDidMount() {
    this.setState(prevState => ({displayTime: prevState.displayTime * 60}))
    this.triggerTime()
    this.getQuestionsList()
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
        unAnsweredScore: updatedData.length,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
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
    this.setState({questionNumberList: [...newNumberList]})
  }

  changeQuestionInitialToProgress = () => {
    const {currentQuestion, currentAnswerId, questionList} = this.state
    const isSuccessItem = questionList[
      currentQuestion - 2 < 0 ? 0 : currentQuestion - 2
    ].options.find(eachOption => eachOption.id === currentAnswerId)
    const isSuccessId = isSuccessItem ? isSuccessItem.id : undefined
    console.log('successId: ', isSuccessId)

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
    }))
  }

  clickOption = event => {
    const {questionList, currentQuestion} = this.state
    // console.log('click options')
    // console.log(score)

    const findItem = questionList[currentQuestion - 1].options.find(
      eachItem => eachItem.id === event.target.id,
    )

    if (findItem.isCorrect === 'true') {
      this.setState(prevState => ({
        score: prevState.score + 1,
        currentAnswerId: event.target.id,
      }))
    } else {
      this.setState({
        currentAnswerId: event.target.id,
      })
    }
  }

  renderDefaultOptions = () => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    const {options} = questionList[currentQuestion - 1]
    // console.log(options)
    // console.log(currentQuestion)
    // console.log(currentAnswerId)
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

  renderSingleSelectOptions = () => {
    const {questionList, currentQuestion, selectItem} = this.state
    const {options} = questionList[currentQuestion - 1]

    const onChangeSelectItem = event => {
      const defaultSelection = questionList[currentQuestion - 1].options[0].id
      /* console.log('Default', defaultSelection) */

      if (event.target.value !== undefined) {
        this.setState({
          currentAnswerId: event.target.value,
          selectItem: event.target.value,
        })
      } else {
        this.setState({
          currentAnswerId: defaultSelection,
          selectItem: defaultSelection,
        })
      }
    }

    return (
      <select
        value={selectItem}
        onChange={onChangeSelectItem}
        className="question-select-container"
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

  clickNextButton = () => {
    this.setState(
      prevState => ({
        currentQuestion: prevState.currentQuestion + 1,
      }),
      this.changeQuestionInitialToProgress,
    )
  }

  clickQuestionNumber = questionNumber => {
    this.setState(
      {currentQuestion: questionNumber},
      this.changeQuestionInitialToProgress,
    )
  }

  renderSuccess = () => {
    const {
      score,
      questionList,
      currentQuestion,
      answeredScore,
      unAnsweredScore,
      questionNumberList,
      displayTime,
    } = this.state
    const {questionText} = questionList[currentQuestion - 1]

    return (
      <>
        <Header />
        <div className="main-assessment-container">
          <SideContainer
            displayTime={displayTime}
            score={score}
            stopTriggerTime={this.stopTriggerTime}
            answeredScore={answeredScore}
            unAnsweredScore={unAnsweredScore}
            questionLength={questionList.length}
            questionNumberList={questionNumberList}
            clickQuestionNumber={this.clickQuestionNumber}
            submitAssessment={this.submitAssessment}
          />
          <div className="question-and-answer-container">
            <div className="question-choice-container">
              <div className="question-number-and-text-container">
                <span className="question-number">{currentQuestion}.</span>
                <p className="question-text">{questionText}</p>
              </div>
              <hr className="question-hr-line" />
              <div>{this.renderMainAnswerOptionsContainer()}</div>
            </div>
            <div>
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
        </div>
      </>
    )
  }

  renderLoading = () => (
    <>
      <Header />
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#263868" height={50} width={50} />
      </div>
    </>
  )

  renderFailure = () => <Failure />

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

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
