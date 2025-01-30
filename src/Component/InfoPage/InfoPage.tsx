import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from 'Store/Store';
import { fetchProducts } from '../../Reducer/ProductsSlice';
import styles from './InfoPage.module.scss';
import { Product } from '../../type/Product';
import { userService } from '../../Service/userService';
import { User } from 'type/User';

export const InfoPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { itemId } = useParams();
  const products = useSelector((state: RootState) => state.products.items);
  const [product, setProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [userDetails, setUserDetails] = useState<User[]>([]);  // Масив для зберігання користувачів
  const [threeBits, setThreeBits] = useState<{ userId: number; amount: number; time: string; }[] | null>(null);
  const [selerInfo, setSelerInfo] = useState<User | null>(null);  // Додано для зберігання інформації про продавця

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (itemId && products.length) {
      const selectedProduct = products.find(product => +product.id === +itemId);
      setProduct(selectedProduct ?? null);
    }
  }, [itemId, products]);

  useEffect(() => {
    if (product) {
      const lastThreeBids = product.bids.slice(-3).reverse();
      setThreeBits(lastThreeBids);
    }
  }, [product]);

  useEffect(() => {
    if (threeBits && threeBits.length > 0) {
      const fetchUsers = async () => {
        const usersData: User[] = [];
        for (const bid of threeBits) {
          if (!userDetails.some(user => user.id === bid.userId)) {  // Перевірка на наявність користувача
            try {
              const user = await userService.getUserById(bid.userId);
              if (user) usersData.push(user);  // Додаємо нових користувачів до масиву
            } catch (error) {
              console.error(error);
            }
          }
        }
        if (usersData.length > 0) {
          setUserDetails((prev) => [...prev, ...usersData]);  // Оновлюємо список користувачів
        }
      };
      fetchUsers();
    }
  }, [threeBits]);

  useEffect(() => {
    if (product?.seller.id) {
      const fetchSeller = async () => {
        try {
          const seller = await userService.getUserById(product.seller.id);
          setSelerInfo(seller);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSeller();
    }
  }, [product]);

  const calculateTimeLeft = () => {
    if (!product) return "Auction Ended";

    const endTime = new Date(product.endTime).getTime();
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) return "Auction Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (product) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [product]);

  const lastThreeBids = useMemo(() => product ? product.bids.slice(-3).reverse() : [], [product]);

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
          <img src={product.images[currentImageIndex]} alt={product.name} />
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
        <h2 className={styles.name}>{product.name}</h2>
        <div className={styles.descript}>{product.description}</div>
        <div className={styles.priceBlock}>
          <div className={styles.openingPrice}>
            <p>Opening price:</p>
            <div>{`$ ${product.startPrice}`}</div>
          </div>
          <div className={styles.fullPrice}>
            <p>Full price:</p>
            <div>{`$ ${product.fullPrice}`}</div>
          </div>
          <div className={styles.step}>
            <p>Step:</p>
            <div>{`$ ${product.bet}`}</div>
          </div>
          <div className={styles.timer}>
            <p>Ends time:</p>
            <div>{timeLeft}</div>
          </div>
        </div>
        <h3 className={styles.nameCategory}>Contacts</h3>
        <div className={styles.contactBlock}>
          <div className={styles.contactIcons}>
              <img src="/img/icons/Phone.svg" alt="Phone Icon" />
              <div className={styles.contactNumber}>{selerInfo?.phone}</div>
          </div>
          <div className={styles.messengers}>
            <a href={selerInfo?.telegram} target="_blank" rel="noopener noreferrer">
              <img src="/img/icons/Telegram.svg" alt="Telegram" />
            </a>
          </div>
        </div>
        <div className={styles.bids}>
          <h3>Last Bids</h3>
          {lastThreeBids.length ? (
            lastThreeBids.map((bid, index) => {
              const user = userDetails.find(user => user.id === bid.userId);  // Знаходимо користувача за ID
              return (
                <div key={index} className={styles.bid}>
                  <img src={user?.avatar} alt="User" className={styles.bidUserImage} />
                  <div className={styles.bidDetails}>
                    <div className={styles.bidUserName}>
                      {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}  {/* Виводимо ім'я користувача */}
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
