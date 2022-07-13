import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import DragPhoto from "./DragPhoto";

const PREVIEW_RADIUS = 40;

const PageLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: #2778a5;
  border-radius: 8px;
  padding: 20px;
  margin: 17px 0 42px;
  justify-content: space-between;
`;

const PreviewPopAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1.1);
  }
`;

const Preview = styled.div`
  position: fixed;
  border: 4px solid white;
  border-radius: 50%;
  height: ${PREVIEW_RADIUS * 2}px;
  width: ${PREVIEW_RADIUS * 2}px;
  display: none;
  pointer-events: none;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1), 0 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-size: cover;
  background-image: url(${props => props.src});
  background-position: center;
  z-index: 1000;

  transform: scale(1.1);
  animation: ${PreviewPopAnimation} .3s ease-out;
`;

export default function PageDropZone({ initialImages }) {
  const [selectedImage, setSelectedImage] = useState();
  const [images, setImages] = useState(initialImages);
  const ghostElement = useRef(null);
  const preview = useRef(null);

  useEffect(() => {
    ghostElement.current = document.createElement('div');
  }, []);

  const handleDrag = event => {
    preview.current.style.display = 'block';
    preview.current.style.left = `${event.clientX - PREVIEW_RADIUS}px`;
    preview.current.style.top = `${event.clientY - PREVIEW_RADIUS}px`;
  }

  const handleDrop = (event, image) => {
    if (selectedImage) {
      if (image !== selectedImage) {
        setImages((prevImages) => {
          const newImages = prevImages.map((src) => {
            if (src === selectedImage) {
              return image;
            }
            if (src === image) {
              return selectedImage;
            }
            return src;
          })
          return newImages;
        })
      }
    }
  }

  const handleDragEnd = () => {
    setSelectedImage(undefined);
    preview.current.style.display = 'none';
  }

  const handleDragStart = (event, image) => {
    event.dataTransfer.setDragImage(ghostElement.current, 0, 0);
    setSelectedImage(image);
  }

  return (
    <>
      {selectedImage && <Preview ref={preview} src={selectedImage} />}
      <PageLayout>
        {images.map((image) => (
          <DragPhoto
            image={image}
            key={image}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onDrop={(event) => handleDrop(event, image)}
            onDragStart={(event) => handleDragStart(event, image)}
          />
        )
        )}
      </PageLayout>
    </>
  );
}