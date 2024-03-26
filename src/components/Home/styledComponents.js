import styled from 'styled-components'

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  @media screen and (min-width: 576px) {
    width: 50%;
    order: 2;
  }
`

export const HomeImage = styled.img`
  width: 100%;
  padding: 20px;
`

export const MainHomeContainer = styled.
