import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Redirect} from 'react-router-dom'
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
  renderLoading = () => (
    <>
      <Header />
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#263868" height={50} width={50} />
      </div>
    </>
  )

  renderSideContainer = () => (
    <ContextContainer.Consumer>
      {value => {
        const {
          answerScore,
          unAnswerScore,
          questionList,
          displayTime,
          questionNumberList,
          clickQuestionNumber,
        } = value

        const submitAssessment = () => {
          const {history} = this.props
          history.replace('/result')
        }
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
                    const onClickQuestionNumber = () => {
                      clickQuestionNumber(eachNumber.questionNumber)
                    }
                    const eachItemStatus = () => {
                      if (
                        eachNumber.questionStatus === questionStatus.initial
                      ) {
                        return 'initial-status'
                      }
                      if (
                        eachNumber.questionStatus === questionStatus.inProgress
                      ) {
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
                onClick={submitAssessment}
              >
                Submit Assessment
              </button>
            </div>
          </div>
        )
      }}
    </ContextContainer.Consumer>
  )

  renderDefaultOptions = () => (
    <ContextContainer.Consumer>
      {value => {
        const {
          questionList,
          currentQuestion,
          currentAnswerId,
          clickOption,
        } = value
        const {options} = questionList[currentQuestion - 1]
        // console.log(options)
        return (
          <ul className="question-default-container">
            {options.map(eachItem => {
              const onClickOption = event => {
                clickOption(event)
              }
              return (
                <li className="question-default-item" key={eachItem.id}>
                  <button
                    id={eachItem.id}
                    type="button"
                    className={
                      currentAnswerId === eachItem.id
                        ? 'active-default-button question-and-answer-default-button'
                        : 'question-and-answer-default-button'
                    }
                    onClick={onClickOption}
                  >
                    {eachItem.text}
                  </button>
                </li>
              )
            })}
          </ul>
        )
      }}
    </ContextContainer.Consumer>
  )

  renderImageOptions = () => (
    <ContextContainer.Consumer>
      {value => {
        const {
          questionList,
          currentQuestion,
          currentAnswerId,
          clickOption,
        } = value
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

              const onClickOption = event => {
                clickOption(event)
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
                    onClick={onClickOption}
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
      }}
    </ContextContainer.Consumer>
  )

  renderSingleSelectOptions = () => (
    <ContextContainer.Consumer>
      {value => {
        const {
          questionList,
          currentQuestion,
          selectItem,
          changeSelectItem,
        } = value
        const {options} = questionList[currentQuestion - 1]

        const onChangeSelectItem = event => {
          const defaultSelection =
            questionList[currentQuestion - 1].options[0].id
          console.log('Default', defaultSelection)
          if (event.target.value !== undefined)
            changeSelectItem(event.target.value)
          else changeSelectItem(defaultSelection)
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
      }}
    </ContextContainer.Consumer>
  )

  renderMainAnswerOptionsContainer = () => (
    <ContextContainer.Consumer>
      {value => {
        const {questionList, currentQuestion} = value
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
      }}
    </ContextContainer.Consumer>
  )

  renderSuccess = () => (
    <ContextContainer.Consumer>
      {value => {
        const {questionList, currentQuestion, clickNext} = value
        const {questionText} = questionList[currentQuestion - 1]
        const clickNextButton = () => {
          clickNext()
        }
        return (
          <>
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
                      onClick={clickNextButton}
                    >
                      Next Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )
      }}
    </ContextContainer.Consumer>
  )

  renderFailure = () => (
    <>
      <Header />
      <Failure />
    </>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <ContextContainer.Consumer>
        {value => {
          const {apiStatus} = value
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
        }}
      </ContextContainer.Consumer>
    )
  }
}
export default Assessment
