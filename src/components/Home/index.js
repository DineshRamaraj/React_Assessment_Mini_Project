import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="image-container">
          <img
            className="home-image"
            src="https://res.cloudinary.com/dhwz560kk/image/upload/v1711474569/ayzntxspgqzxrpjkabrg.png"
            alt="assessment"
          />
        </div>
        <div className="main-home-container">
          <h1 className="home-instructions">Instructions</h1>
          <ol className="home-list-container">
            <li className="home-list-item">
              <p className="home-list-para">
                <span className="home-list-span">Total Questions: </span>10
              </p>
            </li>
            <li className="home-list-item">
              <p className="home-list-para">
                <span className="home-list-span">Types of Questions: </span>
                MCQs
              </p>
            </li>
            <li className="home-list-item">
              <p className="home-list-para">
                <span className="home-list-span">Duration: </span>10 Mins
              </p>
            </li>
            <li className="home-list-item">
              <p className="home-list-para">
                <span className="home-list-span">Marking Scheme: </span>
                Every Correct response, get 1 mark
              </p>
            </li>
            <li className="home-list-item">
              <p className="home-list-para">
                All the progress will be lost, if you reload during the
                assessment
              </p>
            </li>
          </ol>
          <Link to="/assessment">
            <button className="home-start-button" type="button">
              Start Assessment
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
