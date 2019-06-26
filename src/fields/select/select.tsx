import React, { useState } from 'react'
import './select.scss'

interface iOption {
  key: string,
  value: string
}

interface iSelect {
  id: string,
  label?: string,
  description?: string,
  value: any,
  touched: boolean,
  error: string,

  options: iOption[],
  multiple: boolean,

  onChange: any,
  onBlur: any,
  inGrid: boolean
}

const Select = (props: iSelect) => {

  const {
    id,
    label,
    description,
    touched,
    error,

    options,
    multiple = false,

    onChange,
    onBlur,
    inGrid
  } = props

  const path = id.split(".")

  return (
    <div
      style={{
        gridArea: inGrid ? path[path.length - 1] : ""
      }}
      className="ptf__field ptf__field__select">
      <label>
        {label}
      </label>
      <p className="ptf__field-description">
        {description}
      </p>
      <select
        onBlur={onBlur}
        onChange={onChange}
        multiple={multiple}>
        {
          multiple &&
          <option value="none">
            None
          </option>
        }
        {
          options.map(({
            key,
            value
          }, i) => (
              <option
                selected={key === props.value}
                key={i}
                value={key}>
                {value}
              </option>
            ))
        }
      </select>
      <p className="ptf__field-error">
        {touched ? error : ""}
      </p>
    </div>
  )
}

export default Select