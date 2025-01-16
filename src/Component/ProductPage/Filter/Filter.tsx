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
  price: {
    openingPrice: string;
    buyFullPrice: string;
    step: string;
  };
  states: string;
}

export const Filter: React.FC<FilterProps> = ({
  isFilterOpen,
  toggleFilter,
  handleFiltersApply,
  handleOverlayClick,
}) => {
  const [sort, setSort] = useState<string>('id');
  const [states, setStates] = useState<string>('');
  const [price, setPrice] = useState<Filters['price']>({
    openingPrice: '',
    buyFullPrice: '',
    step: ''
  });

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStates(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPrice((prevPrice) => ({
      ...prevPrice,
      [name]: +value.replace(/[^0-9]/g, ''),
    }));
  }

  const applyFilters = () => {
    handleFiltersApply({ sort, price, states });
    toggleFilter();
  };

  const resetFilters = () => {
    setSort('newest');
    setStates('');
    setPrice({ openingPrice: '', buyFullPrice: '', step: '' });
    handleFiltersApply({ sort: 'newest', price: { openingPrice: '', buyFullPrice: '', step: '' }, states: '' });
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

            <div className={styles.separator} />

            {/* Choice onep price and step bet */}
            <div className={styles.filterCategoryPrice} >
              <div className={styles.boxGroup}>
                <label>
                  Opening price
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name='openingPrice'
                    value={`$${price.openingPrice}`}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      if (input.value.replace(/[^0-9]/g, '').length > 6) {
                        input.value = `$${input.value.replace(/[^0-9]/g, '').slice(0, 6)}`;
                      }
                    }}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
              <div className={styles.boxGroup}>
                <label>
                  Buy full price
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name='buyFullPrice'
                    value={`$${price.buyFullPrice}`}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      if (input.value.replace(/[^0-9]/g, '').length > 6) {
                        input.value = `$${input.value.replace(/[^0-9]/g, '').slice(0, 6)}`;
                      }
                    }}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
              <div className={styles.boxGroup}>
                <label>
                  Step
                </label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    name='step'
                    value={`$${price.step}`}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      if (input.value.replace(/[^0-9]/g, '').length > 6) {
                        input.value = `$${input.value.replace(/[^0-9]/g, '').slice(0, 6)}`;
                      }
                    }}
                    onChange={handlePriceChange} 
                  />
                </div>
              </div>
            </div>

            <div className={styles.separator}></div>

            {/* State Filter */}
            <div className={styles.filterCategory}>
              <h3>State</h3>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="state"
                    value="active"
                    checked={states.includes('active')}
                    onChange={handleStateChange}
                  />
                  Active
                </label>
                <label>
                  <input
                    type="radio"
                    name="state"
                    value="sold"
                    checked={states.includes('sold')}
                    onChange={handleStateChange}
                  />
                  Sold
                </label>
              </div>
            </div>
          </div>

          {/* Apply Filters and Reset Filters Buttons */}
          <div className={styles.buttonContainer}>
            <button className={styles.applyButton} onClick={applyFilters}>
              Apply filters
            </button>
            <button className={styles.resetButton} onClick={resetFilters}>
              Reset all Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
