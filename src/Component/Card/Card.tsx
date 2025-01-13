import React, { useEffect, useState } from 'react';
import styles from './Card.module.scss';
import classNames from 'classnames';
import { Product } from '../../type/Product';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { NavLink } from 'react-router-dom';
import { addToFavorite, removeFromFavorite } from '../../Reducer/favoriteSlice';
import { addToCart, removeFromCart } from '../../Reducer/cartsSlice';
import { updateProductPrice } from '../../Reducer/ProductsSlice';

interface Props {
  product: Product;
}

export const Card: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const favorite = useSelector((state: RootState) => state.favorite.items);
  const carts = useSelector((state: RootState) => state.carts.items);
  const [lastBet, setLastBet] = useState<number>(0);

    const [timer, setTimer] = useState<string>("");
  
    const calculateTimeLeft = () => {
      const endTime = new Date(product.endTime).getTime();
      const now = new Date().getTime();
      const diff = endTime - now;
  
      if (diff <= 0) {
        return "Auction Ended";
      }
  
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
      return `${hours}h ${minutes}m ${seconds}s`;
    };
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTimer(calculateTimeLeft());
      }, 1000);
  
      return () => clearInterval(interval); // Очищення інтервалу
    }, [product.endTime]);

// console.log(favorite);

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

  // const HanderAddCart = () => {
  //   const inCartIndex = carts.findIndex(cart => cart.id === product.id);

  //   if (inCartIndex !== -1) {
  //     dispatch(removeFromCart(product.id));
  //   } else {
  //     const productToAdd = products.find(prod => prod.id === product.id);

  //     if (productToAdd) {
  //       dispatch(addToCart({ count: 1, ...productToAdd }));
  //     }
  //   }
  // };

  const inFavorite = () => {
    return favorite.some(fav => fav.id === product.id);
  };

  // const inCart = () => {
  //   return favorite.some(fav => fav.id === product.id);
  // };

  const handleBetClick = (multiplier: number) => {
    setLastBet(product.currentPrice);
    const newPrice = product.currentPrice + (product.bet * multiplier);
    dispatch(updateProductPrice({ productId: product.id, newPrice }));
  };

  return (
    <div className={styles.container}>
      <NavLink
        to={`/info/${product.category}/${product.itemId}`}
        className={styles.image}
      >
        <img className={styles.normaliz} src={`${product.images[0]}`} alt="#" />
      </NavLink>
      <div className="full">
        <h2 className={styles.name}>{product.name}</h2>

          <div className="timer">{timer}</div>

          <div className={styles.productPrice}>
            <h2 className={styles.priceFull}>{`$${product.currentPrice}`}</h2>
            {lastBet !== 0 ? (
              <h2 className={styles.priceDiscount}>{`$${lastBet}`}</h2>
            ) : null}
          </div>
        <div className={styles.infoContainer}>
          <div className={styles.bet} onClick={() => handleBetClick(1)}>
            {product.bet}
          </div>
          <div className={styles.bet} onClick={() => handleBetClick(2)}>
            {product.bet * 2}
          </div>
          <div className={styles.bet} onClick={() => handleBetClick(3)}>
            {product.bet * 3}
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={classNames([styles.button], {
              [styles.isUnadd]: !inFavorite(),
              [styles.isAdd]: inFavorite(),
            })}
            onClick={HandlerAddFavorite}
          >
            {!inFavorite() ? 'Add to favorite' : 'Added'}
          </button>
          {/* <button
            className={classNames(
              [styles.button],
              [styles.isFavorite],
              'fa-heart',
              {
                'fa-regular': !inFavorite(),
                [styles.whiteContor]: !inFavorite(),
                'fa-solid': inFavorite(),
                [styles.red]: inFavorite(),
              },
            )}
            onClick={HandlerAddFavorite}
          ></button> */}
        </div>
      </div>
    </div>
  );
};
