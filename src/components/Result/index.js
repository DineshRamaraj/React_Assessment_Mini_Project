import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import ContextContainer from '../../Context/ContextComponent'
import Header from '../Header'
import TimeUp from '../TimeUp'
import './index.css'

const Result = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <ContextContainer.Consumer>
      {value => {
        const {score, resultTime, clickReattempt} = value

        const onClickReattempt = () => {
          clickReattempt()
          const {history} = props
          history.replace('/assessment')
        }

        if (resultTime === 0) {
          return <TimeUp />
        }

        const resultTiming = 600 - resultTime

        const hours = `${
          parseInt(resultTiming / 60 / 60) > 9 ? '' : '0'
        }${parseInt(resultTiming / 60 / 60)}`

        const minutes = `${
          parseInt(resultTiming / 60) > 9 ? '' : '0'
        }${parseInt(resultTiming / 60)}`

        const seconds = `${
          parseInt(resultTiming % 60) > 9 ? '' : '0'
        }${parseInt(resultTiming % 60)}`

        return (
          <>
            <Header />
            <div className="main-result-container">
              <div className="result-container">
                <img
                  src="https://res.cloudinary.com/dhwz560kk/image/upload/v1712260041/rez9mntprn7eb7y5f8mu.png"
                  alt="submit"
                  className="result-image"
                />
                <div className="result-title-container">
                  <h1 className="result-title">
                    Congrats! You completed the assessment.
                  </h1>
                </div>
                <div className="result-time-container">
                  <p className="result-time-title">Time Taken: </p>
                  <p className="result-time">
                    {`${hours} : ${minutes} : ${seconds}`}
                  </p>
                </div>
                <div className="result-score-container">
                  <p className="result-score-title">Your score: </p>
                  <p className="result-score">{score}</p>
                </div>
                <button
                  type="button"
                  className="result-button"
                  onClick={onClickReattempt}
                >
                  Reattempt
                </button>
              </div>
            </div>
          </>
        )
      }}
    </ContextContainer.Consumer>
  )
}

export default Result
