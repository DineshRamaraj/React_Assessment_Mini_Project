const SingleSelect = props => {
  const {questionList, currentQuestion, answerId, changeOption} = props
  const {options} = questionList[currentQuestion]

  let selectAnswerId = answerId || options[0].id

  if (answerId !== undefined) {
    selectAnswerId = answerId
  } else {
    selectAnswerId = options[0].id
  }

  console.log(selectAnswerId)

  const onChangeSelectItem = event => {
    changeOption(event.target.value)
  }

  return (
    <select
      id={`select-${currentQuestion}`}
      value={selectAnswerId}
      onChange={onChangeSelectItem}
      className="question-select-container"
    >
      {options.map(eachItem => (
        <option
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
