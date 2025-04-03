import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Notification.module.scss';

export const Notification: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notification}>
      <div className={styles.titleBlock}>
        <div className={styles.imageBlock}>
          <img src="/img/icons/Notification.png" alt="Notification" />
        </div>
        <div className={styles.title}>
          <h2>Notification</h2>
          <p>
            Please verify your identity
            to participate in auctions
            by clicking on the button below
          </p>
        </div>
      </div>
      <button
        className={styles.button}
        onClick={() => navigate('/profile')}
      >
        Verify Phone Number
      </button>
    </div>
  );
}