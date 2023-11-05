import React, { useEffect, useReducer } from 'react';
import { Searchbar } from './Searchbar';
import { Button } from './Button';
import { Modal } from './Modal-window/Modal';
import { BallTriangle } from 'react-loader-spinner';
import { ImageGallery } from './ImageGallery';
import { toast } from 'react-toastify';
import { fetchPics } from '../Sevise/Api';
import { Wrapper, GalleryTitle, LoaderContainer } from './App.styled';
import photosReducer, { initialState } from '../Store/reducer';

export const App = () => {
  const [state, dispatch] = useReducer(photosReducer, initialState);
  const {
    loading,
    error,
    photos,
    isOpened,
    total,
    selectedPhoto,
    page,
    per_page,
    q,
  } = state;
  useEffect(() => {
    const getPhotos = async ({ page, q }) => {
      dispatch({ type: 'leading', payload: true });
      try {
        const response = await fetchPics({
          per_page,
          page,
          q,
        });
        if (response.total === undefined || response.total <= 0) {
          dispatch({
            type: 'error',
            payload: 'Total count is missing or invalid',
          });
          toast.error('Total count is missing or invalid');
          dispatch({ type: 'leading', payload: false });
          toast.error('Total count is missing or invalid');
        } else {
          dispatch({ type: 'setPhotos', payload: response.hits });
          dispatch({ type: 'setTotal', payload: response.total });
          dispatch({ type: 'leading', payload: false });
        }
      } catch (error) {
        dispatch({ type: 'error', payload: error.message });
        toast.error(error.message);
      } finally {
        dispatch({ type: 'loading', payload: false });
      }
    };
    getPhotos({ page, q });
  }, [page, q, per_page]);
  useEffect(() => {
    error && toast.error(error);
  }, [error]);
  const handleSetQuery = q => {
    dispatch({ type: 'setQ', payload: q });
  };
  const handleLoadMore = () => {
    dispatch({ type: 'loadMore' });
  };
  const handleLikes = photo => {
    dispatch({ type: 'handleLikes', payload: photo });
  };
  const toggleModal = selectedPhoto => {
    dispatch({ type: 'toggleModal', payload: selectedPhoto });
    if (isOpened) {
      toast.success('loading');
    } else {
      toast.success("Let's choose another photo ");
    }
    return {
      isOpened,
      currentPhotoIndex: photos.indexOf(selectedPhoto),
    };
  };

  return (
    <Wrapper>
      <Searchbar setQuery={handleSetQuery} />
      {q && (
        <GalleryTitle>
          Image Gallery search request: {q} and results: {total}
        </GalleryTitle>
      )}
      {loading && !photos.length ? (
        <LoaderContainer>
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperClass={{}}
            wrapperStyle=""
            visible={true}
          />
        </LoaderContainer>
      ) : (
        <ImageGallery
          photos={photos}
          handleLikes={handleLikes}
          toggleModal={toggleModal}
        />
      )}

      {total > photos.length ? (
        <Button loading={loading} onClick={handleLoadMore}>
          {!loading ? 'Loading...' : 'Load more'}
        </Button>
      ) : null}

      {isOpened && selectedPhoto ? (
        <Modal
          close={() => dispatch({ type: 'closeModal' })}
          selectedPhoto={selectedPhoto}
          changePhoto={index =>
            dispatch({ type: 'changePhoto', payload: index })
          }
        />
      ) : null}
    </Wrapper>
  );
};
