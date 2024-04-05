import './index.css'

const NotFound = () => (
  <div className="main-not-found-container">
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dhwz560kk/image/upload/v1712341457/pr1zl2o3afr6alczsqad.png"
        alt="not found"
        className="not-found-img"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-description">
        We are sorry, the page you requested could not be found
      </p>
    </div>
  </div>
)

export default NotFound
