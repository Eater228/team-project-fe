import React from 'react';
import styles from './CategoriesBaner.module.scss';

interface CategoriesBanerProps {
  categoryName: string;
  categoryImage: string;
}

export const CategoriesBaner: React.FC<CategoriesBanerProps> = ({ categoryName, categoryImage }) => {
  return (
    <div className={styles.banner}>
      <div className={styles.banerTitleBlock}>
        <h2 className={styles.bannerTitle}>{categoryName}</h2>
      </div>
      <img src={`http://localhost:8000${categoryImage}`} alt={categoryName} className={styles.bannerImage} />
    </div>
  );
};
