import Cookies from 'js-cookie'
import {Component} from 'react'
import {
  LoginContainer,
  WebsiteImage,
  FormContainer,
  InputContainer,
  Label,
  Input,
  CheckBoxContainer,
  CheckBox,
  CheckBoxLabel,
  LoginButtonContainer,
  LoginButton,
  ErrorMessage,
} from './styledComponents'

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
      <LoginContainer>
        <WebsiteImage
          src="https://res.cloudinary.com/dhwz560kk/image/upload/v1711469841/cmrmts52jkfj695vohx6.png"
          alt="login website logo"
        />
        <FormContainer onSubmit={this.submitForm}>
          <InputContainer>
            <Label htmlFor="username">USERNAME</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter Your Name"
              value={userNameInput}
              onChange={this.changeUserName}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="password">PASSWORD</Label>
            <Input
              id="password"
              type={isChecked ? 'text' : 'password'}
              placeholder="Enter Your Password"
              value={passwordInput}
              onChange={this.changePassword}
            />
          </InputContainer>
          <CheckBoxContainer>
            <CheckBox
              type="checkbox"
              id="showPassword"
              checked={isChecked}
              onChange={this.changeShowPassword}
            />
            <CheckBoxLabel htmlFor="showPassword">Show Password</CheckBoxLabel>
          </CheckBoxContainer>
          <LoginButtonContainer>
            <LoginButton type="submit">Login</LoginButton>
          </LoginButtonContainer>
          <ErrorMessage>{errorMsg}</ErrorMessage>
        </FormContainer>
      </LoginContainer>
    )
  }
}

export default Login
