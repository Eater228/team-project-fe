import React, { useState, useEffect } from 'react';
import styles from './Search.module.scss';

interface SearchProps {
  onSearch: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('query', query);
    window.history.pushState({}, '', url.toString());
  }, [query]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(query);
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
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};
