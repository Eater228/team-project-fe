import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/Store';
import { CardList } from '../CardList';
import { BackToTop } from '../BackToTop/BackToTop';
import { useNavigate } from 'react-router-dom';
import styles from './FavoritePage.module.scss';
import { useDispatch } from 'react-redux';
import { fetchFavorites } from '../../Reducer/favoriteSlice';

export const FavoritePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.favorite);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleBackToHome = () => {
    navigate('/Home');
  };
console.log('favoriteItems:', items);
  return (
    <div className={styles.favoritePage}>
      {items.length > 0 ? (
        <CardList
          products={items.map(item => ({
            ...item,
            images: item.images.map(image => image.image),
          }))}
          name="Favorites"
          itemsPerPage={12}
        />
      ) : (
        <div className={styles.noItemsMessage}>
          <div className={styles.textBlock}>
            <h2>We didn’t find anything.</h2>
            <p>Save auctions you like and they will appear here.</p>
            <button className={styles.backToHomeButton} onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>
          <div className={styles.imgBlock}>
            <img src="/img/icons/HummerForSaved.png" alt="Hummer" />
          </div>
        </div>
      )}
      <BackToTop />
    </div>
  );
};
