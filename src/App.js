import './App.css';
import stopWebcam from './stopwebcam';
import React, { useState, useRef, useEffect } from "react";
import Gallery from './Gallery';

function App() {
  const [capturedImages, setCapturedImages] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState('user');
  const videoRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [aspectRatio, setAspectRatio] = useState({ width: 16, height: 9 });
  const [selectedAspectRatioText, setSelectedAspectRatioText] = useState('16:9'); 

  
  useEffect(() => {
    const { width, height } = aspectRatio;
    setSelectedAspectRatioText(`${width}:${height}`);
  }, [aspectRatio]);

  const startWebcam = () => {
    const constraints = {
      video: {
        facingMode: selectedCamera === 'user' ? 'user' : { exact: 'environment' },
        aspectRatio: aspectRatio
      }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        setCapturedImages([]);
      })
      .catch((error) => {
        alert("Error accessing webcam:", error);
      });
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    const originalZoom = zoomLevel;
    setZoomLevel(1);
  
    const video = videoRef.current;
  
    const originalWidth = video.videoWidth;
    const originalHeight = video.videoHeight;
  
    if (originalZoom > 1) {
      const scaledWidth = originalWidth / originalZoom;
      const scaledHeight = originalHeight / originalZoom;
  
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
  
      // Calculate the center position for zoomed content
      const centerX = (originalWidth - scaledWidth) / 2;
      const centerY = (originalHeight - scaledHeight) / 2;
  
      // Ensure that the zoomed content remains within the original frame
      const zoomedX = Math.max(0, centerX);
      const zoomedY = Math.max(0, centerY);
  
      context.drawImage(video, zoomedX, zoomedY, scaledWidth, scaledHeight, 0, 0, scaledWidth, scaledHeight);
    } else {
      canvas.width = originalWidth;
      canvas.height = originalHeight;
  
      context.drawImage(video, 0, 0, originalWidth, originalHeight);
    }
  
    const image = canvas.toDataURL('image/png');
    setCapturedImages(prevImages => [...prevImages, image]);
  
    setZoomLevel(originalZoom);
  };

  const switchCamera = () => {
    setSelectedCamera(prevCamera => prevCamera === 'user' ? 'environment' : 'user');
    stopWebcam(mediaStream, setMediaStream); // Stop previous stream before starting new one
    startWebcam(); // Start new stream
  };

  const zoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 1));
  };

  const handleAspectRatioChange = (ratio) => {
    setAspectRatio(ratio);
  };

  const handleDeleteImage = (index) => {
    setCapturedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="App">
      <h1>Image Capture and Display Application</h1>
      <div className="container">
        <div className="video-container">
          <video id="video" ref={videoRef} autoPlay style={{ transform: `scale(${zoomLevel})` }} />
        </div>
      </div>
      <div className="controls">
        {mediaStream ? <button onClick={capturePhoto}>Capture Photo</button> : <button onClick={startWebcam}>Start camera</button>}
        <button onClick={switchCamera}>Switch Camera</button>
      </div>
      <div className="zoom-controls">
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
      <div className="aspect-ratio-controls">
        <button onClick={() => handleAspectRatioChange({ width: 16, height: 9 })}>16:9</button>
        <button onClick={() => handleAspectRatioChange({ width: 4, height: 3 })}>4:3</button>
        <button onClick={() => handleAspectRatioChange({ width: 1, height: 1 })}>1:1</button>
      </div>
      <p>Selected Aspect Ratio: {selectedAspectRatioText}</p> {/* Display selected aspect ratio text */}
      {capturedImages.length > 0 && <Gallery images={capturedImages} onDelete={handleDeleteImage} aspectRatio={aspectRatio} />}
    </div>
  );
}

export default App;
