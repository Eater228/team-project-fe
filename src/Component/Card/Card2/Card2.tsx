import React, { useEffect, useState } from "react";
import { ListProduct } from "type/ListProduct";
import styles from './Card2.module.scss';
import { NavLink, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "Store/Store";
import { fetchFavorites, toggleFavorite  } from "../../../Reducer/favoriteSlice";

interface Props {
  product: ListProduct;
}

export const Card2: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const products = useSelector((state: RootState) => state.products.items);
  const favorite = useSelector((state: RootState) => state.favorite.items);
  const isLoggedIn = useSelector((state: RootState) => state.userData.isLoggedIn);

  const [timeLeft, setTimeLeft] = useState<string>("");
  
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    // Оновлення тільки раз у 15 хвилин
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [product.close_time]); // Запускається тільки раз

  const calculateTimeLeft = () => {
    const endTime = new Date(product.close_time).getTime();
    const now = new Date().getTime();
    const diff = endTime - now;

    if (diff <= 0) return "Auction Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
  };

  const handerSortername = (name: string) => {
    if (name.length <= 15) return name;
    
    const sorter = name.slice(0, 15);
    return `${sorter}...`;
  }

  const HandlerAddFavorite = async () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
    console.log('product:', product.id);
    try {
      await dispatch(toggleFavorite(product.id)).unwrap();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const inFavorite = () => favorite.some(fav => fav.id === product.id);
// console.log('inFavorite:', favorite.map(fav => fav.id));
  return (
    <div className={styles.container}>
      <NavLink to={`/info/${product.id}`} className={styles.image}>
        <img className={styles.normaliz} src={`${product.images[0]}`} alt="#" />
      </NavLink>
      <div className={styles.full}>
        <div className={styles.nameSection}>
          <div className={styles.nameContainer}>
            <div className={styles.name}>{handerSortername(product.item_name)}</div>
            <button
              className={classNames([styles.button], {
                [styles.isUnadd]: !inFavorite(),
                [styles.isAdd]: inFavorite(),
              })}
              onClick={HandlerAddFavorite}
            >
              <img
                src={inFavorite() ? "/img/icons/Star_Field.svg" : "/img/icons/Star_Empty.svg"}
                alt="Favorite"
              />
            </button>
          </div>
          <div className={styles.priceContainer}>
            <div className={styles.description}>Opening price:</div>
            <div>{`$${product.initial_price}`}</div>
          </div>
          <div className={styles.timeContainer}>
            <div>Over:</div>
            <div>{timeLeft}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
