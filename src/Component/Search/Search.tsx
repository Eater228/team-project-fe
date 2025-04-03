import React, { useState } from 'react';
import styles from './Search.module.scss';

interface SearchProps {
  onSearch: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>(''); // Видалено ініціалізацію з URL

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmedQuery = query.trim();
      
      // Оновлюємо URL тільки при натисканні Enter
      if (trimmedQuery) {
        window.location.hash = `#/product?search=${encodeURIComponent(trimmedQuery)}`;
      }
      
      onSearch(trimmedQuery);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputContainer}>
        <img src="/img/icons/search_icon.svg" alt="Search Icon" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};