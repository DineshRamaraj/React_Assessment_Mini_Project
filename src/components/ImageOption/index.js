const ImageOptions = props => {
  const {questionList, currentQuestion, currentAnswerId, clickOption} = props
  const {options} = questionList[currentQuestion]
  const onClickOption = event => {
    clickOption(event)
  }
  return (
    <ul className="question-image-container">
      {options.map(eachItem => {
        let optionsImage
        if (eachItem.text === 'flex start') {
          optionsImage =
            'https://res.cloudinary.com/dhwz560kk/image/upload/v1711733196/t8s3g8v5szdaltu5wlf9.png'
        }
        if (eachItem.text === 'flex center') {
          optionsImage =
            'https://res.cloudinary.com/dhwz560kk/image/upload/v1711735685/ysa27uxni7piyxlohkm7.png'
        }
        if (eachItem.text === 'space between') {
          optionsImage =
            'https://res.cloudinary.com/dhwz560kk/image/upload/v1711735513/bx8jx0jxgd5zbwzvdtlv.png'
        }
        if (eachItem.text === 'flex end') {
          optionsImage =
            'https://res.cloudinary.com/dhwz560kk/image/upload/v1711735513/zdylxw8fqvyn4dbvwu66.png'
        }

        return (
          <li className="question-image-item" key={eachItem.id}>
            <button
              id={eachItem.id}
              value={eachItem.id}
              type="button"
              className={
                currentAnswerId === eachItem.id
                  ? 'active-image-button question-and-answer-image-button'
                  : 'question-and-answer-image-button'
              }
              onClick={onClickOption}
            >
              <img
                id={eachItem.id}
                src={optionsImage}
                alt={eachItem.text}
                className="question-button-image"
              />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default ImageOptions
