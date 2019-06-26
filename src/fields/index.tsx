import React from 'react'

import { addIdsToObject } from '../utils'

import Text from './input/input'
import Group from './group/group'
import Select from './select/select'
import List from './list/list'
import Date from './date/date'
import File from './file/file'
import Array from './array/array'

const trimPaths = (id, paths) => paths.map(p => {
  if (id.split(".")[0] !== p.split(".")[0]) {
    return ""
  } else {
    return p.split(".").reduce((res, p, i) => {
      if (p === id.split(".")[i]) {
        if (res === "") {
          return p
        } else {
          return `${res}.${p}`
        }
      }
      return ""
    }, "")
  }
}).filter(p => p !== "")
  .map(p => p.split(".").slice(id.split(".").length - 1, p.split(".").length))

export const Field = (props: any) => {
  const {
    defaultValue,
    handleFileAdded,
    disabledFields = [],
    enabledFields = [],
    visibleFields = [],
    hiddenFields = [],
    disabled,
    hidden,
    visible,
    ...fieldProps
  } = props

  const isDisabled = disabledFields.includes(fieldProps.id)

  if (hiddenFields.includes(fieldProps.id) || (hidden && !visibleFields.includes(fieldProps.id))) {
    return null
  }

  switch (props.type) {
    case "input": return <Text {...fieldProps} disabled={isDisabled} />
    case "group":
      return (
        <Group
          {...fieldProps}
          handleFileAdded={handleFileAdded}
          visibleFields={visibleFields}
          hiddenFields={hiddenFields}
          disabledFields={disabledFields}
          enabledFields={enabledFields} />
      )
    case "select":
      return <Select {...fieldProps} disabled={isDisabled} />
    case "list":
      return (
        <List
          {...addIdsToObject(fieldProps, "")}
          visibleFields={trimPaths(fieldProps.id, visibleFields)}
          hiddenFields={trimPaths(fieldProps.id, hiddenFields)}
          enabledFields={trimPaths(fieldProps.id, enabledFields)}
          disabledFields={trimPaths(fieldProps.id, disabledFields)} />
      )
    case "date": return <Date {...fieldProps} disabled={isDisabled} />
    case "file": return <File {...fieldProps} handleFileAdded={handleFileAdded} disabled={isDisabled} />
    case "array": return <Array {...fieldProps} disabled={isDisabled} />
    default: return null
  }
}