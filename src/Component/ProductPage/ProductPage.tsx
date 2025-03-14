import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/Store';
import { fetchProducts } from '../../Reducer/ProductsSlice';
import { Categories } from '../Categories/Categories2/Categories';
import { Search } from '../../Component/Search/Search';
import { CardList } from '../../Component/CardList';
import { Pagination } from '../../Component/Pagination';
import { topScroll } from '../../Function/ScrolTop/topScrol';
import { Filter } from './Filter/Filter';
import styles from './ProductPage.module.scss';
import { Loader } from '../../Component/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { CategoriesBaner } from '../../Component/Categories/CategoriesBaner/CategoriesBaner';
import { categories } from '../../Component/Categories/CategoriesState/categories';
import classNames from 'classnames';

export const ProductPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const loading = useSelector((state: RootState) => state.products.loading);
  const error = useSelector((state: RootState) => state.products.error);
  const location = useLocation();
  const navigate = useNavigate();

  const [count, setCount] = useState(12);
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [sortType, setSortType] = useState<string>('newest');
  const [statusState, setStatusState] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFilters, setPriceFilters] = useState({ openingPrice: '', buyFullPrice: '', step: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const nameCategory = queryParams.get('nameCategory');
  const searchParams = queryParams.get('search');
  const sectionRef = useRef<HTMLDivElement>(null); // створення рефу для секції "For you"

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * 12;
    const lastPageIndex = firstPageIndex + 12;

    return visibleProducts.slice(firstPageIndex, lastPageIndex);
  }, [count, currentPage, visibleProducts]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams) {
      setSearchQuery(searchParams);
    }
  }, [searchParams]);

  useEffect(() => {
    const sort = queryParams.get('sort') || 'newest';
    const openingPrice = queryParams.get('openingPrice') || '';
    const buyFullPrice = queryParams.get('buyFullPrice') || '';
    const step = queryParams.get('step') || '';
    const status = queryParams.get('status') || 'all';

    setSortType(sort);
    setPriceFilters({ openingPrice, buyFullPrice, step });
    setStatusState(status);
  }, [location.search]);

  // console.log(sortType, priceFilters, statusState)

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

    if (+priceFilters.openingPrice > 0) {
      filteredProducts = filteredProducts.filter(product => product.startPrice >= +priceFilters.openingPrice);
    }

    if (+priceFilters.buyFullPrice > 0) {
      filteredProducts = filteredProducts.filter(product => product.fullPrice <= +priceFilters.buyFullPrice);
    }

    if (+priceFilters.step > 0) {
      filteredProducts = filteredProducts.filter(product => product.bet >= +priceFilters.step);
    }

    if (statusState !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.state === statusState);
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (nameCategory) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLocaleLowerCase() === nameCategory.toLocaleLowerCase()
      );
    }

    setCurrentPage(1);
    setVisibleProducts(filteredProducts);
  }, [products, sortType, priceFilters, statusState, searchQuery]);

  useEffect(() => {
    if (searchQuery && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchQuery]);

  useEffect(() => {
    topScroll();
  }, [currentPage]);

  const handleFiltersApply = (filters: { sort: string; price: { openingPrice: string; buyFullPrice: string; step: string }; states: string }) => {
    const params = new URLSearchParams(location.search);
  console.log(filters.price.openingPrice)
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.price.openingPrice) params.set('openingPrice', filters.price.openingPrice);
    if (filters.price.buyFullPrice) params.set('buyFullPrice', filters.price.buyFullPrice);
    if (filters.price.step) params.set('step', filters.price.step);
    if (filters.states) params.set('status', filters.states);
  
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(location.search);
    
    params.set('search', query); // Додаємо або оновлюємо параметр пошуку
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const categoryObj = categories.find((category) => category.name === nameCategory);

  return (
    <div className={styles.productPage}>
      {(nameCategory && categoryObj) ? (<CategoriesBaner categoryName={nameCategory.split('_').join(' & ')} categoryImage={categoryObj.image}/>) : (<></>)}
      <div className={classNames(styles.blockSearch, { [styles.withBanner]: nameCategory && categoryObj })}>
        <Search onSearch={handleSearch} />
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
      {(nameCategory && categoryObj) ? (<></>) : (<Categories />)}
      <div className={styles.productList} ref={sectionRef}>
        {loading && <Loader />}
        {/* {error && <p>{error}</p>} */}
        {visibleProducts.length !== 0 && (
          <>
            <CardList products={currentTableData} name={"Test"} itemsPerPage={products.length} />
            {/* <CardList products={currentTableData} name={"For you"} itemsPerPage={products.length} /> */}
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
      <div className={styles.bottomGap}></div>
    </div>
  );
};