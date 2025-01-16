import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";
import styles from './Categories.module.scss';
import { categories } from './CategoriesState/categories';

const categoriesArray = categories;

export const Categories: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <></>,
    prevArrow: <></>,
    afterChange: (index: number) => {
      setCurrentIndex(index);
      setDragging(false);
    },
    responsive: [
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    swipeToSlide: true,
    beforeChange: () => setDragging(true),
  };

  const sliderRef = useRef<Slider>(null);

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    // console.log(categoryName);
    navigate(`/product?nameCategory=${categoryName}`);
  };

  return (
    <div className={styles.Block}>
      <div className={styles.carouselContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Categories</h2>
        </div>
        <Slider
          {...settings}
          ref={sliderRef}
        >
          {categoriesArray.map((category, index) => (
            <div 
              key={category.id} 
              className={styles.categoryItem}
              onDoubleClick={() => handleCategoryClick(category.name)}
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
        </Slider>
      </div>
      
    </div>
  );
};
