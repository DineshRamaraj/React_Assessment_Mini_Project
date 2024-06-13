import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import ContextContainer from '../../Context/ContextComponent'
import Header from '../Header'
import './index.css'

const Result = props => (
  <ContextContainer.Consumer>
    {value => {
      const {score, displayTime, clickReattempt} = value

      const onClickReattempt = () => {
        clickReattempt()
        const {history} = props
        history.replace('/assessment')
      }

      const jwtToken = Cookies.get('jwt_token')
      if (jwtToken === undefined) {
        return <Redirect to="/login" />
      }

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
                <h1 className="result-time-title">
                  Time Taken:{' '}
                  <span className="result-time">{`${
                    parseInt(displayTime / 60 / 60) > 9 ? '' : 0
                  }${parseInt(displayTime / 60 / 60)} : ${
                    parseInt(displayTime / 60) > 9 ? '' : '0'
                  }${parseInt(displayTime / 60)} : ${
                    parseInt(displayTime % 60) > 9 ? '' : '0'
                  }${parseInt(displayTime % 60)}`}</span>
                </h1>
              </div>
              <div className="result-score-container">
                <h1 className="result-score-title">
                  Your Score: <span className="result-score">{score}</span>
                </h1>
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

export default Result
