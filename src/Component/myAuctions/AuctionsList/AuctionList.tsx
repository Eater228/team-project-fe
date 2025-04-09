import React, { useEffect, useState } from 'react';
import { Product } from '../../../type/Product';
import styles from './AuctionList.module.scss';
import { userService } from '../../../Service/userService';

type AuctionListProps = {
  auctions: Product[];
};

const formatDateFor = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}.${month}.${day}`;
  } catch {
    return 'N/A';
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleString('en-US', { 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    });
  } catch {
    return 'N/A';
  }
};

const useSellerInfo = (sellerId: number) => {
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        if (sellerId) {
          const data = await userService.getUserProfile(sellerId);
          if (isMounted) {
            setSeller(data);
            setLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load seller info');
          setLoading(false);
        }
        console.error('Error fetching seller:', err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [sellerId]);

  return { seller, loading, error };
};

export const AuctionList: React.FC<AuctionListProps> = ({ auctions }) => {
  console.log('auctions:', auctions);
  return (
    <div className={styles.auctionList}>
      {auctions.map(auction => {
        const { seller, loading, error } = useSellerInfo(auction.owner_id);
        
        // Обробка станів завантаження
        if (loading) return <div>Loading seller info...</div>;
        if (error) return <div>{error}</div>;

        const contacts = {
          phone: seller?.phone_number || 'Not provided',
          telegram: seller?.telegram || 'Not provided',
          instagram: seller?.instagram || 'Not provided',
          viber: seller?.viber || 'Not provided'
        };

        return (
          <div className={styles.auctionItem} key={auction.id}>
            <div className={styles.images}>
              {(auction.images?.length > 0 
                ? auction.images.slice(0, 5) 
                : ["/img/icons/NonPhoto.jpg"]
              ).map((image, index) => (
                <img 
                  src={image} 
                  alt={`Auction preview ${index + 1}`} 
                  key={`${auction.id}-${index}`} 
                  className={styles.image}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/img/icons/NonPhoto.jpg";
                  }}
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
                  <div className={styles.value}>{formatDate(auction.close_time)}</div>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <img src="/img/icons/Phone.svg" alt="Phone" />
                  <span>{contacts.phone}</span>
                </div>
                
                <div className={styles.contactIcons}>
                  <div className={styles.contactItem}>
                    <img src="/img/icons/Telegram.svg" alt="Telegram" />
                    <span>{contacts.telegram}</span>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <img src="/img/icons/Instagram.svg" alt="Instagram" />
                    <span>{contacts.instagram}</span>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <img src="/img/icons/Viber.svg" alt="Viber" />
                    <span>{contacts.viber}</span>
                  </div>
                </div>
              </div>

              <div className={styles.buttons}>
                <button className={styles.button}>Bid Now</button>
                <button className={styles.button}>Buy Now</button>
              </div>
            </div>
          </div>
        )}
      )}
    </div>
  );
};