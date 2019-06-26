import React, { useState, useEffect, memo, useRef } from 'react'
import { LoadingSpinner } from '../../loading-spinner/loading-spinner'

import { getUploadParameters, fileUploadEnabled } from '../../utils/set-upload-parameter'

const Uppy = require('@uppy/core')
const AwsS3 = require('@uppy/aws-s3')
const { DragDrop } = require('@uppy/react')

interface iSV {
  targetField: string,
  property: string
}

interface iFile {
  id: string,
  label: string,
  description: string,
  accept: any[],
  multiple: boolean,
  url: string,
  onStart: Function,
  onChange: Function,
  component: Function,
  disabled: boolean,
  error: string,
  touched: boolean,
  inGrid: boolean,
  value: any,
  handleAddedFile: Function,
  setValues: iSV[],
  validation: any,
  expandable?: boolean
}

interface iLink {
  id: string,
  status: string,
  link?: string
}

const File = memo((props: iFile) => {
  const [status, setStatus] = useState("idle")
  const [links, setLinks] = useState<iLink[] | []>([])
  const [expanded, setExpanded] = useState(!props.expandable)
  const linkRef = useRef<iLink[]>(links)

  if (!fileUploadEnabled) {
    console.error("Fileupload via Uppy is not enabled. Please set a valid getUploadParameter function!")
    return null
  }

  const {
    id,
    accept,
    multiple = false,
    onChange = () => { },
    disabled = false,
    description,
    label,
    error,
    touched,
    inGrid,
    value,
    handleAddedFile,
    expandable
  } = props

  const config = {
    allowedFileTypes: accept
  }

  useEffect(() => {
    if (links.length !== 0 && links.every(l => l.status !== "uploading")) {
      if (multiple) {
        // @ts-ignore
        onChange({ target: { value: [...value, ...links.map(l => l.link)] } })
      } else {
        onChange({ target: { value: links[0].link } })
      }
      setLinks([])
      linkRef.current = []
    }
  }, [links])

  const handleRemove = link => onChange({ target: { value: value.filter(v => v !== link) } })

  const uppy = Uppy({
    meta: {
      type: 'avatar'
    },
    restrictions: !multiple ?
      {
        ...config,
        maxNumberOfFiles: 1
      } :
      config,
    autoProceed: true,
    allowedFileType: accept
  })

  uppy.use(AwsS3, {
    getUploadParameters
  })

  uppy.on('file-added', (file) => {
    const data = file.data
    const url = URL.createObjectURL(data)
    const image = new Image()
    image.src = url
    image.onload = () => {
      uppy.setFileMeta(file.id, { width: image.width, height: image.height })
      URL.revokeObjectURL(url)
    }
  })
  uppy.on('upload', (e) => {
    linkRef.current = e.fileIDs.map(f => ({ id: f, status: "uploading" }))
    setLinks(e.fileIDs.map(f => ({ id: f, status: "uploading" })))
    setStatus("loading")
  })
  uppy.on('upload-error', (file, err, res) => {
    linkRef.current = linkRef.current.map(l => l.id === file.id ? { ...l, status: 'failed' } : l)
    // @ts-ignore
    setLinks(links.map(l => l.id === file.id ? { ...l, status: 'failed' } : l))
    setStatus("fail")
  })

  uppy.on('upload-success', (file, data) => {
    handleAddedFile({
      field: props,
      file: {
        format: file.meta.type,
        height: file.meta.height,
        width: file.meta.width,
        size: file.data.size
      }
    })
    linkRef.current = linkRef.current.map(l => l.id === file.id ? { ...l, link: `${file.xhrUpload.endpoint}/${file.meta.key}`, status: 'uploaded' } : l)
    // @ts-ignore
    setLinks(linkRef.current.map(l => l.id === file.id ? { ...l, link: `${file.xhrUpload.endpoint}/${file.meta.key}`, status: 'uploaded' } : l))
    setStatus("success")
  })

  const path = id.split(".")

  const adjustedLinks = multiple ? [
    ...value.map(v => ({ id: "", link: v, status: "" })),
    ...linkRef.current
  ] : []

  return (
    <div
      style={{
        gridArea: inGrid ? path[path.length - 1] : "",
        gridTemplateRows: "max-content max-content 1fr max-content"
      }}
      className="ptf__field ptf__field__file">
      <label onClick={() => expandable ? setExpanded(!expanded) : null}>
        {label}
      </label>
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
      {
        multiple ?
          <ul data-expanded={expanded}>
            {
              adjustedLinks.map((v, i) => (
                <li
                  className="ptf__field__file-file"
                  key={i}
                  style={v.link ? {
                    backgroundImage: `url(${v.link})`,
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    position: "relative",
                    backgroundRepeat: "no-repeat"
                  } : {}}>
                  {
                    v.status === "uploading" ?
                      <LoadingSpinner /> :
                      <>
                        <div className="ptf__field__file-file-backdrop"></div>
                        <i
                          onClick={() => handleRemove(v.link)}
                          className="material-icons">
                          clear
                        </i>
                      </>
                  }
                </li>
              ))
            }
            <li className="ptf__field__file__uppy">
              <div className="pft__field__file__box">
                Add Files
              </div>
              {
                !disabled ?
                  <DragDrop
                    uppy={uppy}
                    locale={{
                      strings: {
                        dropHereOr: '',
                        browse: 'Select Images'
                      }
                    }}
                  /> :
                  null
              }
            </li>
          </ul> :
          <div className="ptf__field__file__uppy">
            <div
              style={{
                backgroundImage: `url(${value})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                position: "relative",
                backgroundRepeat: "no-repeat"
              }}
              className="pft__field__file__box">
              {
                status === "loading" ?
                  <LoadingSpinner /> :
                  value === "" ?
                    "Select File" :
                    null
              }
            </div>
            {
              !disabled ?
                <DragDrop
                  uppy={uppy}
                  locale={{
                    strings: {
                      dropHereOr: '',
                      browse: 'Select Images'
                    }
                  }}
                /> :
                null
            }
          </div>
      }

      <p className="ptf__field-error">
        {
          status === "fail" ?
            "Upload failed" :
            touched ?
              error :
              ""
        }
      </p>
    </div>
  )
})

export default File