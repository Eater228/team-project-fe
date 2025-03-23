import React, { useState, useEffect } from 'react';
import styles from './Search.module.scss';

interface SearchProps {
  onSearch: (query: string) => void;
}

// Функція для отримання параметрів з хеш-частини URL
const getHashParams = () => {
  const hash = window.location.hash.substring(1); // Видаляємо #
  const [path, queryString] = hash.split('?');
  return new URLSearchParams(queryString || '');
};

export const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>(() => {
    const hashParams = getHashParams();
    return hashParams.get('search') || '';
  });

  useEffect(() => {
    // Оновлюємо хеш-частину URL
    const hashParams = getHashParams();
    if (query) {
      hashParams.set('search', query);
    } else {
      hashParams.delete('search');
    }
    
    const newHash = `#/product?${hashParams.toString()}`;
    window.history.replaceState({}, '', newHash);
  }, [query]);

  useEffect(() => {
    const handlePopState = () => {
      const hashParams = getHashParams();
      setQuery(hashParams.get('search') || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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