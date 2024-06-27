import Cookies from 'js-cookie'
import {v4 as uuid} from 'uuid'
import Loader from 'react-loader-spinner'
import {Redirect, Link} from 'react-router-dom'
import {Component} from 'react'
import Header from '../Header'
import Failure from '../Failure'
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
    currentQuestion: 0,
    currentAnswerId: undefined,
    answeredScore: 0,
    unAnsweredScore: 0,
    score: 0,
    displayTime: 10,
  }

  interval = null

  componentDidMount() {
    this.triggerTime()
    this.getQuestionsList()
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  triggerTime = () => {
    this.interval = setInterval(() => {
      this.setState(
        prevState => ({displayTime: prevState.displayTime - 1}),
        () => {
          const {score, displayTime} = this.state
          if (displayTime === 0) {
            clearInterval(this.interval)
            const {submitAnswer} = this.context
            submitAnswer(score, displayTime)
            const {history} = this.props
            history.replace('/time-up')
          }
        },
      )
    }, 1000)
  }

  getQuestionsList = async () => {
    this.setState(prevState => ({
      displayTime: prevState.displayTime * 60,
      apiStatus: apiStatusConstants.inProgress,
    }))
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/assess/questions`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
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
        this.setState({
          questionList: updatedData,
          apiStatus: apiStatusConstants.success,
          unAnsweredScore: updatedData.length,
        })
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  numberOfQuestions = questionsLength => {
    let newObject
    const newNumberList = []
    for (let i = 0; i < questionsLength; i += 1) {
      if (i === 0) {
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

    const isSuccessItem = questionList[currentQuestion - 1].options.find(
      eachOption => eachOption.id === currentAnswerId,
    )
    const isSuccessId = isSuccessItem ? isSuccessItem.id : undefined
    // console.log('successId: ', isSuccessId)

    // console.log(optionsType)

    this.setState(prevState => ({
      questionNumberList: prevState.questionNumberList.map(eachItem => {
        if (
          currentQuestion - 1 === eachItem.questionNumber &&
          isSuccessId === currentAnswerId &&
          currentAnswerId !== undefined
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
          currentQuestion + 1 !== eachItem.questionNumber
        ) {
          return {...eachItem, questionStatus: questionStatus.initial}
        }
        return {...eachItem}
      }),
    }))
  }

  clickOption = event => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    // console.log('click options')
    // console.log(score)
    // console.log(questionList[currentQuestion])

    const findItem = questionList[currentQuestion].options.find(
      eachItem => eachItem.id === event.target.id,
    )
    // console.log('successId: ', isSuccessId)

    // console.log(optionsType)

    if (findItem) {
      this.setState(prevState => ({
        answeredScore: prevState.answeredScore + 1,
        unAnsweredScore: prevState.unAnsweredScore - 1,
      }))
    }
    // console.log('findItem: ', findItem)

    if (currentAnswerId === undefined && findItem.isCorrect === 'true') {
      this.setState(prevState => ({
        currentAnswerId: event.target.id,
        score: prevState.score + 1,
      }))
    } else if (currentAnswerId !== undefined && findItem.isCorrect === 'true') {
      this.setState(prevState => ({
        currentAnswerId: event.target.id,
        score: prevState.score + 1,
      }))
    } else if (findItem.isCorrect === 'false') {
      this.setState(prevState => ({
        currentAnswerId: event.target.id,
        score: prevState.score - 1 < 0 ? 0 : prevState.score - 1,
      }))
    }
  }

  renderDefaultOptions = () => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    const {options} = questionList[currentQuestion]
    // console.log(options)
    // console.log(currentQuestion)
    // console.log(currentAnswerId)
    return (
      <ul className="question-default-container">
        {options.map(eachItem => (
          <li className="question-default-item" key={eachItem.id}>
            <button
              id={eachItem.id}
              value={eachItem.id}
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
    const {options} = questionList[currentQuestion]

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
                value={eachItem.id}
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

  changeOption = valueID => {
    const {questionList, currentQuestion, currentAnswerId} = this.state

    const findItem = questionList[currentQuestion].options.find(
      eachItem => eachItem.id === valueID,
    )

    console.log(findItem)

    if (currentAnswerId !== undefined && findItem.isCorrect === 'true') {
      //   console.log('It is working')
      this.setState(prevState => ({
        currentAnswerId: valueID,
        score: prevState.score + 1,
      }))
    } else if (
      findItem.isCorrect === 'false' &&
      currentAnswerId !== undefined &&
      findItem.id !== valueID
    ) {
      this.setState(prevState => ({
        currentAnswerId: valueID,
        score: prevState.score - 1 < 0 ? 0 : prevState.score - 1,
      }))
    }
  }

  renderSingleSelectOptions = () => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    const {options} = questionList[currentQuestion]

    let defaultSelection = questionList[currentQuestion].options[0].id
    const onChangeSelectItem = event => {
      defaultSelection = event.target.value
      this.changeOption(defaultSelection)
    }

    // console.log(currentAnswerId)

    return (
      <select
        id={currentAnswerId}
        value={currentAnswerId}
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
    const {optionsType} = questionList[currentQuestion]

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
    const {questionList, currentQuestion} = this.state
    const {optionsType} = questionList[currentQuestion + 1]
    const selectItemId = questionList[currentQuestion + 1].options[0].id
    // console.log(currentAnswerId)
    if (optionsType === 'SINGLE_SELECT') {
      // console.log(selectItemId)
      this.setState(
        prevState => ({
          currentQuestion: prevState.currentQuestion + 1,
        }),
        this.changeQuestionInitialToProgress,
      )
      setTimeout(() => {
        this.setState(prevState => ({
          currentAnswerId: selectItemId,
          answeredScore: prevState.answeredScore + 1,
          unAnsweredScore: prevState.unAnsweredScore - 1,
        }))
        this.changeOption(selectItemId)
      }, 100)
    } else {
      this.setState(
        prevState => ({
          currentQuestion: prevState.currentQuestion + 1,
        }),
        this.changeQuestionInitialToProgress,
      )
    }
  }

  clickQuestionNumber = questionNumber => {
    this.setState(
      {currentQuestion: questionNumber},
      this.changeQuestionInitialToProgress,
    )
  }

  clickSubmit = () => {
    const {score, displayTime} = this.state
    const {submitAnswer} = this.context
    submitAnswer(score, displayTime)
  }

  SideContainer = () => {
    const {
      displayTime,
      answeredScore,
      unAnsweredScore,
      questionNumberList,
      questionList,
      clickQuestionNumber,
      /* stopTriggerTime, */
    } = this.state

    const questionLength = questionList.length

    const hours = `${parseInt(displayTime / 60 / 60) > 9 ? '' : '0'}${parseInt(
      displayTime / 60 / 60,
    )}`

    const minutes = `${parseInt(displayTime / 60) > 9 ? '' : '0'}${parseInt(
      displayTime / 60,
    )}`

    const seconds = `${parseInt(displayTime % 60) > 9 ? '' : '0'}${parseInt(
      displayTime % 60,
    )}`

    return (
      <div className="assessment-side-container">
        <div className="assessment-time-question-number-container">
          <div className="time-container">
            <p className="time-title">Time Left</p>
            <p className="display-time">{`${hours}:${minutes}:${seconds}`}</p>
          </div>
          <div className="answer-details-container">
            <div className="answer-unanswered-container">
              <div className="answered-questions">
                <div className="answer-score-container">
                  <p className="answer-score">{answeredScore}</p>
                </div>
                <p className="answer-title">Answered Questions</p>
              </div>
              <div className="un-answered-questions">
                <div className="un-answer-score-container">
                  <p className="un-answer-score">{unAnsweredScore}</p>
                </div>
                <p className="un-answer-title">Unanswered Questions</p>
              </div>
            </div>
            <hr className="horizontal-line" />
            <h1 className="question-topic">Questions ({questionLength})</h1>
            <ul className="questions-list-container">
              {questionNumberList.map(eachNumber => {
                const onClickQuestionNumber = () => {
                  clickQuestionNumber(eachNumber.questionNumber)
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
                      onClick={onClickQuestionNumber}
                    >
                      {eachNumber.questionNumber + 1}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="submit-button-container">
          <Link to="/results">
            <button
              type="button"
              className="submit-assessment-button"
              onClick={this.clickSubmit}
            >
              Submit Assessment
            </button>
          </Link>
        </div>
      </div>
    )
  }

  renderSuccess = () => {
    const {questionList, currentQuestion} = this.state
    const {questionText} = questionList[currentQuestion]
    // console.log(questionList.length)

    return (
      <>
        <Header />
        <ul className="main-assessment-container">
          <li>{this.SideContainer()}</li>
          <li>
            <div className="question-and-answer-container">
              <div className="question-choice-container">
                <div className="question-number-and-text-container">
                  <span className="question-number">
                    {currentQuestion + 1}.
                  </span>
                  <p className="question-text">{questionText}</p>
                </div>
                <hr className="question-hr-line" />
                <div>{this.renderMainAnswerOptionsContainer()}</div>
              </div>
              <div className="question-hint-next-container">
                <div className="question-select-hint-container">
                  {questionList[currentQuestion].optionsType ===
                  'SINGLE_SELECT' ? (
                    <>
                      <img
                        className="question-select-hint-image"
                        src="https://res.cloudinary.com/dhwz560kk/image/upload/v1719322655/ualsfvbwn1nz3eampdyu.png"
                        alt="SINGLE_SELECT"
                      />
                      <p className="question-select-hint">
                        First option is selected by default
                      </p>
                    </>
                  ) : (
                    ' '
                  )}
                </div>
                <div className="next-question-button-container">
                  {questionList.length - 1 !== currentQuestion && (
                    <button
                      type="button"
                      className="next-question-button"
                      onClick={this.clickNextButton}
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        </ul>
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

  onRetry = () => {
    this.setState(
      {apiStatus: apiStatusConstants.initial},
      this.getQuestionsList,
      this.triggerTime,
    )
    const {submitAnswer} = this.context
    submitAnswer(0, 0)
  }

  renderFailure = () => <Failure onRetry={this.onRetry} />

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

Assessment.contextType = ContextContainer

export default Assessment
