import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../Store/Store';
import { fetchProducts } from '../../Reducer/ProductsSlice';
import { Pagination } from '../Pagination/Pagination'; // Assuming you have a Pagination component
import styles from './myAuctionsPage.module.scss';
import { AuctionList } from './AuctionsList/AuctionList';

export const MyAuctionsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleProducts, setVisibleProducts] = useState(products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setVisibleProducts(products);
  }, [products]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * 2;
    const lastPageIndex = firstPageIndex + 2;

    return visibleProducts.slice(firstPageIndex, lastPageIndex);
  }, [2, currentPage, visibleProducts]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Auctions</h2>
      <div className={styles.auctions}>
        {visibleProducts.length !== 0 && (
          <>
            <AuctionList auctions={currentTableData} />
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={visibleProducts.length}
              pageSize={2}
              onPageChange={page => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};