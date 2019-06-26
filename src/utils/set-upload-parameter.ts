export let fileUploadEnabled: boolean = false
export let getUploadParameters: Function

export const setUploadParameters = (func: Function) => {
  getUploadParameters = func
  fileUploadEnabled = true
}