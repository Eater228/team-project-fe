import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/Store';
import { fetchProducts } from '../../Reducer/ProductsSlice';
import { Categories } from '../Categories/Categories';
import { Search } from '../../Component/Search/Search';
import { CardList } from '../../Component/CardList';
import { Pagination } from '../../Component/Pagination';
import { topScroll } from '../../Function/ScrolTop/topScrol';
import { Filter } from './Filter/Filter';
import styles from './ProductPage.module.scss';
import { Loader } from '../../Component/Loader';

export const ProductPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const loading = useSelector((state: RootState) => state.products.loading);
  const error = useSelector((state: RootState) => state.products.error);

  const [count, setCount] = useState(12);
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [sortType, setSortType] = useState<string>('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * count;
    const lastPageIndex = firstPageIndex + count;

    return visibleProducts.slice(firstPageIndex, lastPageIndex);
  }, [count, currentPage, visibleProducts]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => {
      switch (sortType) {
        case 'cheapest':
          return a.currentPrice - b.currentPrice;
        case 'expensive':
          return b.currentPrice - a.currentPrice;
        case 'newest':
          return new Date(b.startingTime).getFullYear() - new Date(a.startingTime).getFullYear();
        case 'oldest':
          return new Date(b.startingTime).getFullYear() - new Date(a.startingTime).getFullYear();
        default:
          return a.id - b.id;
      }
    });

    setVisibleProducts(sortedProducts);
  }, [products, sortType]);

  useEffect(() => {
    topScroll();
  }, [currentPage]);

  const handleFiltersApply = (filters: { sort: string; itemsPerPage: string; states: string[] }) => {
    setSortType(filters.sort);
    setCount(filters.itemsPerPage === 'all' ? products.length : +filters.itemsPerPage);
    // Apply state filters if needed
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.blockSearch}>
        <Search />
        <img
          src="/img/icons/Filters.svg"
          alt="Filter"
          onClick={toggleFilter}
          className={styles.filterButton}
        />
        <Filter
          isFilterOpen={isFilterOpen}
          toggleFilter={toggleFilter}
          handleFiltersApply={handleFiltersApply}
          handleOverlayClick={() => setIsFilterOpen(false)}
        />
      </div>
      <Categories />
      <div className={styles.productList}>
        {loading && <Loader />}
        {error && <p>{error}</p>}
        {products.length !== 0 && (
          <>
            <CardList products={currentTableData} name={"For you"} itemsPerPage={products.length} />
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={products.length}
              pageSize={count}
              onPageChange={page => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};