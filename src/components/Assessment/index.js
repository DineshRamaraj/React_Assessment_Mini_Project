import Cookies from 'js-cookie'
import {v4 as uuid} from 'uuid'
import Loader from 'react-loader-spinner'
import {Redirect} from 'react-router-dom'
import {Component} from 'react'

import Header from '../Header'
import Failure from '../Failure'
import SingleSelect from '../SingleSelect'
import ImageOptions from '../ImageOption'
import DefaultOptions from '../DefaultOptions'
import SideContainer from '../SideContainer'
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
    answeredScore: 0,
    unAnsweredScore: 0,
    score: 0,
    displayTime: 10,
  }

  interval = null

  isCorrect = false

  //   isFailure = apiStatusConstants.failure

  componentDidMount() {
    this.triggerTime()
    this.getQuestionsList()
    // this.isFailure = apiStatusConstants.success
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
            const {history} = this.props
            history.replace('/results', {score, displayTime})
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
      console.log(updatedData)
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
          answerId: undefined,
        }
      } else {
        newObject = {
          id: uuid(),
          questionNumber: i,
          questionStatus: questionStatus.initial,
          answerId: undefined,
        }
      }
      newNumberList.push(newObject)
    }
    this.setState({questionNumberList: [...newNumberList]})
  }

  changeQuestionInitialToProgress = () => {
    const {currentQuestion, questionList, questionNumberList} = this.state
    const {answerId} = questionNumberList[
      currentQuestion - 1 < 0 ? 0 : currentQuestion - 1
    ]

    const isSuccessItem = questionList[
      currentQuestion - 1 < 0 ? 0 : currentQuestion - 1
    ].options.find(eachOption => eachOption.id === answerId)

    const isSuccessId = isSuccessItem ? isSuccessItem.id : undefined

    this.setState(prevState => ({
      questionNumberList: prevState.questionNumberList.map(eachItem => {
        if (
          currentQuestion - 1 === eachItem.questionNumber &&
          isSuccessId === eachItem.answerId &&
          eachItem.answerId !== undefined
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
    const {questionList, currentQuestion, questionNumberList} = this.state

    const findItem = questionList[currentQuestion].options.find(
      eachItem => eachItem.id === event.target.id,
    )

    const {answerId} = questionNumberList[currentQuestion]
    // console.log(event.target.id)
    // console.log(findItem.text)

    if (answerId === undefined) {
      this.setState(prevState => ({
        answeredScore: prevState.answeredScore + 1,
        unAnsweredScore: prevState.unAnsweredScore - 1,
      }))
    }

    if (findItem.isCorrect === 'true' && this.isCorrect === false) {
      this.isCorrect = true
      this.setState(prevState => ({
        questionNumberList: prevState.questionNumberList.map(eachNumber => {
          if (eachNumber.questionNumber === currentQuestion) {
            return {...eachNumber, answerId: event.target.id}
          }
          return eachNumber
        }),

        score: prevState.score + 1,
      }))
    } else if (findItem.isCorrect === 'false' && this.isCorrect === true) {
      this.isCorrect = false
      this.setState(prevState => ({
        questionNumberList: prevState.questionNumberList.map(eachNumber => {
          if (eachNumber.questionNumber === currentQuestion) {
            return {...eachNumber, answerId: event.target.id}
          }
          return eachNumber
        }),
        score: prevState.score - 1 < 0 ? 0 : prevState.score - 1,
      }))
    } else {
      this.setState(prevState => ({
        questionNumberList: prevState.questionNumberList.map(eachNumber => {
          if (eachNumber.questionNumber === currentQuestion) {
            return {...eachNumber, answerId: event.target.id}
          }
          return eachNumber
        }),
      }))
    }
  }

  renderDefaultOptions = () => {
    const {questionList, currentQuestion, questionNumberList} = this.state
    const {answerId} = questionNumberList[currentQuestion]
    return (
      <DefaultOptions
        questionList={questionList}
        currentQuestion={currentQuestion}
        answerId={answerId}
        clickOption={this.clickOption}
      />
    )
  }

  renderImageOptions = () => {
    const {questionList, currentQuestion, questionNumberList} = this.state
    const {answerId} = questionNumberList[currentQuestion]
    return (
      <ImageOptions
        questionList={questionList}
        currentQuestion={currentQuestion}
        answerId={answerId}
        clickOption={this.clickOption}
      />
    )
  }

  changeOption = valueID => {
    const {questionList, currentQuestion} = this.state
    const findItem = questionList[currentQuestion].options.find(
      eachItem => eachItem.id === valueID,
    )

    if (findItem.isCorrect === 'true' && this.isCorrect === false) {
      this.isCorrect = true
      this.setState(prevState => ({
        questionNumberList: prevState.questionNumberList.map(eachNumber => {
          if (eachNumber.questionNumber === currentQuestion) {
            return {...eachNumber, answerId: valueID}
          }
          return eachNumber
        }),
        score: prevState.score + 1,
      }))
    } else if (findItem.isCorrect === 'false' && this.isCorrect === true) {
      this.isCorrect = false
      this.setState(prevState => ({
        questionNumberList: prevState.questionNumberList.map(eachNumber => {
          if (eachNumber.questionNumber === currentQuestion) {
            return {...eachNumber, answerId: valueID}
          }
          return eachNumber
        }),
        score: prevState.score - 1 < 0 ? 0 : prevState.score - 1,
      }))
    } else {
      this.setState(prevState => ({
        questionNumberList: prevState.questionNumberList.map(eachNumber => {
          if (eachNumber.questionNumber === currentQuestion) {
            return {...eachNumber, answerId: valueID}
          }
          return eachNumber
        }),
      }))
    }
  }

  renderSingleSelectOptions = () => {
    const {questionList, currentQuestion, questionNumberList} = this.state
    const {answerId} = questionNumberList[currentQuestion]
    return (
      <SingleSelect
        questionList={questionList}
        currentQuestion={currentQuestion}
        answerId={answerId}
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
          answeredScore: prevState.answeredScore + 1,
          unAnsweredScore: prevState.unAnsweredScore - 1,
        }),
        this.changeQuestionInitialToProgress,
      )
      setTimeout(() => {
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
    const {questionList, questionNumberList} = this.state
    const {optionsType, options} = questionList[questionNumber]
    // console.log(questionList[questionNumber])

    if (optionsType === 'SINGLE_SELECT') {
      const {answerId} = questionNumberList[questionNumber]
      let selectItemId
      if (answerId === undefined) {
        selectItemId = options[0].id
        this.setState(
          prevState => ({
            currentQuestion: questionNumber,
            answeredScore: prevState.answeredScore + 1,
            unAnsweredScore: prevState.unAnsweredScore - 1,
          }),
          this.changeQuestionInitialToProgress,
        )
        setTimeout(() => {
          this.changeOption(selectItemId)
        }, 10)
      } else {
        selectItemId = answerId

        this.setState(
          {currentQuestion: questionNumber},
          this.changeQuestionInitialToProgress,
        )
        setTimeout(() => {
          this.changeOption(selectItemId)
        }, 10)
      }
    } else {
      this.setState(
        {currentQuestion: questionNumber},
        this.changeQuestionInitialToProgress,
      )
    }
  }

  //   clickSubmit = () => {
  //     const {score, displayTime} = this.state
  //     const {submitAnswer} = this.context
  //     submitAnswer(score, displayTime)
  //   }

  SideContainer = () => {
    const {
      score,
      displayTime,
      answeredScore,
      unAnsweredScore,
      questionNumberList,
      questionList,
    } = this.state

    const questionLength = questionList.length
    return (
      <SideContainer
        score={score}
        displayTime={displayTime}
        answeredScore={answeredScore}
        questionLength={questionLength}
        questionStatus={questionStatus}
        unAnsweredScore={unAnsweredScore}
        questionNumberList={questionNumberList}
        clickQuestionNumber={this.clickQuestionNumber}
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
          <li className="question-and-answer-container">
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
        answeredScore: 0,
        unAnsweredScore: 0,
        score: 0,
        displayTime: 10,
      },
      this.getQuestionsList,
      this.triggerTime,
    )
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

export default Assessment
