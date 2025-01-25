import { categories } from "../CategoriesState/categories";
import styles from './Categories.module.scss'
import { useNavigate } from 'react-router-dom';

const categoriesArray = categories.slice(0, 3);

export const Categories: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/product?nameCategory=${categoryName}`);
  };

  const handleSeeAllCategory = () => {
    navigate('/allCatagory')
  }

  return (
    <div className={styles.Block}>
      <div className={styles.carouselContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Categories</h2>
        </div>
        <div className={styles.blockCard}>
          {categoriesArray.map((category, index) => (
            <div
              key={category.id}
              className={styles.categoryItem}
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.image ? (
                <>
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`${styles.categoryImage} 
                            ${index === 0 ? styles.firstImage : ''} 
                            ${index === categories.length - 2
                        ? styles.lastImage :
                        ''}`
                    }
                  />
                  <div className={`${styles.categoryName} 
                          ${index === 0 ? styles.firstName : ''} 
                          ${index === categories.length - 2 ? styles.lastName : ''}`}>
                    <h3 className={styles.categoryNameTitle}>{category.name}</h3>
                  </div>
                </>
              ) : (
                <div className={styles.transparentCard}></div>
              )}
            </div>
          ))}
          <div className={styles.categoryItem} onClick={() => handleSeeAllCategory()}>
            <div className={styles.seeMoreCard}>
              <img src="/img/PhotoCategories/SeeMore.png" alt="" />
            </div>
            <div className={`${styles.categoryName}`}>
              <h3 className={styles.categoryNameTitle}>See More</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}