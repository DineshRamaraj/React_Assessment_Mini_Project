import Cookies from 'js-cookie'
import {Component} from 'react'
import './index.css'

class Login extends Component {
  state = {
    userNameInput: '',
    passwordInput: '',
    isChecked: false,
    errorMsg: '',
  }

  changeUserName = event => {
    this.setState({userNameInput: event.target.value})
  }

  changePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  changeShowPassword = () => {
    this.setState(prevState => ({
      isChecked: !prevState.isChecked,
    }))
  }

  submitForm = async event => {
    event.preventDefault()
    const {userNameInput, passwordInput} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {
      username: userNameInput,
      password: passwordInput,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errorMsg: data.error_msg})
    }
  }

  render() {
    const {userNameInput, passwordInput, isChecked, errorMsg} = this.state
    return (
      <div className="login-container">
        <img
          className="website-image"
          src="https://res.cloudinary.com/dhwz560kk/image/upload/v1711469841/cmrmts52jkfj695vohx6.png"
          alt="login website logo"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <div className="input-container">
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              className="input"
              id="username"
              type="text"
              placeholder="Enter Your Name"
              value={userNameInput}
              onChange={this.changeUserName}
            />
          </div>
          <div className="input-container">
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="input"
              id="password"
              type={isChecked ? 'text' : 'password'}
              placeholder="Enter Your Password"
              value={passwordInput}
              onChange={this.changePassword}
            />
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="showPassword"
              className="checkbox"
              checked={isChecked}
              onChange={this.changeShowPassword}
            />
            <label className="checkbox-label" htmlFor="showPassword">
              Show Password
            </label>
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
          <p className="error-message">{errorMsg}</p>
        </form>
      </div>
    )
  }
}

export default Login
