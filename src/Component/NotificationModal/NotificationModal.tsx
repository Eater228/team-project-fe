import styles from './NotificationModal.module.scss';

interface NotificationModalProps {
  onClose: () => void;
}

export const NotificationModal = ({ onClose }: NotificationModalProps) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleOutsideClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <p>No new notifications</p>
      </div>
    </div>
  );
};
