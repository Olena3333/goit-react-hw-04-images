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
  const toggleModal = photo => {
    this.setState(prevState => {
      const isOpened = !prevState.isOpened;
      if (isOpened) {
        toast.success('Loading...');
      } else {
        toast.success('Choose another query');
      }
      return {
        isOpened,
        currentPhotoIndex: prevState.photos.indexOf(photo),
      };
    });
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
        <Modal close={toggleModal} selectedPhoto={selectedPhoto} />
      ) : null}
    </Wrapper>
  );
};

// export class App extends React.Component {
//   state = { ...INITIAL_STATE_POSTS };
//   async componentDidMount() {
//     this.getPhotos();
//     toast.info('Start');
//   }

//   async componentDidUpdate(_, prevState) {
//     const { page, q } = this.state;
//     if (prevState.page !== page || q !== prevState.q) {
//       this.getPhotos();
//     }
//   }

//   handleLoadMore = () => {
//     this.setState(prevState => ({ page: prevState.page + 1 }));
//   };

//   handleSetQuery = q => {
//     this.setState({ q, photos: [], page: 1 });
//   };

//   getPhotos = async () => {
//     const { per_page, page, q } = this.state;
//     this.setState({ loading: true });

//     try {
//       const response = await fetchPics({
//         per_page,
//         page,
//         q,
//       });
//       if (response.total === undefined || response.total <= 0) {
//         this.setState({
//           error: 'Total count is missing or invalid',
//           loading: false,
//         });
//         toast.error('Total count is missing or invalid');
//         return;
//       }
//       this.setState(prevState => ({
//         photos: [...prevState.photos, ...response.hits],
//         total: response.total,
//         loading: false,
//       }));
//     } catch (error) {
//       this.setState({ error: error.message });
//       toast.error(error.message);
//     } finally {
//       this.setState({ loading: false });
//     }
//   };

//   toggleModal = photo => {
//     this.setState(prevState => {
//       const isOpened = !prevState.isOpened;
//       if (isOpened) {
//         toast.success('Loading...');
//       } else {
//         toast.success('Choose another query');
//       }
//       return {
//         isOpened,
//         currentPhotoIndex: prevState.photos.indexOf(photo),
//       };
//     });
//   };

//   render() {
//     const { photos, q, total, loading, isOpened, currentPhotoIndex } =
//       this.state;
//     const selectedPhoto = photos[currentPhotoIndex];

//     return (
//       <Wrapper>
//         <Searchbar setQuery={this.handleSetQuery} />
//         {q && (
//           <GalleryTitle>
//             Image Gallery search request: {q} and results: {total}
//           </GalleryTitle>
//         )}
//         {loading && !photos.length ? (
//           <LoaderContainer>
//             <BallTriangle
//               height={100}
//               width={100}
//               radius={5}
//               color="#4fa94d"
//               ariaLabel="ball-triangle-loading"
//               wrapperClass={{}}
//               wrapperStyle=""
//               visible={true}
//             />
//           </LoaderContainer>
//         ) : (
//           <ImageGallery
//             photos={photos}
//             handleLikes={this.handleLikes}
//             toggleModal={this.toggleModal}
//           />
//         )}

//         {total > photos.length ? (
//           <Button loading={loading} onClick={this.handleLoadMore}>
//             {!loading ? 'Loading...' : 'Load more'}
//           </Button>
//         ) : null}

//         {isOpened && selectedPhoto ? (
//           <Modal close={this.toggleModal} selectedPhoto={selectedPhoto} />
//         ) : null}
//       </Wrapper>
//     );
//   }
// }
