

const stopWebcam = (mediaStream, setMediaStream) => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach(track => track.stop());
      document.getElementById('video').srcObject = null;
      setMediaStream(null);
    }
  }
  
  export default stopWebcam;
  