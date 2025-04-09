import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/Store'; // Додано RootState
import { Pagination } from '../Pagination/Pagination';
import styles from './myAuctionsPage.module.scss';
import { AuctionList } from './AuctionsList/AuctionList';
import { fetchMyLots } from '../../Reducer/myLotsSlice'; // Імпорт нашого Slice

export const MyAuctionsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Отримуємо дані зі стану Redux
  const { items, loading, error } = useSelector((state: RootState) => state.myLots);

  useEffect(() => {
    // Оновлюємо дані тільки якщо вони застарілі або відсутні
    if (items.length === 0) {
      dispatch(fetchMyLots());
    }
  }, [dispatch, items.length]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * 2;
    const lastPageIndex = firstPageIndex + 2;
    return items.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, items]);

  if (loading) return <div>Loading auctions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Auctions</h2>
      <div className={styles.auctions}>
        {items.length > 0 ? (
          <>
            <AuctionList auctions={currentTableData} />
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={items.length}
              pageSize={2}
              onPageChange={page => setCurrentPage(page)}
            />
          </>
        ) : (
          <p>No auctions found</p>
        )}
      </div>
    </div>
  );
};