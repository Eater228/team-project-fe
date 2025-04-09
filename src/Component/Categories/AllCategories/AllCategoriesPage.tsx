import { useSelector } from 'react-redux';
import styles from './AllCategoriesPage.module.scss';
// import { categories } from '../Categories';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'Store/Store';

export const AllCategoriesPage = () => {
  const navigate = useNavigate();
  const categories = useSelector((state: RootState) => state.categories.categories);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/product?nameCategory=${categoryName}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <h2>All Categories</h2>
      </div>
      <div className={styles.gridCategoriesBlock}>
        {categories.map((category) => (
          <div
            key={category.id}
            className={styles.categoryItem}
            onClick={() => handleCategoryClick(category.name)}
          >
            <img src={category.image} alt={category.name} className={styles.categoryImage} />
            <div className={styles.categoryName}>{category.name.split('_').join(' & ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};