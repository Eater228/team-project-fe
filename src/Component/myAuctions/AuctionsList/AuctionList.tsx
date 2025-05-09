import React, { useEffect, useState, useMemo, memo } from 'react';
import { Product } from '../../../type/Product';
import styles from './AuctionList.module.scss';
import { RootState } from 'Store/Store';
import { useSelector } from 'react-redux';

type AuctionListProps = {
  auctions: Product[];
};

const formatDateFor = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return new Intl.DateTimeFormat('en-US', { 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};


const useSellerInfo = () => {
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.userData.currentUser);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const data = currentUser;
        if (isMounted) {
          setSeller(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load seller info');
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, []);

  return { seller, loading, error };
};
type AuctionItemProps = {
  auction: Product;
};

const AuctionItem = memo(({ auction }: AuctionItemProps) => {
  const { seller, loading, error } = useSellerInfo();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    setImages(
      auction.images?.length > 0 
        ? auction.images.slice(0, 5).map(image => image.url)
        : ["/img/icons/NonPhoto.jpg"]
    );
  }, [auction.images]);

  const contacts = useMemo(() => ({
    phone: seller?.phone_number || 'Not provided',
    telegram: seller?.telegram,
    instagram: seller?.instagram,
    viber: seller?.viber,
  }), [seller]);

  if (loading) return <div>Loading seller info...</div>;
  if (error) return <div>{error}</div>;

  console.log(auction)
  return (
    <div className={styles.auctionItem}>
      <div className={styles.images}>
        {images.map((image, index) => (
          <img 
            src={image} 
            alt={`Auction preview ${index + 1}`}
            key={index}
            className={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/img/icons/NonPhoto.jpg";
            }}
            loading="lazy"
          />
        ))}
      </div>
      
      <div className={styles.details}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>{auction.item_name || 'Unnamed Auction'}</h3>
          <p className={styles.date}>{formatDateFor(auction.close_time)}</p>
        </div>
        
        <p className={styles.description}>
          {auction.description || 'No description available'}
        </p>

        <div className={styles.info}>
          <div className={styles.infoRow}>
            <div className={styles.label}>Starting Price:</div>
            <div className={styles.value}>
              ${auction.initial_price?.toLocaleString() || 'N/A'}
            </div>
          </div>
          
          <div className={styles.infoRow}>
            <div className={styles.label}>Current Price:</div>
            <div className={styles.value}>
              ${auction.buyout_price?.toLocaleString() || 'N/A'}
            </div>
          </div>
          
          <div className={styles.infoRow}>
            <div className={styles.label}>Ends in:</div>
            <div className={styles.value}>{formatTime(auction.close_time)}</div>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <img src="/img/icons/Phone.svg" alt="Phone" />
            <span>{contacts.phone}</span>
          </div>
          
          <div className={styles.contactIcons}>
            {contacts.telegram && (
              <div className={styles.contactItem}>
                <img src="/img/icons/Telegram.svg" alt="Telegram" />
                <span>{contacts.telegram}</span>
              </div>
            )}
            
            {contacts.instagram && (
              <div className={styles.contactItem}>
                <img src="/img/icons/Instagram.svg" alt="Instagram" />
                <span>{contacts.instagram}</span>
              </div>
            )}
            
            {contacts.viber && (
              <div className={styles.contactItem}>
                <img src="/img/icons/Viber.svg" alt="Viber" />
                <span>{contacts.viber}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.button}>Bid Now</button>
          <button className={styles.button}>Buy Now</button>
        </div>
      </div>
    </div>
  );
});

export const AuctionList: React.FC<AuctionListProps> = ({ auctions }) => {
  return (
    <div className={styles.auctionList}>
      {auctions.map((auction, index) => (
        <AuctionItem key={index} auction={auction} />
      ))}
    </div>
  );
};
