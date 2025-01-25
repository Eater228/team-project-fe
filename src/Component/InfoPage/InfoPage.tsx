// InfoPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from 'Store/Store';
import { fetchProducts, addComment } from '../../Reducer/ProductsSlice';
import styles from './InfoPage.module.scss';
import { Product } from 'type/Product';

export const InfoPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { itemId } = useParams();
  const products = useSelector((state: RootState) => state.products.items);
  const [product, setProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!itemId || products.length === 0) return;

    const selectedProduct = products.find(
      (product) => +product.id === +itemId
    );

    setProduct(selectedProduct ?? null);
  }, [itemId, products]);

  const calculateTimeLeft = () => {
    if (!product) return "Auction Ended";

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
    if (product) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(interval); // Очищення інтервалу
    }
  }, [product]);

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

  const handleAddComment = () => {
    if (product && comment.trim()) {
      const newComment = {
        userId: 123, // Поставте тут ідентифікатор користувача (може бути динамічним)
        text: comment,
        time: new Date().toISOString(), // Задайте поточний час
      };

      dispatch(addComment({ productId: product.id, comment: newComment }));
      setComment("");
    }
  };


  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.infoPage}>
      <div className={styles.imageBlock}>
        <div className={styles.image}>
          <img src={product.images[currentImageIndex]} alt="" />
        </div>
        <div className={styles.imageControls}>
          <button onClick={handlePrevImage}>
            <img src="/img/icons/Arrow_Left.svg" alt="" />
          </button>
          <button onClick={handleNextImage}>
            <img src="/img/icons/Arrow_Right.svg" alt="" />
          </button>
        </div>
        <div className={styles.imageButtonBlock}>
          <div className={styles.buttonBuy}>Buy now</div>
          <div className={styles.makeBet}>Make Bit</div>
        </div>
      </div>
      <div className={styles.descriptionBlock}>
        <div className={styles.name}>
          <h2>
            {product.name}
          </h2>
        </div>
        <div className={styles.descript}>{product.description}</div>
        <div className={styles.priceBlock}>
          <div className={styles.openingPrice}>
            <p>Opening price:</p>
            <div>
              {`$ ${product.startPrice}`}
            </div>
          </div>
          <div className={styles.fullPrice}>
            <p>Full price:</p>
            <div>
              {`$ ${product.fullPrice}`}

            </div>
          </div>
          <div className={styles.step}>
            <p>Step:</p>
            <div>
              {`$ ${product.bet}`}

            </div>
          </div>
          <div className={styles.timer}>
            <p>Ends time:</p>
            <div>
              {timeLeft}
            </div>
          </div>
        </div>
        <div className={styles.nameCategory}>
          <h3>Contacts</h3>
        </div>
        <div className={styles.contactBlock}>
          <div className={styles.contactIcons}>
            <img src="/img/icons/Phone.svg" alt="phoneIcon" />
            <div className={styles.contactNumber}>+380687353854</div>
          </div>
          <div className={styles.messengers}>
            <img src="/img/icons/Apple.png" alt="icon" />
            <img src="/img/icons/Google.png" alt="icon" />
            <img src="/img/icons/Instagram.svg" alt="icon" />
          </div>
        </div>
        <div className={styles.comments}>
          <h3>Comments</h3>
          <div className={styles.commentInput}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button onClick={handleAddComment}>Submit</button>
          </div>
          <div className={styles.commentList}>
            {product.comments?.map((comment, index) => (
              <div key={index} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <strong>User ID:</strong> {comment.userId}
                </div>
                <div className={styles.commentText}>
                  <strong>Comment:</strong> {comment.text}
                </div>
                <div className={styles.commentTime}>
                  <strong>Time:</strong> {new Date(comment.time).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

