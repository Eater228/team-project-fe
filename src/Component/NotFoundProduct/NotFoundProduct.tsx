import React from 'react';
import styles from './NotFoundProduct.module.scss'; // Створи файл стилів за потреби

export const NotFoundProducts = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h2>Products not found</h2>
      <p>We couldn't find any products matching your criteria.</p>
    </div>
  );
};
// 