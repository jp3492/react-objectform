import { validationRules as vr } from './validation-rules'
import { getValueByPath as gv } from './get-value-by-path'
import { setValueByPath as sv } from './set-value-ba-path'
import { validateForm as vf, validateField as vfd } from './validate-form'
import { getInitialValues as iv } from './get-initial-values'
import { getInitialTouches as it } from './getInitialTouches'
import { getInitialErrors as ie } from './getInitialErrors'
import { addIdsToObject as aio } from './add-ids-to-object'
import { isFormValid as ifv } from './is-form-valid'

export const validationRules = vr
export const getValueByPath = gv
export const setValueByPath = sv
export const validateForm = vf
export const getInitialValues = iv
export const getInitialTouches = it
export const getInitialErrors = ie
export const addIdsToObject = aio
export const validateField = vfd
export const isFormValid = ifv