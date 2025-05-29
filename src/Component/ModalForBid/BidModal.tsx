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
  bids: {
    offered_price: number | string;
    bid_time: string;
    bidder_first_name: string;
    bidder_last_name: string;
    bidder_profile_pic: string;
  }[];
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
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const numericMinBidStep = useMemo(() => Number(minBidStep), [minBidStep]);
  const minAllowedBid = useMemo(() => lastBid + numericMinBidStep, [lastBid, numericMinBidStep]);

  const lastBidEntry = useMemo(() => {
    if (!bids || bids.length === 0) return null;
    return bids[bids.length - 1];
  }, [bids]);

  useEffect(() => {
    if (!isOpen) {
      setBidAmount('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleBidChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 7);
    setBidAmount(value);
    if (error) setError('');
  }, [error]);

  const handleSubmitBid = useCallback(async () => {
    const numericBid = Number(bidAmount);

    if (!bidAmount || numericBid <= 0) {
      setError("Please enter a bid amount.");
      return;
    }
    if (numericBid < minAllowedBid) {
      setError(`Minimum bid: $${minAllowedBid.toFixed(2)}`);
      return;
    }
    if (numericBid > userBalance) {
      setError("Insufficient balance.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (itemId) {
        await userService.makeBid(itemId, numericBid.toString());
        onBidSuccess?.();
        onClose();
      } else {
        setError("Lot ID is missing. Cannot place bid.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error during bid:", err);
      const apiError = (err as any)?.response?.data;
      const offeredPriceError = apiError?.offered_price?.[0];
      const detailError = apiError?.detail;
      
      if (offeredPriceError) {
        setError(offeredPriceError);
      } else if (detailError) {
          setError(detailError);
      } else {
        setError("An error occurred while placing the bid. Please try again.");
      }
      setIsSubmitting(false);
    }
  }, [
    bidAmount,
    minAllowedBid,
    userBalance,
    itemId,
    onBidSuccess,
    onClose,
  ]);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={styles.modalContent} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">×</button>
        
        <div className={styles.title}>
          <div className={styles.balance}>
            <h3>Your Balance</h3>
            <p>${userBalance.toFixed(2)}</p>
          </div>
          <div className={styles.step}>
            <h5>Minimum Bid Step</h5>
            <p>${Number(minBidStep).toFixed(2)}</p>
          </div>
        </div>

        {lotPhoto && <img src={lotPhoto} alt="Lot Photo" className={styles.lotPhoto} />}

        <div className={styles.bids}>
          <h3>Last Bid</h3>
          {lastBidEntry ? (
            <div className={styles.bid}>
              {lastBidEntry.bidder_profile_pic && (
                <img 
                  src={lastBidEntry.bidder_profile_pic} 
                  alt={`${lastBidEntry.bidder_first_name || ''} ${lastBidEntry.bidder_last_name || ''}`} 
                  className={styles.bidUserImage}
                />
              )}
              <div className={styles.bidDetails}>
                <div className={styles.bidUserName}>
                  {`${lastBidEntry.bidder_first_name || ''} ${lastBidEntry.bidder_last_name || ''}`.trim() || 'Anonymous'}
                </div>
                <div className={styles.bidAmount}>
                  Bid: ${Number(lastBidEntry.offered_price).toFixed(2)}
                </div>
                <div className={styles.bidTime}>
                  {new Date(lastBidEntry.bid_time).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noBids}>No bids yet</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel} htmlFor="bidAmountInput">
            Enter your bid
          </label>
          <input
            id="bidAmountInput"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={bidAmount}
            onChange={handleBidChange}
            className={styles.inputDiv}
            aria-describedby={error ? "bidError" : undefined}
            placeholder={`min. $${minAllowedBid.toFixed(2)}`}
          />
          {error && <div id="bidError" className={styles.error} role="alert">{error}</div>}
        </div>

        <div className={styles.fullWidthLine} />

        <div className={styles.buttonGroup}>
          <button 
            onClick={handleSubmitBid} 
            className={styles.bidButton}
            disabled={isSubmitting || !bidAmount}
          >
            {isSubmitting ? 'Submitting...' : 'Place Bid'}
          </button>
          <button 
            onClick={onTopUpBalance} 
            className={styles.topUpButton}
            disabled={isSubmitting}
          >
            Top Up Balance
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;