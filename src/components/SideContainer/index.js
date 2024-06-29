import {Link} from 'react-router-dom'

const SideContainer = props => {
  const {
    displayTime,
    answeredScore,
    unAnsweredScore,
    questionNumberList,
    questionLength,
    clickQuestionNumber,
    questionStatus,
    clickSubmit,
  } = props

  const onClickSubmit = () => {
    clickSubmit()
  }

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
    <>
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
            onClick={onClickSubmit}
          >
            Submit Assessment
          </button>
        </Link>
      </div>
    </>
  )
}

export default SideContainer
