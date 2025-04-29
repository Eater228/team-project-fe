import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import styles from './BidModal.module.scss';
import { userService } from '../../Service/userService';

interface BidModalProps {
  itemId?: string;
  onBidSuccess?: () => void;
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  minBidStep: number | string;
  lotPhoto: string;
  lastBid: number;
  onTopUpBalance: () => void;
  bids: { amount: number; userId: number; time: string }[];
  userDetails: { id: number; avatar: string; firstName: string; lastName: string }[];
}

const BidModal: React.FC<BidModalProps> = ({
  itemId,
  onBidSuccess,
  isOpen,
  onClose,
  userBalance,
  minBidStep,
  lotPhoto,
  lastBid,
  onTopUpBalance,
  bids,
  userDetails,
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const minStep = useMemo(() => Number(minBidStep), [minBidStep]);
  const minAllowedBid = useMemo(() => lastBid + minStep, [lastBid, minStep]);

  const lastBidUser = useMemo(() => {
    if (!bids.length) return null;
    const lastBid = bids[bids.length - 1];
    return userDetails.find(user => user.id === lastBid.userId);
  }, [bids, userDetails]);

  // useEffect(() => {
  //   if (submitted && !error) {
  //     onClose();
  //   }
  // }, [error, submitted, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setBidAmount('');
      setError('');
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleBidChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setBidAmount(value);
    setError('');
  }, []);

  const handleSubmitBid = useCallback(async () => {
    const numericBid = Number(bidAmount);
  
    if (!numericBid) {
      setError("Please enter a bid amount");
      return;
    }
    if (numericBid < minAllowedBid) {
      setError(`Bid must be at least $${minAllowedBid}`);
      return;
    }
    if (numericBid > userBalance) {
      setError("Insufficient balance");
      return;
    }
  
    try {
      if (itemId) {
        await userService.makeBid(itemId, numericBid.toString());
        setSubmitted(true);
        onBidSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      setError(
        (error as any)?.response?.data?.offered_price?.[0] 
        || "Bid error"
      );
    }
  }, [bidAmount, minAllowedBid, userBalance, itemId, onBidSuccess]);
  

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">×</button>
        
        <div className={styles.title}>
          <div className={styles.balance}>
            <h3>Your Balance</h3>
            <p>${userBalance}</p>
          </div>
          <div className={styles.step}>
            <h5>Minimum Bid Step</h5>
            <p>${minBidStep}</p>
          </div>
        </div>

        {lotPhoto && <img src={lotPhoto} alt="Lot" className={styles.lotPhoto} />}

        <div className={styles.bids}>
          <h3>Last Bid</h3>
          {bids.length ? (
            <div className={styles.bid}>
              {lastBidUser?.avatar && (
                <img 
                  src={lastBidUser.avatar} 
                  alt="Bidder" 
                  className={styles.bidUserImage}
                />
              )}
              <div className={styles.bidDetails}>
                <div className={styles.bidUserName}>
                  {lastBidUser 
                    ? `${lastBidUser.firstName} ${lastBidUser.lastName}`
                    : 'Anonymous'}
                </div>
                <div className={styles.bidAmount}>
                  Bided ${bids[bids.length - 1].amount}
                </div>
                <div className={styles.bidTime}>
                  {new Date(bids[bids.length - 1].time).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noBids}>No bids available</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            id="bidAmount"
            type="text"
            value={bidAmount}
            onChange={handleBidChange}
            className={styles.inputDiv}
            aria-labelledby="bidAmountLabel"
          />
          <label className={styles.inputLabel} htmlFor="bidAmount">
            Enter your bid
          </label>
          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.fullWidthLine} />

        <div className={styles.buttonGroup}>
          <button 
            onClick={handleSubmitBid} 
            className={styles.bidButton}
            disabled={submitted && !error}
          >
            Bid
          </button>
          <button onClick={onTopUpBalance} className={styles.topUpButton}>
            Top Up Balance
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;