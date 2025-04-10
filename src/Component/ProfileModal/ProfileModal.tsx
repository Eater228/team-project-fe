import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store/Store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Reducer/UsersSlice';
import { clearFavorites } from '../../Reducer/favoriteSlice';
import { LogoutModal } from '../LogoutModal/LogoutModal';
import styles from './ProfileModal.module.scss';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const currentUser = useSelector((state: RootState) => state.userData.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearFavorites());
    navigate('/Home');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.profileInfo}>
          <img src={currentUser?.profile_pic || "/img/icons/default-user.svg"} alt="User" className={styles.profilePic} />
          <div className={styles.profileDetails}>
            <h2>{currentUser?.first_name} {currentUser?.last_name}</h2>
            <p>{currentUser?.email}</p>
          </div>
        </div>
        <div className={styles.fullWidthLine}></div>
        <div className={styles.actions}>
          <button className={styles.buttonCreat} onClick={() => { navigate('/create'); onClose(); }}>Create Auction</button>
          <div className={styles.profileButton}>
            <button onClick={() => { navigate('/profile'); onClose(); }}>
              Profile
              <img src="/img/icons/Arrow_Right.svg" alt="Arrow Right" />
            </button>
            <button onClick={() => { navigate('/myAuctions'); onClose(); }}>
              My Auctions
              <img src="/img/icons/Arrow_Right.svg" alt="Arrow Right" />
            </button>
            {/* <button onClick={() => { navigate('/settings'); onClose(); }}>
              Settings
              <img src="/img/icons/Arrow_Right.svg" alt="Arrow Right" />
            </button> */}
            <button onClick={() => setShowLogoutModal(true)}>
              Log Out
            </button>
          </div>
        </div>
      </div>
      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} onLogout={handleLogout} />
      )}
    </div>
  );
};
