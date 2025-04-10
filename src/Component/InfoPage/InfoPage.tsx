import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import classNames from 'classnames'; // Import classNames
import styles from './InfoPage.module.scss';
import { Product } from '../../type/Product';
import { User } from 'type/User';
import { userService } from '../../Service/userService';
import { useSelector } from 'react-redux';
import { RootState } from 'Store/Store';
import { useDispatch } from 'react-redux';
import { toggleFavorite } from "../../Reducer/favoriteSlice";
import { fetchCategories } from '../../Reducer/categoriesSlice';
import { AppDispatch } from '../../Store/Store';


export const InfoPage: React.FC = () => {
  const { itemId } = useParams();  // Отримуємо ID лоту з URL
  const [product, setProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [userDetails, setUserDetails] = useState<User[]>([]);
  const [selerInfo, setSelerInfo] = useState<User>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.userData.isLoggedIn);
  const favorite = useSelector((state: RootState) => state.favorite.items);
  const categories = useSelector((state: RootState) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // categories.find(cat => console.log(cat));

  useEffect(() => {
    if (itemId) {
      // Отримуємо дані лоту з бекенду за допомогою axios
      userService.getLotById(itemId)
        .then((response: AxiosResponse) => {
          // console.log(response); // Логуємо data
          setProduct(response);  // Встановлюємо дані продукту
        })
        .catch((error) => {
          console.error("Error fetching product data", error);
        });
    }
  }, [itemId]);

  useEffect(() => {
    if (product) {
      const calculateTimeLeft = () => {
        const endTime = new Date(product.close_time).getTime();
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) return "Auction Ended";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m ${seconds}s`;
      };

      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [product]);

  useEffect(() => {
    // Окремий ефект для завантаження даних продавця
    let isMounted = true; // Прапорець для відстеження монтування

    const fetchSellerInfo = async () => {
      if (product?.owner_id) {
        try {
          const seller = await userService.getUserProfile(product.owner_id);
          if (isMounted) {
            setSelerInfo(seller);
          }
        } catch (error) {
          console.error('Failed to fetch seller info:', error);
        }
      }
    };

    fetchSellerInfo();

    return () => {
      isMounted = false; // Скасувати оновлення стану після розмонтування
    };
  }, [product?.owner_id]); // Залежність від ID власника

  // useEffect(() => {
  //   if (product?.seller.id) {
  //     axios.get(`http://localhost:8000/api/users/${product.seller.id}`)
  //       .then((response) => {
  //         setSelerInfo(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching seller data", error);
  //       });
  //   }
  // }, [product]);

  const handleNextImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    }
  };

  const HandlerAddFavorite = () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }

    if (!product) {
      return;
    }

    const inFavoriteIndex = favorite.findIndex(fav => fav.id === product.id);

    dispatch(toggleFavorite(product.id));
  };

  const inFavorite = () => {
    return product ? favorite.some(fav => fav.id === product.id) : false;
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // console.log(product.owner_id);
  const findCategoryName = () => {
    // console.log(product);
    const category = categories
      .find(cat => cat.id === product.category_id);
    return category ? category.name : 'Loading...';
  }

  const NormalizeData = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  console.log(product)

  return (
    <div className={styles.infoPage}>
      <div className={styles.imageBlock}>
        <div className={styles.image}>
          <img src={`${product.images[currentImageIndex].image}`} alt={product.item_name} />
          <button
            className={classNames([styles.starButton], {
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
        <div className={styles.imageControls}>
          <button onClick={handlePrevImage}>
            <img src="/img/icons/Arrow_Left.svg" alt="Prev" />
          </button>
          <button onClick={handleNextImage}>
            <img src="/img/icons/Arrow_Right.svg" alt="Next" />
          </button>
        </div>
        <div className={styles.imageButtonBlock}>
          <div className={styles.buttonBuy}>Buy now</div>
          <div className={styles.makeBet}>Make Bet</div>
        </div>
      </div>
      <div className={styles.descriptionBlock}>
        <div className={styles.titelBlock}>
          <h2 className={styles.name}>{product.item_name}</h2>
          <div className={styles.dataEnd}>{NormalizeData(product.close_time)}</div>
        </div>
        <div className={styles.descript}>{product.description}</div>
        <div className={styles.priceBlock}>
          <div className={styles.openingPrice}>
            <p>Opening price:</p>
            <div>{`$ ${product.initial_price}`}</div>
          </div>
          <div className={styles.fullPrice}>
            <p>Full price:</p>
            <div>{`$ ${product.buyout_price}`}</div>
          </div>
          <div className={styles.step}>
            <p>Step:</p>
            <div>{`$ ${product.min_step}`}</div>
          </div>
          <div className={styles.timer}>
            <p>Ends time:</p>
            <div>{timeLeft}</div>
          </div>
        </div>
        <div className={styles.category}>
          <h3>Category:</h3>
          <div className={styles.categoryName}>{findCategoryName()}</div>
        </div>
        <h3 className={styles.contacts}>Contacts</h3>
        <div className={styles.contactBlock}>
          <div className={styles.contactIcons}>
            {selerInfo?.phone_number && (
              <a href={`tel:${selerInfo.phone_number}`} className={styles.phoneLink}>
                <img src="/img/icons/Phone.svg" alt="Phone Icon" />
                <div className={styles.contactNumber}>{selerInfo.phone_number}</div>
              </a>
            )}
          </div>
          <div className={styles.messengers}>
            {selerInfo?.viber && (
              <a href={`viber://add?number=${selerInfo.viber}`} target="_blank" rel="noopener noreferrer">
                <img src="/img/icons/Viber.svg" alt="Viber" />
              </a>
            )}
            {selerInfo?.telegram && (
              <a href={`https://t.me/${selerInfo.telegram}`} target="_blank" rel="noopener noreferrer">
                <img src="/img/icons/Telegram.svg" alt="Telegram" />
              </a>
            )}
            {/* <a href={selerInfo?.telegram} target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/Facebook.svg" alt="Telegram" />
            </a> */}
            {selerInfo?.instagram && (
              <a href={`https://instagram.com/${selerInfo.instagram}`} target="_blank" rel="noopener noreferrer">
                <img src="/img/icons/Instagram.svg" alt="Instagram" />
              </a>
            )}
          </div>
        </div>
        <div className={styles.bids}>
          <h3>Last Bids</h3>
          {product.bids.length ? (
            product.bids.slice(-3).reverse().map((bid, index) => {
              const user = userDetails.find(user => user.id === bid.userId);
              return (
                <div key={index} className={styles.bid}>
                  <img src={user?.avatar} alt="User" className={styles.bidUserImage} />
                  <div className={styles.bidDetails}>
                    <div className={styles.bidUserName}>
                      {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                    </div>
                    <div className={styles.bidAmount}>Bided on your auction ${bid.amount}</div>
                    <div className={styles.bidTime}>{new Date(bid.time).toLocaleString()}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noBids}>No bids available</div>
          )}
        </div>
      </div>
    </div>
  );
};
