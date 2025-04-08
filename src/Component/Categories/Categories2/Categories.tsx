import { AppDispatch, RootState } from "Store/Store";
import styles from './Categories.module.scss'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../../../Reducer/categoriesSlice";

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      dispatch(fetchCategories());
    }, [dispatch]);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const categoriesArray = categories.slice(0, 3);
// console.log(categories)
  const handleCategoryClick = (categoryName: string) => {
    const encodedName = encodeURIComponent(categoryName.replace(/ /g, '_'));
    
    // Навігація на сторінку продуктів з параметром
    navigate(`/product?nameCategory=${encodedName}`);
    // Отримуємо поточний хеш (фрагмент після #)
    // const hash = window.location.hash.split('?')[0]; // Видаляємо старі query параметри
    // console.log(hash)
    // // Формуємо новий URL з query параметром
    // window.location.hash = `${hash}?nameCategory=${name}`;
  };

  
  const handleSeeAllCategory = () => {
    navigate('/allCategories')
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
                    <h3 className={styles.categoryNameTitle}>{category.name.split('_').join(' & ')}</h3>
                  </div>
                </>
              ) : (
                <div className={styles.transparentCard}></div>
              )}
            </div>
          ))}
          <div className={styles.categoryItem} onClick={() => handleSeeAllCategory()}>
            <div className={styles.seeMoreCard}>
              <img src="/img/PhotoCategories/SeeMoreNew.png" alt="" />
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