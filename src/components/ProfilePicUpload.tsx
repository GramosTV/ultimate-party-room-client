import { ChangeEventHandler, DetailedHTMLProps, FormEventHandler, FormHTMLAttributes, useContext, useState } from "react";
import { SocketContext } from "../context/Socket";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faCheck } from '@fortawesome/free-solid-svg-icons'
interface ProfilePicUploadProps {
  join: () => void;
}

export function ProfilePicUpload(props: ProfilePicUploadProps) {
  const socket = useContext(SocketContext);
  const [fileVerification, setFileVerification] = useState(false)
  const uploadImage = (e: any) =>{
    let file = e.target.files[0];
      if (file && !file.name) {
        setFileVerification(false)
         window.alert("Please select a file");
         return false;
      }
      if (file.size > 10e6) {
        setFileVerification(false)
        window.alert("Please upload a file smaller than 10 MB");
        return false;
      }
      setFileVerification(true)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget)
    props.join()
    socket.emit('clientId', {}, (clientId: string) => {
      const encoded = encodeURI(`http://localhost:3001/photos/${clientId}`);
      fetch(encoded, {
      method: 'POST',
      body: data,
    })
    })
  };
  const handleSkip = () => {
   props.join() 
  } 
  return (
    <div>
      <h2 className='gradientText animate__animated animate__fadeIn'>Upload your profile picture</h2>
      <div className='gradientText animate__animated animate__fadeIn' style={{animationDelay: '1s'}}>
    <form action="http://localhost:3001/photos" method="post" encType="multipart/form-data" onSubmit={handleSubmit} className='pfpForm'>
    <input type="file" accept="image/*" name="photo" id="photo" onChange={uploadImage}/>
    <label htmlFor="photo" className={`photoLabel uploadBtn ${fileVerification ? 'verified' : ''}`}>
    {fileVerification ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faUpload} />}
    
      {/* <span>Upload</span> */}
      </label>
      {fileVerification ? <button className="submitForm animate__animated animate__fadeIn" type="submit">
             Submit
      </button> : null}
      
    </form>
    </div>
    <button className='skip animate__animated animate__fadeIn' style={{animationDelay: '2s'}} onClick={handleSkip}>Skip</button>
    </div>
  );
}