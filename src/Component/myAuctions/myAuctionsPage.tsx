import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Store/Store';
import { Pagination } from '../Pagination/Pagination'; // Assuming you have a Pagination component
import styles from './myAuctionsPage.module.scss';
import { AuctionList } from './AuctionsList/AuctionList';
import { userService } from '../../Service/userService';

export const MyAuctionsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [products, setProducts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserProducts = async () => {
      const response = await userService.getProducts();
      setProducts(response);
    };
    fetchUserProducts();
  }, []);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * 2;
    const lastPageIndex = firstPageIndex + 2;

    return products.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, products]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Auctions</h2>
      <div className={styles.auctions}>
        {products.length !== 0 && (
          <>
            <AuctionList auctions={currentTableData} />
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={products.length}
              pageSize={2}
              onPageChange={page => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};