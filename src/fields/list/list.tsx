import React, { useState, useEffect, memo } from 'react'

import { Field } from '../../fields'

import {
  getValueByPath,
  setValueByPath,
  getInitialErrors,
  getInitialTouches,
  getInitialValues,
  validateForm,
  isFormValid
} from '../../utils'

interface iList {
  id: string,
  value: any[],
  error: string,
  touched: boolean,
  label: string,
  description: string,

  formFields: any[],
  onChange: any,
  onBlur: any,
  grid: string[],
  inGrid: boolean,
  handleAddedFile: Function,
  visibleFields?: string[],
  hiddenFields?: string[],
  enabledFields?: string[],
  disabledFields?: string[]
}

const trimId = (parentId, childId) => childId.split('.').filter(p => !parentId.split('.').includes(p)).join('.')

const List = memo((props: iList) => {
  const [values, setValues] = useState(getInitialValues(props))
  const [touches, setTouches] = useState(getInitialTouches(props))
  const [errors, setErrors] = useState(getInitialErrors(props))
  const [checkErrors, setCheckErrors] = useState(false)

  const {
    id,
    label,
    description,
    formFields,
    value,
    error,
    touched,
    onChange,
    grid,
    inGrid,
    enabledFields = [],
    disabledFields = [],
    visibleFields = [],
    hiddenFields = [],
  } = props

  const handleAdd = () => {
    onChange({ target: { value: [...value, values] } })
    setErrors(getInitialErrors(props))
    setTouches(getInitialTouches(props))
    setValues(getInitialValues(props))
    setCheckErrors(false)
  }

  const handleClear = index => onChange({ target: { value: value.filter((v, i) => i !== index) } })

  const handleEdit = index => {
    setValues(value[index])
    handleClear(index)
  }

  const handleChange = (value, id) => {
    setValues(setValueByPath(values, id, value))
  }

  const handleBlur = (field: string) => {
    if (!checkErrors) {
      setCheckErrors(true)
    }
    if (!getValueByPath(touches, field)) {
      setTouches(setValueByPath(touches, field, true))
    }
  }

  const handleAddedFile = ({
    field,
    file // contains: Array [{ targetField: '...width', property: 'width' }]
  }) => {
    setTouches(setValueByPath(touches, field.id, true))
    if (field.hasOwnProperty("setValues")) {
      field.setValues.forEach(({
        targetField,
        property
      }) => {
        setTouches(setValueByPath(touches, targetField, true))
        setValues(setValueByPath(values, targetField, file[property]))
      })
    }
    setCheckErrors(true)
  }

  useEffect(() => {
    if (checkErrors) {
      setErrors(validateForm(formFields, values, errors)) // not sure if its smart to validate the whole form on every value change
    }
  }, [values, touches])

  const path = id.split(".")

  const isValid = checkErrors && isFormValid(errors)

  // console.log("Values :", values)
  // console.log("Touches :", touches)
  // console.log("Errors :", errors)
  // console.log(isValid)
  return (
    <div
      style={{
        gridArea: inGrid ? path[path.length - 1] : ""
      }}
      className="ptf__field ptf__field__list">
      <h3>
        {label}
      </h3>
      <p className="ptf__field-description">
        {description}
      </p>
      <div className="ptf__field__list__fields">
        <ul
          style={{
            gridTemplateAreas: grid ? `${`'${grid.join("' '")}'`}` : ""
          }}>
          {
            Object.keys(formFields).map((f, i) => {
              const trimmedId = trimId(props.id, formFields[f].id)
              let fieldProps = {
                ...formFields[f],
                key: i,
                value: getValueByPath(values, trimmedId),
                error: getValueByPath(errors, trimmedId),
                touched: getValueByPath(touches, trimmedId),
                onChange: (e, id) => handleChange(e.target.value, id || trimmedId),
                onBlur: () => handleBlur(trimmedId),
                inGrid: props.hasOwnProperty("grid"),
                handleAddedFile,
                disabledFields,
                enabledFields,
                visibleFields,
                hiddenFields
              }
              return <Field key={i} {...fieldProps} />
            })
          }
        </ul>
        <a
          data-disabled={!isValid}
          className="ptf__button ptf__button--submit"
          onClick={handleAdd}>
          Add To List
        </a>
      </div>
      <ul className="ptf__field__list__values">
        {
          value.length === 0 &&
          <li className="ptf__field__list__empty">
            No Items
          </li>
        }
        {
          value.map((v, i) => (
            <li key={i}>
              <ul>
                {
                  Object.keys(v).map((att, ind) => (
                    <li key={ind}>
                      {
                        typeof v[att] === 'object' && v[att].constructor === Object ?
                          "is Object" :
                          v[att]
                      }
                    </li>
                  ))
                }
              </ul>
              <i
                onClick={() => handleEdit(i)}
                className="material-icons">
                edit
              </i>
              <i
                onClick={() => handleClear(i)}
                className="material-icons">
                clear
              </i>
            </li>
          ))
        }
      </ul>
    </div>
  )
})

export default List