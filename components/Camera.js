"use client"
// pages/camera.js
import { useRef, useEffect } from 'react';

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function getCameraStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    }

    getCameraStream();
  }, []);

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay className="w-32 rounded-lg"></video>
      <button onClick={takePhoto}>Capture</button>
      <canvas ref={canvasRef}  className="w-full rounded-lg h-[200px]"></canvas>
    </div>
  );
}
