import { Loader } from "../Loader/Loader";
import { PicturesSlider } from "../PicturesSlider/PicturesSlider";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../Store/Store"; // Шлях до вашого Redux store
import { fetchProducts } from "../../Reducer/ProductsSlice"; // Імпорт дій Redux
import { CardsCarusel } from "../../Component/CardCarusel/CardsCarusel";
import styles from './MainPage.module.scss';
import { useNavigate } from 'react-router-dom';

import image1 from '/img/PhotoSlider/Hummer2.png'
import image2 from '/img/PhotoSlider/Helly-Hansen-Emblem.png'
import image3 from '/img/PhotoSlider/Ralph-Lauren-Emblem.png'
import { CardList } from "../../Component/CardList";
import { Search } from "../../Component/Search/Search";
import { Categories } from "../../Component/Categories/Categories2/Categories";

export const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // const sortedProducts = [...products].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const newestProducts = products.slice(0, 10).map(product => ({
    ...product,
    images: product.images.map(img => img.url)
  }));

  const handleSearch = (query: string) => {
    if (query.trim() !== '') {
      navigate(`/product?search=${query}`);
    }
  };
// console.log(products[1].images[0])
  return (
    <div className={styles.MainPage}>
      <PicturesSlider images={[image1]} />
      <div className={styles.blockSearch}>
        <Search onSearch={handleSearch} />
      </div>
      <Categories />
      {products.length !== 0 && (
        <CardList products={newestProducts} name={"New"} itemsPerPage={4}/>
      )}
      {products.length !== 0 && (
        <CardList products={newestProducts} name={"Top"} itemsPerPage={4}/>
      )}
      {products.length !== 0 && (
        <CardList products={products.map(product => ({
          ...product,
          images: product.images.map(img => img.url)
        }))} name={"For you"} itemsPerPage={12}/>
      )}
      <div className={styles.bottomGap}></div>
    </div>
  );
};
