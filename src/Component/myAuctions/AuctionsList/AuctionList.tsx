import React from 'react';
import { Product } from '../../../type/Product';
import styles from './AuctionList.module.scss';

type AuctionListProps = {
  auctions: Product[];
};

const formatDateFor = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(2, 4); // Останні 2 цифри року
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Місяць
  const day = date.getDate().toString().padStart(2, '0'); // День

  return `${year}.${month}.${day}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { day: 'numeric', hour: 'numeric', minute: 'numeric' });
};

export const AuctionList: React.FC<AuctionListProps> = ({ auctions }) => {
  return (
    <div className={styles.auctionList}>
      {auctions.map(auction => (
        <div className={styles.auctionItem} key={auction.id}>
          <div className={styles.images}>
            {auction.images.slice(0, 5).map((image, index) => (
              <img src={image} alt={`Auction ${index + 1}`} key={index} className={styles.image} />
            ))}
          </div>
          <div className={styles.details}>
            <div className={styles.titleBlock}>
              <h3 className={styles.title}>{auction.name}</h3>
              <p className={styles.date}>{formatDateFor(auction.createdAt)}</p>
            </div>
            <p className={styles.description}>{auction.description}</p>
            <div className={styles.info}>
              <div className={styles.infoRow}>
                <div className={styles.label}>Starting Price:</div>
                <div className={styles.value}>${auction.startPrice}</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.label}>Current Price:</div>
                <div className={styles.value}>${auction.currentPrice}</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.label}>Ends in:</div>
                <div className={styles.value}>{formatDate(auction.endTime)}</div>
              </div>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <img src="/img/icons/Phone.svg" alt="Phone" />
                <span>{auction.seller.phone}</span>
              </div>
              <div className={styles.contactIcons}>
                <div className={styles.contactItem}>
                  <img src="/img/icons/Telegram.svg" alt="Telegram" />
                  <span>{auction.seller.telegram}</span>
                </div>
                <div className={styles.contactItem}>
                  <img src="/img/icons/Instagram.svg" alt="Instagram" />
                  <span>{auction.seller.instagram}</span>
                </div>
                <div className={styles.contactItem}>
                  <img src="/img/icons/Viber.svg" alt="Viber" />
                  <span>{auction.seller.viber}</span>
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button className={styles.button}>Bid Now</button>
              <button className={styles.button}>Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
