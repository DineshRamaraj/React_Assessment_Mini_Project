const DefaultOptions = props => {
  const {questionList, currentQuestion, answerId, clickOption} = props
  const {options} = questionList[currentQuestion]

  const onClickOption = event => {
    clickOption(event)
  }

  return (
    <ul className="question-default-container">
      {options.map(eachItem => (
        <li className="question-default-item" key={eachItem.id}>
          <button
            id={eachItem.id}
            value={eachItem.id}
            type="button"
            className={
              answerId === eachItem.id
                ? 'active-default-button question-and-answer-default-button'
                : 'question-and-answer-default-button'
            }
            onClick={onClickOption}
          >
            {eachItem.text}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default DefaultOptions
