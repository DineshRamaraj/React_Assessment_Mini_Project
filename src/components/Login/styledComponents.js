import styled from 'styled-components'

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`

export const WebsiteImage = styled.img`
  width: 110px;
  margin-bottom: 20px;
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`

export const Input = styled.input`
  padding: 10px 20px;
  border: 1px solid #d7dfe9;
  border-radius: 6px;
  color: #263868;
  font-size: 14px;
  font-family: 'Roboto';
`

export const Label = styled.label`
  color: #7e858e;
  font-size: 14px;
  font-family: 'Roboto';
  font-weight: 500;
  margin-bottom: 5px;
`

export const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 10px;
`

export const CheckBox = styled.input`
  width: 16px;
  height: 16px;
  color: #d7dfe9;
  margin-right: 10px;
`

export const CheckBoxLabel = styled.label`
  font-size: 16px;
  font-family: 'Roboto';
  color: #000000;
`

export const LoginButtonContainer = styled.div`
  width: 100%;
`

export const LoginButton = styled.button`
font-size: 16px;
font-family: "Roboto":
font-weight: 900;
color: #ffffff;
background-color: #263868;
border-radius: 10px;
border: 0;
outline: 0;
width: 100%;
padding: 12px;
cursor: pointer;`

export const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 14px;
  font-family: 'Roboto';
`
