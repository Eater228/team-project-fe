import { useEffect, useRef } from 'react';
import styles from './ModalForContact.module.scss';

interface ModalForContactProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement>;
}

const ModalForContact: React.FC<ModalForContactProps> = ({ isOpen, onClose, children, triggerRef }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div 
        ref={modalRef}
        className={styles.modalContent}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalForContact;