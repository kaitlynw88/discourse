import React, { useEffect, useRef } from 'react'
import "../styles/audioplayer.scss"

const AudioPlayer = ({user}) => {

    const ref=useRef()

    useEffect(()=>{
        user.videoTrack.play(ref.current)
    },[user.videoTrack])
  return (
    <div>
        <div 
        className='userVideo'
        ref={ref}>
        </div>
    </div>
  )
}

export default AudioPlayer