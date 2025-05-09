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
// import { categories } from '../../Component/Categories/CategoriesState/categories';
import classNames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';

export const ProductPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const loading = useSelector((state: RootState) => state.products.loading);
  const categories = useSelector((state: RootState) => state.categories.categories);
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
  const nameCategoryParam = queryParams.get('nameCategory');
  const nameCategory = nameCategoryParam
    ? nameCategoryParam.replace(/_/g, ' ')
    : null;
  const searchParams = queryParams.get('search');
  const sectionRef = useRef<HTMLDivElement>(null); // створення рефу для секції "For you"

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * 12;
    const lastPageIndex = firstPageIndex + 12;

    return visibleProducts.slice(firstPageIndex, lastPageIndex);
  }, [count, currentPage, visibleProducts]);

  const staticCategoryObj = [
    { id: 1, name: 'Gadgets' },
    { id: 2, name: 'Jewerly' },
    { id: 3, name: 'Art and Antiques' },
    { id: 4, name: 'Books' },
    { id: 5, name: 'Records' },
    { id: 6, name: 'Sports Equipment' },
    { id: 7, name: 'Personal transport' },
    { id: 8, name: 'Clocks' },
    { id: 9, name: 'Collectibles' },
    { id: 10, name: 'Clothing and Footwear' },
    { id: 11, name: 'Household' },
    { id: 12, name: 'Other' },
  ];

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
            return Number(a.initial_price) - Number(b.initial_price);
          case 'expensive':
            return Number(b.initial_price) - Number(a.initial_price);
          case 'newest':
            return new Date(b.close_time).getTime() - new Date(a.close_time).getTime();
          case 'oldest':
            return new Date(a.close_time).getTime() - new Date(b.close_time).getTime();
          default:
            return a.id - b.id;
        }
      });
    }

    if (priceFilters.openingPrice && +priceFilters.openingPrice > 0) {
      filteredProducts = filteredProducts.filter(
        product => +product.initial_price >= +priceFilters.openingPrice
      );
    }

    if (priceFilters.buyFullPrice && +priceFilters.buyFullPrice > 0) {
      filteredProducts = filteredProducts.filter(
        product => +product.buyout_price <= +priceFilters.buyFullPrice
      );
    }

    if (priceFilters.step && +priceFilters.step > 0) {
      filteredProducts = filteredProducts.filter(
        product => +product.min_step >= +priceFilters.step,

      );
    }

    // if (statusState !== 'all') {
    //   filteredProducts = filteredProducts.filter(product => product.state === statusState);
    // }

    if (searchQuery) {
      // console.log(searchQuery)
      filteredProducts = filteredProducts.filter(product =>
        product.item_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (nameCategory) {
      filteredProducts = filteredProducts.filter(product => {
        const categoriId = staticCategoryObj.find(category => category.name.toLowerCase() === nameCategory.toLowerCase());
        if (categoriId) {
          console.log(product, categoriId.id);
        }
        return product.category_id === categoriId?.id;
      });
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
    // console.log(filters.price.openingPrice)
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.price.openingPrice) params.set('openingPrice', filters.price.openingPrice);
    if (filters.price.buyFullPrice) params.set('buyFullPrice', filters.price.buyFullPrice);
    if (filters.price.step) params.set('step', filters.price.step);
    if (filters.states) params.set('status', filters.states);

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(location.search);
    params.set('search', query);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, 300);


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const categoryObj = useMemo(() => {
    if (!nameCategory || !categories.length) return null;
    return categories.find(
      (category) => category.name.toLowerCase() === nameCategory.toLowerCase()
    );
  }, [nameCategory, categories]);

  return (
    <div className={styles.productPage}>
      {categoryObj && (
        <CategoriesBaner
          categoryName={categoryObj.name}
          categoryImage={categoryObj.image}
        />
      )}
      <div className={classNames(styles.blockSearch, { [styles.withBanner]: categoryObj })}>
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
            <CardList
              products={currentTableData.map(product => ({
                ...product,
                images: product.images.map(image => image.url) // assuming Image has a url property
              }))}
              name={"You may like"}
              itemsPerPage={products.length}
            />
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