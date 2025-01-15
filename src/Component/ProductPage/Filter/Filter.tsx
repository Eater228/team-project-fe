import React, { useState } from 'react';
import styles from './Filter.module.scss';

interface FilterProps {
  isFilterOpen: boolean;
  toggleFilter: () => void;
  handleFiltersApply: (filters: Filters) => void;
  handleOverlayClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

interface Filters {
  sort: string;
  itemsPerPage: string;
  states: string[];
}

export const Filter: React.FC<FilterProps> = ({
  isFilterOpen,
  toggleFilter,
  handleFiltersApply,
  handleOverlayClick,
}) => {
  const [sort, setSort] = useState<string>('id');
  const [itemsPerPage, setItemsPerPage] = useState<string>('4');
  const [states, setStates] = useState<string[]>([]);

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setSort(event.target.value);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPage(event.target.value);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setStates((prevStates) =>
      checked ? [...prevStates, value] : prevStates.filter((state) => state !== value)
    );
  };

  const applyFilters = () => {
    handleFiltersApply({ sort, itemsPerPage, states });
    toggleFilter();
  };

  if (!isFilterOpen) return null;

  return (
    <div className={styles.filterOverlay} onClick={handleOverlayClick}>
      <div className={styles.filterSidebar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.viewBlock}>
          <div className={styles.filterHeader}>
            <h2>Filter</h2>
            <img src="/img/icons/Filters.svg" alt="filter" />
            <button className={styles.closeButton} onClick={toggleFilter}>
              &times;
            </button>
          </div>
          <div className={styles.filterContent}>
            {/* Sort Filter */}
            <div className={styles.filterCategory}>
              <h3>Sort by</h3>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="cheapest"
                    checked={sort === 'cheapest'}
                    onChange={handleSortChange}
                  />
                  Form the cheapest to the most expensive
                </label>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="expensive"
                    checked={sort === 'expensive'}
                    onChange={handleSortChange}
                  />
                  From the most expensive to the cheapest
                </label>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="newest"
                    checked={sort === 'newest'}
                    onChange={handleSortChange}
                  />
                  From the newest to the oldest
                </label>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="oldest"
                    checked={sort === 'oldest'}
                    onChange={handleSortChange}
                  />
                  From oldest to newest
                </label>
              </div>
            </div>
            {/* Choice onep price and step bet */}
            <div className={styles.filterCategory}>
              <div className={styles.boxGroup}>
                <label>
                  Opening price
                </label>
                <input type="number" />
              </div>
              <div className={styles.boxGroup}>
                <label>
                  Buy full price
                </label>
                <input type="number" />
              </div>
              <div className={styles.boxGroup}>
                <label>
                  Step
                </label>
                <input type="number" />
              </div>
            </div>

            {/* State Filter */}
            <div className={styles.filterCategory}>
              <h3>State</h3>
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    value="active"
                    checked={states.includes('active')}
                    onChange={handleStateChange}
                  />
                  Active
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="sold"
                    checked={states.includes('sold')}
                    onChange={handleStateChange}
                  />
                  Sold
                </label>
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className={styles.buttonContainer}>
            <button className={styles.applyButton} onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
