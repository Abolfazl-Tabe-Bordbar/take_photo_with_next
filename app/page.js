"use client"
// pages/camera.js
import { useRef, useState, useEffect } from 'react';

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for back camera
  const [devices, setDevices] = useState([]);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    async function getDevices() {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
    }

    getDevices();
  }, []);

  useEffect(() => {
    async function getCameraStream() {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        };
      }
    }

    getCameraStream();
  }, [facingMode]);

  const switchCamera = () => {
    setFacingMode(prevFacingMode => (prevFacingMode === 'user' ? 'environment' : 'user'));
  };

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setPhoto(dataUrl);
  };

  return (
    <div className="container mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg box-border p-5">
      <video ref={videoRef} autoPlay className="w-[250px] h-[250px] rounded-lg object-cover mx-auto"></video>
      <button onClick={takePhoto}>Capture</button>
      <br/>
      <button onClick={switchCamera}>Switch Camera</button>
      <canvas ref={canvasRef} className="hidden"></canvas>
      {photo && (
        <div>
          <img src={photo} alt="Captured" className="rounded-lg"/>
        </div>
      )}
    </div>
  );
}
