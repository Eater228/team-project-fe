import styles from './Navbar.module.scss';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, updateUser } from '../../Reducer/UsersSlice';
import { AppDispatch, RootState } from 'Store/Store';
import { useState } from 'react';
import { ProfileModal } from '../ProfileModal/ProfileModal';
import { BalanceModal } from '../BalanceModal/BalanceModal';
import { NotificationModal } from '../NotificationModal/NotificationModal';
import { userService } from '../../Service/userService';

export const Navbar = () => {
  const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.userData);
  const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const toggleProfileModal = () => setShowProfileModal((prev) => !prev);
  const toggleBalanceModal = () => setShowBalanceModal((prev) => !prev);
  const toggleNotificationModal = () => setShowNotificationModal((prev) => !prev);

  const handleAddBalance = async (amount: number) => {
    try {
      // Оновлюємо баланс через API
      const updatedUser = await userService.updateProfile({
        balance: (currentUser?.balance || 0) + amount
      });

      // Оновлюємо Redux store
      console.log('updatedUser:', updatedUser);
      dispatch(updateUser(updatedUser));
    } catch (error) {
      console.error('Error adding balance:', error);
      throw error;
    }
  };

  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate('/Home');
  // };

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
              <NavLink className={getLinkClass} to="/save">Saved</NavLink>
            </li>
          )}
        </div>

        {/* Права частина навігації */}
        <div className={styles.end}>
          {!isLoggedIn ? (
            <li className={styles.item}>
              <NavLink className={styles.singUp} to={getAuthLink()}>{getAuthText()}</NavLink>
            </li>
          ) : (
            <>
              <li className={styles.item}>
                <NavLink className={styles.createButton} to="/create">Create auction</NavLink>
              </li>
              <li className={styles.item}>
                <div className={styles.plusCircle} onClick={toggleBalanceModal}>
                  <img src="/img/icons/Plus.svg" alt="Add Auction" />
                </div>
                <div className={styles.balance}>
                  <p>Balance</p>
                  <div className={styles.balanceAmount}>${currentUser?.balance || 0}</div>
                </div>
              </li>
              <li className={styles.item}>
                <div
                  className={styles.notificationButton}
                  onClick={toggleNotificationModal}
                >
                  <img src="/img/icons/Bell.svg" alt="Notifications" />
                </div>
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
      {/* Модальне вікно балансу */}
      {showBalanceModal && <BalanceModal onClose={toggleBalanceModal} onAddBalance={handleAddBalance} />}
      {/* Модальне вікно сповіщень */}
      {showNotificationModal && <NotificationModal onClose={toggleNotificationModal} />}
    </nav>
  );
};
