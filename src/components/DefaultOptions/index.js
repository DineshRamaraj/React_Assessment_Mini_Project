const DefaultOptions = props => {
  const {questionList, currentQuestion, answerId, clickOption} = props
  const {options} = questionList[currentQuestion]

  //   const onClickOption = id => {
  //     // console.log(event.target.value)
  //     console.log(id)
  //     clickOption(id)
  //   }

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
            onClick={() => clickOption(eachItem.id)}
          >
            {eachItem.text}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default DefaultOptions
