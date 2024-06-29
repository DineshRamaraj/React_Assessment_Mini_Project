const SingleSelect = props => {
  const {questionList, currentQuestion, currentAnswerId, changeOption} = props
  const {options} = questionList[currentQuestion]

  const onChangeSelectItem = event => {
    changeOption(event.target.value)
  }

  return (
    <select
      id={currentAnswerId}
      value={currentAnswerId}
      onChange={onChangeSelectItem}
      className="question-select-container"
    >
      {options.map(eachItem => (
        <option
          id={eachItem.id}
          key={eachItem.id}
          value={eachItem.id}
          className="question-select-item"
        >
          {eachItem.text}
        </option>
      ))}
    </select>
  )
}

export default SingleSelect
