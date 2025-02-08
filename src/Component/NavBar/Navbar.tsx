import styles from './Navbar.module.scss';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../Reducer/UsersSlice';
import { AppDispatch, RootState } from 'Store/Store';
import { useState } from 'react';
import { ProfileModal } from '../ProfileModal/ProfileModal';

console.log(ProfileModal)

export const Navbar = () => {
  const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.userData);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleNotifications = () => setShowNotifications((prev) => !prev);
  const toggleProfileModal = () => setShowProfileModal((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/Home');
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames(styles.itemLink, { [styles.active]: isActive });

  const getAuthLink = () => (isLoggedIn ? '/profile' : '/auth');
  const getAuthText = () => (isLoggedIn ? currentUser?.first_name || 'Profile' : 'Sign up');

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {/* Ліва частина навігації */}
        <div className={styles.start}>
          <li className={styles.item}>
            <NavLink className={getLinkClass} to="/Home">Home</NavLink>
          </li>
          <li className={styles.item}>
            <NavLink className={getLinkClass} to="/product">Products</NavLink>
          </li>
          {isLoggedIn && (
            <li className={styles.item}>
              <NavLink className={getLinkClass} to="/save">Save</NavLink>
            </li>
          )}
        </div>

        {/* Права частина навігації */}
        <div className={styles.end}>
          {!isLoggedIn ? (
            <li className={styles.item}>
              <NavLink className={getLinkClass} to={getAuthLink()}>{getAuthText()}</NavLink>
            </li>
          ) : (
            <>
              <li className={styles.item}>
                <NavLink className={styles.createButton} to="/create">Create auction</NavLink>
              </li>
              <li className={styles.item}>
                <NavLink to="/CreateAuction">
                  <div className={styles.plusCircle}>
                    <img src="/img/icons/Plus.svg" alt="Add Auction" />
                  </div>
                </NavLink>
                <div className={styles.balance}>
                  <p>Balance</p>
                  <div className={styles.balanceAmount}>${currentUser?.balance || 0}</div>
                </div>
              </li>
              <li className={styles.item}>
                <button className={styles.notificationButton} onClick={toggleNotifications}>
                  <img src="/img/icons/Bell.svg" alt="Notifications" />
                </button>
                {showNotifications && (
                  <div className={styles.notificationDropdown}>
                    <p>No new notifications</p>
                  </div>
                )}
              </li>
              <li className={styles.item}>
                <div onClick={toggleProfileModal}>
                  <img
                    src={currentUser?.profile_pic || "/img/icons/default-user.svg"}
                    alt="User"
                    className={styles.userPhoto}
                  />
                </div>
              </li>
            </>
          )}
        </div>
      </ul>

      {/* Модальне вікно профілю */}
      {showProfileModal && <ProfileModal onClose={toggleProfileModal} />}
    </nav>
  );
};
