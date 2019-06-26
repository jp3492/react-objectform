import React, { useState, useEffect } from 'react'
import { validateField } from '../../utils/validate-form'

interface iProps {
  // field props
  label?: string,
  description?: string,
  error: string,
  touched: boolean,
  // input specific props
  type: string,
  value: any[],
  onChange: any,
  onBlur: any,
  inputType: string,
  id: string,
  dependencies: any[],
  placeholder: string,
  path: string[],
  inGrid: boolean
}

const placeholders = {
  text: "Text",
  number: "Number",
  email: "Email",
  password: "Password"
}

const ArrayField = (props: iProps) => {
  const [addValue, setValue] = useState("")
  const [isTouched, setIsTouched] = useState(false)
  const [hasError, setError] = useState("")
  const [checkErrors, setCheckErrors] = useState(false)

  const {
    label,
    description,
    error,
    touched,
    inputType,
    id,
    dependencies,
    placeholder,
    path = id.split("."),
    inGrid,
    onChange,
    value,
    ...inputProps
  } = props

  const handleAdd = () => {
    onChange({ target: { value: [...value, addValue] } })
    setIsTouched(false)
    setError("")
    setCheckErrors(false)
    setValue("")
  }

  const handleBlur = () => {
    if (!checkErrors) {
      setCheckErrors(true)
    }
    if (!isTouched) {
      setIsTouched(true)
    }
  }

  const handleRemove = item => onChange({ target: { value: value.filter(v => v !== item) } })

  useEffect(() => {
    if (checkErrors) {
      setError(validateField(props, value)) // not sure if its smart to validate the whole form on every value change
    }
  }, [value, isTouched])

  return (
    <div
      style={{ gridArea: inGrid ? path[path.length - 1] : "" }}
      className="ptf__field ptf__field__array">
      <label>
        {label}
      </label>
      <p className="ptf__field-description">
        {description}
      </p>
      <div className="ptf__field__array-input">
        {
          inputType === "textarea" ?
            <textarea
              placeholder={placeholder ? placeholder : "Input Textarea..."}
              data-invalid={touched ? error !== "" : false}
              {...inputProps}
              onChange={({ target: { value } }) => setValue(value)}
              onBlur={handleBlur}
              value={addValue}
              name={id} /> :
            <input
              placeholder={placeholder ? placeholder : `Input ${placeholders[inputType]}`}
              data-invalid={touched ? error !== "" : false}
              {...inputProps}
              onChange={({ target: { value } }) => setValue(value)}
              onBlur={handleBlur}
              value={addValue}
              type={inputType}
              name={id} />
        }
        <a
          data-disabled={addValue === ""}
          className="ptf__button ptf__button--submit"
          onClick={handleAdd}>
          Add To List
        </a>
      </div>
      <ul className="ptf__field__array-list">
        {
          value.map((v: any, i) => (
            <li key={i}>
              <label>
                {v}
              </label>
              <i
                onClick={() => handleRemove(v)}
                className="material-icons">
                clear
              </i>
            </li>
          )
          )
        }
      </ul>
      <p className="ptf__field-error">
        {touched ? error : ""}
      </p>
    </div>
  )
}

export default ArrayField