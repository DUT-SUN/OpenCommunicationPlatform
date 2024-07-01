import React, { useRef, useEffect } from 'react';
import { Modal } from 'antd';
import videoBackground from '@/assets/dragon.mp4';
import './index.scss'
const BackgroundVideo = () => {
    const videoRef = useRef();

    useEffect(() => {
        videoRef.current.play();
    }, []);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.01)', zIndex: 0 }}>
          <video ref={videoRef} autoPlay loop muted className='viedo'>
            <source src={videoBackground} type='video/mp4' />
          </video>
        </div>
      );
      
}
export default BackgroundVideo;
