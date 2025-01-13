import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { Product } from '../../type/Product';
import styles from './Search.module.scss';

export const Search: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const products = useSelector((state: RootState) => state.products.items);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
    } else {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filteredProducts);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputContainer}>
        <img src="/img/icons/search_icon.svg" alt="Search Icon" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
      <div className={`${styles.resultsContainer} ${results.length > 0 ? styles.hasResults : ''}`}>
        {results.map(product => (
          <div key={product.id} className={styles.resultItem}>
            <img src={product.images[0]} alt={product.name} className={styles.resultImage} />
            <div className={styles.resultDetails}>
              <h3 className={styles.resultName}>{product.name}</h3>
              <p className={styles.resultPrice}>${product.currentPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
