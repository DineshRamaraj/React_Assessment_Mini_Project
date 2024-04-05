import React from 'react'

const ContextContainer = React.createContext({
  timeTaken: 0,
  yourScore: 0,
  clickReattempt: () => {},
})

export default ContextContainer
