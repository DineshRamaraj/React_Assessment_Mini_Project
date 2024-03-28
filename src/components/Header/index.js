import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import './index.css'

const Header = props => {
  const {history} = props

  const clickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          className="header-logo"
          src="https://res.cloudinary.com/dhwz560kk/image/upload/v1711550302/c2emvwdwaumbjzq7ienx.png"
          alt="website logo"
        />
      </Link>
      <button className="logout-button" type="button" onClick={clickLogout}>
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
