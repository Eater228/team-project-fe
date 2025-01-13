import React, { useState } from 'react';
import { Card2 } from '../../Component/Card/Card2/Card2';
import { Product } from '../../type/Product';
import styles from './CardList.module.scss';

type Props = {
  products: Product[];
  name: string;
  itemsPerPage: number;
};

export const CardList: React.FC<Props> = ({ products, name, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>{name}</h2>
      </div>
      <div className={styles.mainPart}>
        {selectedProducts.map(product => (
          <div className={styles.center} key={product.id}>
            <Card2 product={product} />
          </div>
        ))}
      </div>
      {/* <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div> */}
    </div>
  );
};
