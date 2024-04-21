import React from 'react';

const Gallery = ({ images, onDelete, aspectRatio }) => {
  return (
    <div className="gallery">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image} alt={` ${index + 1}`} style={{ aspectRatio: `${aspectRatio.width}/${aspectRatio.height}` }} />
          <button className="delete-button" onClick={() => onDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Gallery;



