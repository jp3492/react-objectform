import React, { useState } from 'react'

import { Field } from '../../fields'

import { getValueByPath } from '../../utils'

const trimId = (parentId, childId) => childId.split('.').filter(p => !parentId.split('.').includes(p)).join('.')

interface iGroup {
  id: string,
  formFields: any,
  onChange: any,
  onBlur: any,
  value: any,
  error: string,
  touched: boolean,
  label: string,
  description: string,
  inGrid: string,
  grid: any[],
  handleAddedFile: Function,
  expandable?: boolean,
  visibleFields?: string[],
  hiddenFields?: string[],
  enabledFields?: string[],
  disabledFields?: string[]
}

const Group = (props: iGroup) => {
  const [expanded, setExpanded] = useState(!props.expandable)
  const {
    id,
    formFields,
    onChange,
    onBlur,
    value,
    error,
    touched,
    label,
    description,
    grid,
    inGrid,
    handleAddedFile,
    expandable,
    enabledFields = [],
    disabledFields = [],
    visibleFields = [],
    hiddenFields = [],
  } = props

  const path = id.split(".")

  return (
    <div
      style={{
        gridArea: inGrid ? path[path.length - 1] : ""
      }}
      className="ptf__field ptf__field__group">
      <h3 onClick={() => expandable ? setExpanded(!expanded) : null}>
        {label}
      </h3>
      <i
        onClick={() => expandable ? setExpanded(!expanded) : null}
        className="material-icons">
        {
          expandable ?
            expanded ?
              'keyboard_arrow_up' :
              'keyboard_arrow_down' :
            ''
        }
      </i>
      <p className="ptf__field-description">
        {description}
      </p>
      <ul
        data-expanded={expanded}
        style={{
          display: grid ? "grid" : "inline",
          gridTemplateAreas: grid ? `${`'${grid.join("' '")}'`}` : ""
        }}
        className="ptf__fields">
        {
          Object.keys(formFields).map((f, i) => {
            const id = trimId(props.id, formFields[f].id)
            let fieldProps = {
              ...formFields[f],
              key: i,
              value: getValueByPath(value, id),
              error: getValueByPath(error, id),
              touched: getValueByPath(touched, id),
              onChange: (e, id) => onChange(e, id || formFields[f].id),
              onBlur: () => onBlur(formFields[f].id),
              handleAddedFile,
              disabledFields,
              enabledFields,
              visibleFields,
              hiddenFields
            }
            return <Field {...fieldProps} />
          })
        }
      </ul>
      <p className="ptf__field-error">
        {/* need to add function to read errors from errors object */}
      </p>
    </div>
  )
}

export default Group