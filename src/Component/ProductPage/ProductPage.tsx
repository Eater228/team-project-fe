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
  const [sortType, setSortType] = useState<string>('newest');
  const [statusState, setStatusState] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFilters, setPriceFilters] = useState({ openingPrice: 0, buyFullPrice: 0, step: 0 });

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * 12;
    const lastPageIndex = firstPageIndex + 12;

    return visibleProducts.slice(firstPageIndex, lastPageIndex);
  }, [count, currentPage, visibleProducts]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    let filteredProducts = [...products];

    if (sortType) {
      filteredProducts = filteredProducts.sort((a, b) => {
        switch (sortType) {
          case 'cheapest':
            return a.currentPrice - b.currentPrice;
          case 'expensive':
            return b.currentPrice - a.currentPrice;
          case 'newest':
            return new Date(b.startingTime).getFullYear() - new Date(a.startingTime).getFullYear();
          case 'oldest':
            return new Date(a.startingTime).getFullYear() - new Date(b.startingTime).getFullYear();
          default:
            return a.id - b.id;
        }
      });
    }

    if (priceFilters.openingPrice > 0) {
      filteredProducts = filteredProducts.filter(product => product.startPrice >= priceFilters.openingPrice);
    }

    if (priceFilters.buyFullPrice > 0) {
      filteredProducts = filteredProducts.filter(product => product.fullPrice <= priceFilters.buyFullPrice);
    }

    if (priceFilters.step > 0) {
      filteredProducts = filteredProducts.filter(product => product.bet >= priceFilters.step);
    }

    if(statusState !== '') {
      switch (statusState) {
        case 'active':
          filteredProducts = filteredProducts.filter(
            product => 
              product.status === 'active'
          )
          break;
          case 'sold':
          filteredProducts = filteredProducts.filter(
            product => 
              product.status === 'sold'
          )
          break;
      
        default:
          break;
      }
    }
console.log(filteredProducts);
    setCurrentPage(1);
    setVisibleProducts(filteredProducts);
  }, [products, sortType, priceFilters, statusState]);

  useEffect(() => {
    topScroll();
  }, [currentPage]);

  const handleFiltersApply = (filters: { sort: string; price: { openingPrice: number, buyFullPrice: number, step: number }; states: string }) => {
    setSortType(filters.sort);
    setPriceFilters(filters.price);
    setStatusState(filters.states);
    console.log(filters.states)
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
        {visibleProducts.length !== 0 && (
          <>
            <CardList products={currentTableData} name={"For you"} itemsPerPage={products.length} />
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={visibleProducts.length}
              pageSize={count}
              onPageChange={page => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};