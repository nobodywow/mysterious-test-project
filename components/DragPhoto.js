import { useState } from "react";
import styled, { keyframes, css } from "styled-components";

const DragOverAnimation = keyframes`
  0% {
    opacity: 1
  }
  100% {
    opacity: 0.8
  }
`;

const PrintPhoto = styled.div`
  width: calc(50% - 10px);
  opacity: ${props => props.isOver ? 0.8 : 1};
  animation: ${props => props.isOver ? css`${DragOverAnimation} .3s ease-out` : 'none'};

  img {
    max-width: 100%;
  }
`;

export default function DragPhoto({ image, onDrag, onDragEnd, onDrop, onDragStart }) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleOnDrop = (event) => {
    onDrop(event);
    setIsDraggedOver(false);
  }

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggedOver(true);
  }

  return (
    <PrintPhoto
      isOver={isDraggedOver}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDraggedOver(false)}
      onDrop={handleOnDrop}
      onDragStart={onDragStart}
      draggable
    >
      <img src={image} alt="" draggable="false" />
    </PrintPhoto>
  )
}