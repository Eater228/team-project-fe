import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { CardList } from '../CardList';
import { BackToTop } from '../BackToTop/BackToTop';
import styles from './FavoritePage.module.scss';

export const FavoritePage: React.FC = () => {
  const favoriteItems = useSelector((state: RootState) => state.favorite.items);

  return (
    <div className={styles.favoritePage}>
      <h2>Favorite Items</h2>
      {favoriteItems.length > 0 ? (
        <CardList products={favoriteItems} name="Favorites" itemsPerPage={12} />
      ) : (
        <p>No favorite items found.</p>
      )}
      <BackToTop />
    </div>
  );
};
