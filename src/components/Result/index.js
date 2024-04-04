import ContextContainer from '../../Context/ContextComponent'

const Result = () => (
  <ContextContainer>
    {value => {
      const {yourScore, timeTaken} = value
      return (
        <div className="result-container">
          <img
            src="https://res.cloudinary.com/dhwz560kk/image/upload/v1712260041/rez9mntprn7eb7y5f8mu.png"
            alt="submit"
            className="result-image"
          />
          <h1 className="result-title">
            Congrats! You completed the assessment.
          </h1>
          <p>Time Taken: {timeTaken}</p>
          <h1>
            Your Score: <span>{yourScore}</span>
          </h1>
          <button type="button" className="result-button">
            Reattempt
          </button>
        </div>
      )
    }}
  </ContextContainer>
)

export default Result
