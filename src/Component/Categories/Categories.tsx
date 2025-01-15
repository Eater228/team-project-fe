import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";
import styles from './Categories.module.scss';

const categories = [
  { id: 1, name: 'Electronics', image: '/img/PhotoCategories/electronics.png' },
  { id: 2, name: 'Furniture', image: '/img/PhotoCategories/furniture.png' },
  { id: 3, name: 'Clothes', image: '/img/PhotoCategories/clothes.png' },
  { id: 4, name: 'Cars', image: '/img/PhotoCategories/cars.png' },
  { id: 5, name: 'Books', image: '/img/PhotoCategories/books.png' },
  { id: 6, name: 'Toys', image: '/img/PhotoCategories/toys.png' },
  { id: 7, name: 'Sports', image: '/img/PhotoCategories/sports.png' },
  { id: 8, name: 'Beauty', image: '/img/PhotoCategories/beauty.png' },
  { id: 8, name: 'See more...', image: '/img/PhotoCategories/SeeMore.svg' },
  { id: 9, name: '', image: '' }, // Add an empty card
];

export const Categories: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

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
          {categories.map((category, index) => (
            <div key={category.id} className={styles.categoryItem}>
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
