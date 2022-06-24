import { faEraser, faImage, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  CanvasPath,
  ExportImageType,
  ReactSketchCanvas,
  ReactSketchCanvasProps,
  ReactSketchCanvasRef,
} from 'react-sketch-canvas'
import { SocketContext } from '../context/Socket'

type Handlers = [string, () => void, string][]

interface InputFieldProps {
  fieldName: keyof ReactSketchCanvasProps
  type?: string
  canvasProps: Partial<ReactSketchCanvasProps>
  setCanvasProps: React.Dispatch<React.SetStateAction<Partial<ReactSketchCanvasProps>>>
}

function InputField({ fieldName, type = 'text', canvasProps, setCanvasProps }: InputFieldProps) {
  let value; 
  const socket = useContext(SocketContext)
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    if (fieldName === 'backgroundImage') {
      socket.emit('updateCanvasBgc', {
        canvasBgc: target.value,
      });
    }
    
    if (fieldName === 'strokeWidth') {
      setStrokeWidth(target.value)
      value = strokeWidth
    } else if (fieldName === 'eraserWidth') {
      setEraserWidth(target.value)
      value = eraserWidth
    } else {
      value = canvasProps[fieldName] as string
    }


    setCanvasProps((prevCanvasProps: Partial<ReactSketchCanvasProps>) => ({
      ...prevCanvasProps,
      [fieldName]: type === 'range' ? Number(target.value) : target.value,
    }))
  }
  const [strokeWidth, setStrokeWidth] = useState('0')
  const [eraserWidth, setEraserWidth] = useState('0')
  const id = 'validation' + fieldName
  
  return (
    <div className='p-2 col-10 canvasProps'>
      <label htmlFor={id} className='form-label'>
        {fieldName}
      </label>
      <input
        name={fieldName}
        type={type}
        className='form-control'
        id={id}
        value={value}
        onChange={handleChange}
        min={1}
        max={30}
        placeholder={fieldName === 'backgroundImage' ? 'Enter image url' : ''}
      />
    </div>
  )
}
interface SketchCanvasProps {
  room: string
}
export function SketchCanvas({room}: SketchCanvasProps) {
  const socket = useContext(SocketContext);
  const canvasRef = React.createRef<ReactSketchCanvasRef>()
  const clearHandler = () => {
    const clearCanvas = canvasRef.current?.clearCanvas

    if (clearCanvas) {
      socket.emit('canvasClean', {})
      clearCanvas()
    }
  }
  const [canvasProps, setCanvasProps] = React.useState<Partial<ReactSketchCanvasProps>>({
    className: 'react-sketch-canvas',
    width: '100%',
    height: '500px',
    backgroundImage:
      'https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg',
    preserveBackgroundImageAspectRatio: 'none',
    strokeWidth: 4,
    eraserWidth: 5,
    strokeColor: '#000000',
    canvasColor: '#FFFFFF',
    style: { borderRight: '1px solid #CCC' },
    svgStyle: {},
    exportWithBackgroundImage: true,
    withTimestamp: true,
    allowOnlyPointerType: 'all',
  })
  useEffect(() => {
    clearHandler()
  }, [room])
  useMemo(() => {
    setCanvasProps({
      className: 'react-sketch-canvas',
      width: '735px',
      height: '500px',
      backgroundImage:
        'https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg',
      preserveBackgroundImageAspectRatio: 'none',
      strokeWidth: 4,
      eraserWidth: 5,
      strokeColor: '#000000',
      canvasColor: '#FFFFFF',
      style: { borderRight: '1px solid #CCC' },
      svgStyle: {},
      exportWithBackgroundImage: true,
      withTimestamp: true,
      allowOnlyPointerType: 'all',
    })
    socket.on('updateCanvasBgc', (canvasBgc: string) => {
      setCanvasProps((prevState) => ({ ...prevState, backgroundImage: canvasBgc }))
    })
    socket.emit('getCanvasBgc', {}, (canvasBgc: string) => {
      setCanvasProps((prevState) => ({ ...prevState, backgroundImage: canvasBgc }))
    })
  }, [room])
  

  const inputProps: Array<[keyof ReactSketchCanvasProps, 'text' | 'number' | 'range']> = [
    // ['className', 'text'],
    // ['width', 'text'],
    // ['height', 'text'],
    ['backgroundImage', 'text'],
    // ['preserveBackgroundImageAspectRatio', 'text'],
    ['strokeWidth', 'range'],
    ['eraserWidth', 'range'],
  ]

  
  const [getCanvasFlag, setGetCanvasFlag] = useState(true)
  useMemo(() => {
    if (getCanvasFlag) {
      socket.emit('getCanvas', {}, (canvas: any) => {
        if (canvas && canvasRef.current) {
          const pathsToUpdate = JSON.parse(canvas)
          canvasRef.current?.loadPaths(pathsToUpdate)
          setGetCanvasFlag(false)
        } else if (canvasRef.current) {
          console.log('Canvas is empty')
          setGetCanvasFlag(false)
        }
      })
    }
  }, [canvasRef])
  useEffect(() => {
    socket.on('canvasChange', (canvasAction: CanvasPath) => {
      const pathsToUpdate = JSON.parse(JSON.stringify(canvasAction))
      canvasRef.current?.loadPaths(pathsToUpdate)
    })
    socket.on('canvasClean', () => {
      const clearCanvas = canvasRef.current?.clearCanvas
      if (clearCanvas) {
        clearCanvas()
      }
    })
  }, [canvasRef])

  const [dataURI, setDataURI] = React.useState<string>('')
  const [svg, setSVG] = React.useState<string>('')
  const [paths, setPaths] = React.useState<CanvasPath[]>([])
  const [lastStroke, setLastStroke] = React.useState<{
    stroke: CanvasPath | null
    isEraser: boolean | null
  }>({ stroke: null, isEraser: null })
  const [pathsToLoad, setPathsToLoad] = React.useState<string>('')
  const [exportImageType, setexportImageType] = React.useState<ExportImageType>('png')

  const imageExportHandler = async () => {
    const exportImage = canvasRef.current?.exportImage

    if (exportImage) {
      const exportedDataURI = await exportImage(exportImageType)
      setDataURI(exportedDataURI)
    }
  }

  const svgExportHandler = async () => {
    const exportSvg = canvasRef.current?.exportSvg

    if (exportSvg) {
      const exportedDataURI = await exportSvg()
      setSVG(exportedDataURI)
    }
  }
  const [eraseState, setEraseState] = useState(false)
  const penHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode

    if (eraseMode) {
      eraseMode(false)
      setEraseState(false)
    }
  }

  const eraserHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode

    if (eraseMode) {
      eraseMode(true)
      setEraseState(true)
    }
  }

  

  const createButton = (label: string, handler: () => void, themeColor: string) => ( 
    <button
      key={label}
      className={`btn btn-${themeColor} btn-block canvasBtn`}
      type='button'
      onClick={handler}
    >
      {(() => {
      if (label === 'Eraser') {
        return <FontAwesomeIcon icon={faEraser} className={
          eraseState ? 'active' : ''}/>
      } else if (label === 'Pen') {
        return <FontAwesomeIcon icon={faPen} className={!eraseState ? 'active' : ''}/>
      } else if (label === 'Clear All') {
        return <FontAwesomeIcon icon={faTrashCan}/>
      } else if (label === 'Export Image') {
        return <FontAwesomeIcon icon={faImage}/>
      } else if (label === 'Export SVG') {
        return <div><FontAwesomeIcon icon={faImage}/> SVG</div> 
      }
      return label
      })()}
    </button>
  )
  const buttonsWithHandlers: Handlers = [
    ['Clear All', clearHandler, 'primary'],
    ['Pen', penHandler, 'secondary'],
    ['Eraser', eraserHandler, 'secondary'],
    ['Export Image', imageExportHandler, 'success'],
    ['Export SVG', svgExportHandler, 'success'],
  ]

  const onChange = (updatedPaths: CanvasPath[]): void => {
    setPaths(updatedPaths)
  }

  return (
    <main className='container-fluid p-5'>
      <h3 className='gradientText'>Canvas</h3>
      <div className='row'>
        <aside className='col-3 border-right'>
          {/* <header className='my-5'> */}
            {/* <h3>Props</h3> */}
          {/* </header> */}
          <form className='canvasPropsForm'>
            {inputProps.map(([fieldName, type]) => {
              return (
                <InputField
                  key={fieldName}
                  fieldName={fieldName}
                  type={type}
                  canvasProps={canvasProps}
                  setCanvasProps={setCanvasProps}
                />
              )
            })}
            <div className='p-2 col-10 d-flex '>
              <div>
                <label htmlFor='strokeColorInput' className='form-label'>
                  strokeColor
                </label>
                <input
                  type='color'
                  name='strokeColor'
                  className='form-control form-control-color'
                  id='strokeColorInput'
                  value={canvasProps.strokeColor}
                  title='Choose stroke color'
                  onChange={(e) => {
                    setCanvasProps((prevCanvasProps: Partial<ReactSketchCanvasProps>) => ({
                      ...prevCanvasProps,
                      strokeColor: e.target.value,
                    }))
                  }}
                ></input>
              </div>
              {/* <div className='mx-4'>
                <label htmlFor='canvasColorInput' className='form-label'>
                  canvasColor
                </label>
                <input
                  name='canvasColor'
                  type='color'
                  className='form-control form-control-color'
                  id='canvasColorInput'
                  value={canvasProps.canvasColor}
                  title='Choose stroke color'
                  onChange={(e) => {
                    setCanvasProps((prevCanvasProps: Partial<ReactSketchCanvasProps>) => ({
                      ...prevCanvasProps,
                      backgroundImage: '',
                      canvasColor: e.target.value,
                    }))
                  }}
                ></input>
              </div> */}
            </div>
            <div className='p-2 col-10'>
              <div className='form-check form-switch'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  role='switch'
                  id='switchExportWithBackgroundImage'
                  checked={canvasProps.exportWithBackgroundImage}
                  onChange={(e) => {
                    setCanvasProps((prevCanvasProps: Partial<ReactSketchCanvasProps>) => ({
                      ...prevCanvasProps,
                      exportWithBackgroundImage: e.target.checked,
                    }))
                  }}
                />
                <label className='form-check-label' htmlFor='switchExportWithBackgroundImage'>
                  exportWithBackgroundImage
                </label>
              </div>
            </div>
          </form>
        </aside>
        <section className='col-9'>
          <header className='my-5'>
          </header>
          <section className='row no-gutters canvas-area m-0 p-0'>
            <div className='col-9 canvas p-0'>
              <ReactSketchCanvas
                ref={canvasRef}
                onChange={onChange}
                onStroke={(stroke, isEraser) => {
                  socket.emit('canvasChange', { canvasAction: stroke })
                  console.log('emited')
                  setLastStroke({ stroke, isEraser })
                }}
                {...canvasProps}
              />
            </div>
            <div className='col-3 panel'>
              <div className='d-grid gap-2'>
                {buttonsWithHandlers.map(([label, handler, themeColor]) =>
                  createButton(label, handler, themeColor),
                )}
              </div>
            </div>
          </section>
         
        </section>
        <div className='exports'>

          
<section className='row image-export p-3 justify-content-center align-items-start'>
  <div className='col-5 offset-2'>
    <p>Exported image</p>
    <img
      className='exported-image'
      id='exported-image'
      src={
        dataURI ||
        'https://via.placeholder.com/500x250/000000/FFFFFF/?text=Click on export image'
      }
      alt='exported'
    />
  </div>
</section>

<section className='row image-export p-3 justify-content-center align-items-start'>
  <div className='col-5 offset-2'>
    <p>Exported SVG</p>
    {svg ? (
      <span
        id='exported-svg'
        className='exported-image'
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    ) : (
      <img
        src='https://via.placeholder.com/500x250/000000/FFFFFF/?text=Click on export SVG'
        alt='Svg Export'
        id='exported-svg'
        className='exported-image'
      />
    )}
  </div>
</section>
</div>
      </div>
    </main>
  )
}
