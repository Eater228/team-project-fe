import React from 'react';
import styles from './LogoutModal.module.scss';

interface LogoutModalProps {
  onClose: () => void;
  onLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ onClose, onLogout }) => {
  return (
    <div className={styles.logoutModalOverlay} onClick={onClose}>
      <div className={styles.logoutModalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src="/img/icons/Close.svg" alt="Close" />
        </button>
        <div className={styles.titelBlock}>
          <h2>Want to Logout?</h2>
          <p>You will log out of profile</p>
        </div>
        <div className={styles.logoutActions}>
          <button className={styles.logoutButton} onClick={onLogout}>Logout</button>
          <button className={styles.backButton} onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
};
