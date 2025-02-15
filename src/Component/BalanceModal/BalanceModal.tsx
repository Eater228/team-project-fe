import React, { useState } from 'react';
import styles from './BalanceModal.module.scss';

interface BalanceModalProps {
  onClose: () => void;
}

export const BalanceModal: React.FC<BalanceModalProps> = ({ onClose }) => {
  const [balanceAmount, setBalanceAmount] = useState('');

  const handleBalanceAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalanceAmount(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleAddBalance = () => {
    // Logic to add balance
    console.log(`Adding balance: ${balanceAmount}`);
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleOutsideClick}>
      <div className={styles.modalContent}>
        <img src="/img/icons/Close.svg" alt="Close" className={styles.closeButton} onClick={onClose} />
        <h2>Choose payment method</h2>
        <div className={styles.formGroup}>
          <input
            type="text"
            id="balanceAmount"
            value={balanceAmount}
            onChange={handleBalanceAmountChange}
            className={styles.inputDiv}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.value.replace(/[^0-9]/g, '').length > 6) {
                input.value = `${input.value.replace(/[^0-9]/g, '').slice(0, 6)}`;
              }
            }}
          />
          <label className={styles.inputLabel} htmlFor="balanceAmount">Enter count</label>
        </div>
        <div className={styles.paymentMethods}>
          <div className={styles.paymentMethod}>Credit Card</div>
          <div className={styles.paymentMethod}>PayPal</div>
          <div className={styles.paymentMethod}>Bank Transfer</div>
        </div>
        <button onClick={handleAddBalance}>Add Balance</button>
      </div>
    </div>
  );
};
