import styles from './Navbar.module.scss';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../Reducer/UsersSlice';
import { AppDispatch, RootState } from 'Store/Store';
import { useState } from 'react';

export const Navbar = () => {
  // Отримання стану авторизації з Redux Store
  const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.userData);

  // Ініціалізація dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Ініціалізація navigate 
  const navigate = useNavigate();

  // Клас для посилань навігації
  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    const className = classNames(styles.itemLink, {
      [styles.active]: isActive,
    });

    // console.log('isActive', isActive); // isActive false

    return className;
  }

  // Клас для посилань у кінці навігації
  const getLinkClassForEnds = ({ isActive }: { isActive: boolean }) =>
    classNames(styles.itemLinkEnd, {
      [styles.isActive]: isActive,
    });

  // Визначення посилання для авторизації або профілю
  const getAuthLink = () => (isLoggedIn ? '/profile' : '/auth');

  // Визначення тексту для кнопки авторизації або профілю
  const getAuthText = () => (isLoggedIn ? currentUser?.username || 'Profile' : 'Sing in');

  // Обробник виходу з системи
  const handleLogout = () => {
    dispatch(logout());
    navigate('/')
  };

  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {/* Ліва частина навігації */}
        <div className={styles.start}>
          <li className={styles.item}>
            <NavLink className={getLinkClass} to="/Home">
              Home
            </NavLink>
          </li>
          <li className={styles.item}>
            <NavLink className={getLinkClass} to="/product">
              Products
            </NavLink>
          </li>
          {isLoggedIn && (
            <li className={styles.item}>
              <NavLink className={getLinkClass} to="/save">
                Save
              </NavLink>
            </li>
          )}
        </div>

        {/* Права частина навігації */}
        <div className={styles.end}>
          {!isLoggedIn && (
            <li className={styles.item}>
              <NavLink className={getLinkClassForEnds} to={getAuthLink()}>
                {getAuthText()}
                {/* Create auction */}
              </NavLink>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li className={styles.item}>
                <NavLink className={getLinkClassForEnds} to={'/create'}>
                  {/* {getAuthText()} */}
                  Create auction
                </NavLink>
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
                <NavLink to="/profile">
                  <img src={currentUser?.photo || "/img/icons/default-user.svg"} alt="User" className={styles.userPhoto} />
                </NavLink>
              </li>
              <li className={styles.itemEnd}>
                <button
                  className={classNames(styles.itemEnd, styles.linkButton)}
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};
