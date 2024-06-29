import Cookies from 'js-cookie'
import {Redirect, withRouter} from 'react-router-dom'
import ContextContainer from '../../Context/ContextComponent'
import Header from '../Header'
import './index.css'

const TimeUp = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <ContextContainer.Consumer>
      {value => {
        const {score, clickReattempt} = value

        const onClickReattempt = () => {
          clickReattempt()
          const {history} = props
          history.replace('/assessment')
        }

        return (
          <>
            <Header />
            <div className="main-time-up-container">
              <div className="time-up-container">
                <img
                  src="https://res.cloudinary.com/dhwz560kk/image/upload/v1718367233/vayvblghiyzxv1k7ltuu.png"
                  alt="time up"
                  className="time-up-image"
                />
                <h1 className="time-up-heading">Time is up!</h1>
                <p className="time-up-description">
                  You did not complete the assessment within the time
                </p>
                <div className="time-up-score-container">
                  <p className="time-up-score-title">Your score: </p>
                  <p className="time-up-score">{score}</p>
                </div>
                <button
                  type="button"
                  className="time-up-button"
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

export default withRouter(TimeUp)
