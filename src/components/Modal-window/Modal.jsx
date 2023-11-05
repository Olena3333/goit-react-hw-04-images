import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { FcLike } from 'react-icons/fc';
import {
  StyledWrapper,
  CrossButton,
  ImageContainer,
  StyledImage,
  Title,
  LikeButton,
  ImageInfo,
} from './Modal.Styled';
import propTypes from 'prop-types';
export const Modal = ({ selectedPhoto, close }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        close();
        toast.info('Modal closed by Escape');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'visible';
    };
  }, [close]);
  const handleClickOutside = ({ target, currentTarget }) => {
    if (target === currentTarget) {
      close();
      toast.info('Modal closed by click on backdrop');
    }
  };

  return (
    <StyledWrapper onClick={handleClickOutside}>
      <CrossButton onClick={close}>✕</CrossButton>

      <div>
        <div>
          <ImageContainer>
            <StyledImage
              src={selectedPhoto.largeImageURL}
              alt={selectedPhoto.tags}
            />
          </ImageContainer>
          <ImageInfo>
            <Title>{selectedPhoto.tags}</Title>
            <LikeButton>
              <FcLike />
              <span>{selectedPhoto.likes}</span>
            </LikeButton>
          </ImageInfo>
        </div>
      </div>
    </StyledWrapper>
  );
};

Modal.propTypes = {
  close: propTypes.func.isRequired,
  selectedPhoto: propTypes.object.isRequired,
};
