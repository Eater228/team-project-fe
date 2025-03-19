import React, { useState } from 'react';
import styles from './BalanceModal.module.scss';

interface BalanceModalProps {
  onClose: () => void;
  onAddBalance: (amount: number) => Promise<void>; 
}

export const BalanceModal: React.FC<BalanceModalProps> = ({ onClose, onAddBalance }) => {
  const [balanceAmount, setBalanceAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handleBalanceAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalanceAmount(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleAddBalance = async () => {
    const amount = Number(balanceAmount);
    if (!isNaN(amount)) {
      try {
        await onAddBalance(amount); // Викликаємо функцію з батьківського компонента
        onClose();
      } catch (error) {
        console.error('Failed to add balance:', error);
      }
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
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
            value={`$ ${balanceAmount}`}
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
          <div
            className={`${styles.paymentMethod} ${selectedPaymentMethod === 'PayPal' ? styles.selected : ''}`}
            onClick={() => handlePaymentMethodSelect('PayPal')}
          >
            <img src="/img/icons/PayPal.png" alt="PayPal"/>
          </div>
          <div
            className={`${styles.paymentMethod} ${selectedPaymentMethod === 'GooglePay' ? styles.selected : ''}`}
            onClick={() => handlePaymentMethodSelect('GooglePay')}
          >
            <img src="/img/icons/GooglePay.png" alt="GooglePay" />
          </div>
          <div
            className={`${styles.paymentMethod} ${selectedPaymentMethod === 'ApplePay' ? styles.selected : ''}`}
            onClick={() => handlePaymentMethodSelect('ApplePay')}
          >
            <img src="/img/icons/ApplePay.png" alt="ApplePay" />
          </div>
        </div>
        <button onClick={handleAddBalance}>Add Balance</button>
      </div>
    </div>
  );
};
