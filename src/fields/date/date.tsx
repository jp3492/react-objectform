import React, { useState } from 'react'
import DatePicker from 'react-datepicker'


interface iDate {
  id: string,
  label: string,
  description: string,
  error: string,
  touched: boolean,
  value: number,
  onChange: any,
  onBlur: any,
  placeholder: string,
  inGrid: boolean,
  enableTime?: boolean,
  timeIntervals?: number
}

/**
 * possible config:
 * enableTime: boolean
 * 
 */

const Date = (props: iDate) => {
  const [focused, setFocused] = useState(false)

  const {
    id,
    label,
    description,
    error,
    touched,
    value,
    onChange,
    onBlur,
    placeholder,
    inGrid,
    enableTime = true,
    timeIntervals = 15
  } = props

  const path = id.split(".")

  const handleChange = date => {
    onChange({ target: { value: date.getTime() } })
  }

  const configuredOptions = enableTime ?
    {
      showTimeSelect: true,
      timeIntervals,
      timeFormat: "HH:mm",
      dateFormat: "MMMM d, yyyy h:mm aa"
    } : {}

  return (
    <div
      style={{
        gridArea: inGrid ? path[path.length - 1] : ""
      }}
      className="ptf__field ptf__field__date">
      <label>
        {label}
      </label>
      <p className="ptf__field-description">
        {description}
      </p>
      <div>
        <DatePicker
          onBlur={onBlur}
          selected={value}
          onChange={handleChange}
          showYearDropdown
          dateFormatCalendar="MMMM"
          scrollableYearDropdown
          yearDropdownItemNumber={15}
          {
          ...configuredOptions
          }
        />
      </div>
      <p className="ptf__field-error">
        {touched ? error : ""}
      </p>
    </div>
  )
}

export default Date