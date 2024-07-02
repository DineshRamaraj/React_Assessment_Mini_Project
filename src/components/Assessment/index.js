import Cookies from 'js-cookie'
import {v4 as uuid} from 'uuid'
import Loader from 'react-loader-spinner'
import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Header from '../Header'
import Failure from '../Failure'
import ContextContainer from '../../Context/ContextComponent'
import './index.css'
import SingleSelect from '../SingleSelect'
import ImageOptions from '../ImageOption'
import DefaultOptions from '../DefaultOptions'
import SideContainer from '../SideContainer'

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

  isCorrect = false

  isEnterFirstTime = true

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
            history.replace('/results')
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
    const apiUrl = 'https://apis.ccbp.in/assess/questions'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response.ok)

    if (response.ok) {
      //   console.log('1')
      const data = await response.json()
      //   console.log(data)
      const updatedData = data.questions.map(eachItem => ({
        id: eachItem.id,
        optionsType: eachItem.options_type,
        questionText: eachItem.question_text,
        options: eachItem.options.map(optionItem => ({
          id: optionItem.id,
          text: optionItem.text,
          imageUrl: optionItem.image_url,
          isCorrect: optionItem.is_correct,
        })),
      }))
      this.numberOfQuestions(updatedData.length)
      // console.log(updatedData)
      this.setState({
        questionList: updatedData,
        apiStatus: apiStatusConstants.success,
        unAnsweredScore: updatedData.length,
      })
    } else {
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

    const findItem = questionList[currentQuestion].options.find(
      eachItem => eachItem.id === event.target.id,
    )

    if (this.isEnterFirstTime === true) {
      this.isEnterFirstTime = false
      this.setState(prevState => ({
        answeredScore: prevState.answeredScore + 1,
        unAnsweredScore: prevState.unAnsweredScore - 1,
      }))
    }

    if (
      currentAnswerId === undefined &&
      findItem.isCorrect === 'true' &&
      this.isCorrect === false
    ) {
      this.isCorrect = true
      const {score} = this.state
      this.setState({
        currentAnswerId: event.target.id,
        score: score + 1,
      })
    } else if (
      currentAnswerId !== undefined &&
      findItem.isCorrect === 'true' &&
      this.isCorrect === false
    ) {
      this.isCorrect = true
      const {score} = this.state
      this.setState({
        currentAnswerId: event.target.id,
        score: score + 1,
      })
    } else if (findItem.isCorrect === 'false' && this.isCorrect === true) {
      this.isCorrect = false
      this.setState(prevState => ({
        currentAnswerId: event.target.id,
        score: prevState.score - 1 < 0 ? 0 : prevState.score - 1,
      }))
    } else {
      this.setState({currentAnswerId: event.target.id})
    }
  }

  renderDefaultOptions = () => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    return (
      <DefaultOptions
        questionList={questionList}
        currentQuestion={currentQuestion}
        currentAnswerId={currentAnswerId}
        clickOption={this.clickOption}
      />
    )
  }

  renderImageOptions = () => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    return (
      <ImageOptions
        questionList={questionList}
        currentQuestion={currentQuestion}
        currentAnswerId={currentAnswerId}
        clickOption={this.clickOption}
      />
    )
  }

  changeOption = valueID => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    const findItem = questionList[currentQuestion].options.find(
      eachItem => eachItem.id === valueID,
    )

    if (this.isEnterFirstTime === true) {
      this.isEnterFirstTime = false
      this.setState(prevState => ({
        answeredScore: prevState.answeredScore + 1,
        unAnsweredScore: prevState.unAnsweredScore - 1,
      }))
    }

    if (
      currentAnswerId !== undefined &&
      findItem.isCorrect === 'true' &&
      this.isCorrect === false
    ) {
      this.isCorrect = true
      this.setState(prevState => ({
        currentAnswerId: valueID,
        score: prevState.score + 1,
      }))
    } else if (
      findItem.isCorrect === 'false' &&
      currentAnswerId !== undefined &&
      this.isCorrect === true
    ) {
      this.isCorrect = false
      this.setState(prevState => ({
        currentAnswerId: valueID,
        score: prevState.score - 1 < 0 ? 0 : prevState.score - 1,
      }))
    } else {
      this.setState({currentAnswerId: valueID})
    }
  }

  renderSingleSelectOptions = () => {
    const {questionList, currentQuestion, currentAnswerId} = this.state
    return (
      <SingleSelect
        questionList={questionList}
        currentQuestion={currentQuestion}
        currentAnswerId={currentAnswerId}
        changeOption={this.changeOption}
      />
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

    this.isCorrect = false
    this.isEnterFirstTime = true

    if (optionsType === 'SINGLE_SELECT') {
      // console.log(selectItemId)
      this.setState(
        prevState => ({
          currentQuestion: prevState.currentQuestion + 1,
        }),
        this.changeQuestionInitialToProgress,
      )
      setTimeout(() => {
        this.setState({currentAnswerId: selectItemId})
        this.changeOption(selectItemId)
      }, 10)
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
    const {questionList} = this.state
    const {optionsType, options} = questionList[questionNumber]
    // console.log(questionList[questionNumber])

    if (optionsType === 'SINGLE_SELECT') {
      const selectItemId = options[0].id
      this.setState(
        {currentQuestion: questionNumber, currentAnswerId: selectItemId},
        this.changeQuestionInitialToProgress,
      )
      setTimeout(() => {
        this.changeOption(selectItemId)
      }, 10)
    } else {
      this.setState(
        {currentQuestion: questionNumber},
        this.changeQuestionInitialToProgress,
      )
    }
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
    } = this.state

    const questionLength = questionList.length
    return (
      <SideContainer
        displayTime={displayTime}
        answeredScore={answeredScore}
        questionLength={questionLength}
        questionStatus={questionStatus}
        unAnsweredScore={unAnsweredScore}
        questionNumberList={questionNumberList}
        clickQuestionNumber={this.clickQuestionNumber}
        clickSubmit={this.clickSubmit}
      />
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
          <li className="main-side-container">{this.SideContainer()}</li>
          <li
            className="question-and-answer-container"
            data-testid="questionItem"
          >
            <div className="question-choice-container">
              <div className="question-number-and-text-container">
                <span className="question-number">{currentQuestion + 1}.</span>
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
      {
        apiStatus: apiStatusConstants.initial,
        questionNumberList: [],
        questionList: [],
        currentQuestion: 0,
        currentAnswerId: undefined,
        answeredScore: 0,
        unAnsweredScore: 0,
        score: 0,
        displayTime: 10,
      },
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
