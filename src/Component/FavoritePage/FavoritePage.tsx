import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { CardList } from '../CardList';
import { BackToTop } from '../BackToTop/BackToTop';
import { useNavigate } from 'react-router-dom';
import styles from './FavoritePage.module.scss';

export const FavoritePage: React.FC = () => {
  const favoriteItems = useSelector((state: RootState) => state.favorite.items);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/Home');
  };

  return (
    <div className={styles.favoritePage}>
      {favoriteItems.length > 0 ? (
        <CardList
          products={favoriteItems.map(item => ({
            ...item,
            images: item.images.map(image => image.url),
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
