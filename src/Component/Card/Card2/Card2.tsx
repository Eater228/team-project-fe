import React, { useEffect, useState } from "react";
import { Product } from "type/Product";
import styles from './Card2.module.scss';
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "Store/Store";
import { addToFavorite, removeFromFavorite } from "../../../Reducer/favoriteSlice";

interface Props {
  product: Product;
}

export const Card2: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const favorite = useSelector((state: RootState) => state.favorite.items);

  const [timeLeft, setTimeLeft] = useState<string>("");

  const calculateTimeLeft = () => {
    const endTime = new Date(product.endTime).getTime();
    const now = new Date().getTime();
    const diff = endTime - now;

    if (diff <= 0) {
      return "Auction Ended";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval); // Очищення інтервалу
  }, [product.endTime]);

  const HandlerAddFavorite = () => {
    const inFavoriteIndex = favorite.findIndex(fav => fav.id === product.id);

    if (inFavoriteIndex !== -1) {
      dispatch(removeFromFavorite(product.id));
    } else {
      const productToAdd = products.find(prod => prod.id === product.id);

      if (productToAdd) {
        dispatch(addToFavorite(productToAdd));
      }
    }
  };

  const inFavorite = () => {
    return favorite.some(fav => fav.id === product.id);
  };

  return (
    <div className={styles.container}>
      <NavLink
        to={`/info/${product.category}/${product.itemId}`}
        className={styles.image}
      >
        <img className={styles.normaliz} src={`${product.images[0]}`} alt="#" />
      </NavLink>
      <div className={styles.full}>
        <div className={styles.nameSection}>
          <div className={styles.nameContainer}>
            <div className={styles.name}>{product.name}</div>
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
              <div>{`$${product.currentPrice}`}</div>
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
