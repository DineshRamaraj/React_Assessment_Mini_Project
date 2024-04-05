import ContextComponent from '../../Context/ContextComponent'
import './index.css'

const Failure = () => (
  <ContextComponent.Consumer>
    {value => {
      const {clickRetry} = value
      const onClickRetry = () => {
        clickRetry()
      }
      return (
        <div className="main-failure-container">
          <div className="failure-container">
            <img
              src="https://res.cloudinary.com/dhwz560kk/image/upload/v1712342164/w1vd87na63ca2t9sargo.png"
              alt="failure"
              className="failure-img"
            />
            <h1 className="failure-heading">Oops! Something went wrong</h1>
            <p className="failure-description">We are having some trouble</p>
            <button
              type="button"
              className="failure-button"
              onClick={onClickRetry}
            >
              Retry
            </button>
          </div>
        </div>
      )
    }}
  </ContextComponent.Consumer>
)

export default Failure
