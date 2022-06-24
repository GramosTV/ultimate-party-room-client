import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { SocketContext } from '../context/Socket'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Player } from './VideoPlayer';
interface VideoUploadProps {
  room: string;
  setPlayerState: Dispatch<SetStateAction<Player>>;
}

export function VideoUpload({room, setPlayerState}: VideoUploadProps) {
  const socket = useContext(SocketContext)
  const [fileVerification, setFileVerification] = useState(false)
  const uploadVideo = (e: any) => {
    const file = e.target.files[0]
    if (file && !file.name) {
      setFileVerification(false)
      window.alert('Please select a file')
      return false
    }
    if (file.size > 100e6) {
      setFileVerification(false)
      window.alert('Please upload a file smaller than 100 MB')
      return false
    }
    setFileVerification(true)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
      const encoded = encodeURI(`http://localhost:3001/videos/${room}`)
      const res = await fetch(encoded, {
        method: 'POST',
        body: data,
      })
      const response = (await res.json())?.videoUrl
      socket.emit('updateVideoUrl', { videoUrl: response}, (videoUrl: string) => {
        setPlayerState((prevState) => ({
            ...prevState,
            url: videoUrl,
          }));
          setFileVerification(false)
      })
  }
  return (
    <div className="videoUpload">
      <h2 className='gradientText small'>
        Upload video
      </h2>
      <div
        className='gradientText'
      >
        <form
          action='http://localhost:3001/videos'
          method='post'
          encType='multipart/form-data'
          onSubmit={handleSubmit}
          className='vidForm'
        >
          <input type='file' accept='video/mp4' name='video' id='video' onChange={uploadVideo} />
          <label
            htmlFor='video'
            className={`photoLabel uploadBtn ${fileVerification ? 'verified' : ''}`}
          >
            {fileVerification ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faUpload} />
            )}
          </label>
          {fileVerification ? (
            <button className='submitForm' type='submit'>
              Load
            </button>
          ) : <button className='submitForm disabled' type='submit'>
          Load
        </button>}
        </form>
      </div>
    </div>
  )
}
