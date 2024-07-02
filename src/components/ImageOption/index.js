const ImageOptions = props => {
  const {questionList, currentQuestion, currentAnswerId, clickOption} = props
  const {options} = questionList[currentQuestion]
  //   console.log(options)
  const onClickOption = event => {
    clickOption(event)
  }
  return (
    <ul className="question-image-container">
      {options.map(eachItem => (
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
              src={eachItem.imageUrl}
              alt={eachItem.text}
              className="question-button-image"
            />
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ImageOptions
