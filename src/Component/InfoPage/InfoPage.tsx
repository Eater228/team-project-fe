import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import styles from './InfoPage.module.scss';
import { Product } from '../../type/Product';
import { User } from 'type/User';
import { userService } from '../../Service/userService';

export const InfoPage: React.FC = () => {
  const { itemId } = useParams();  // Отримуємо ID лоту з URL
  const [product, setProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [userDetails, setUserDetails] = useState<User[]>([]);
  const [selerInfo, setSelerInfo] = useState<User | null>(null);

  useEffect(() => {
    if (itemId) {
      // Отримуємо дані лоту з бекенду за допомогою axios
      userService.getLotById(itemId)
        .then((response: AxiosResponse) => {
          console.log(response); // Логуємо data
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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.infoPage}>
      <div className={styles.imageBlock}>
        <div className={styles.image}>
          <img src={product.images[currentImageIndex]} alt={product.item_name} />
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
        <h2 className={styles.name}>{product.item_name}</h2>
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
          <div className={styles.categoryName}>{product.category_id}</div>
        </div>
        <h3 className={styles.contacts}>Contacts</h3>
        <div className={styles.contactBlock}>
          <div className={styles.contactIcons}>
            <img src="/img/icons/Phone.svg" alt="Phone Icon" />
            <div className={styles.contactNumber}>{selerInfo?.phone}</div>
          </div>
          <div className={styles.messengers}>
            <a href={selerInfo?.telegram} target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/Viber.svg" alt="Telegram" />
            </a>
            <a href={selerInfo?.telegram} target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/Telegram.svg" alt="Telegram" />
            </a>
            <a href={selerInfo?.telegram} target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/Facebook.svg" alt="Telegram" />
            </a>
            <a href={selerInfo?.telegram} target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/Instagram.svg" alt="Telegram" />
            </a>
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
