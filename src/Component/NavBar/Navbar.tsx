import styles from './Navbar.module.scss';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../Reducer/UsersSlice';
import { AppDispatch, RootState } from 'Store/Store';

export const Navbar = () => {
  // Отримання стану авторизації з Redux Store
  const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.userData);

  // Ініціалізація dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Ініціалізація navigate 
  const navigate = useNavigate();

  // Клас для посилань навігації
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames('', {
      [styles.isActive]: isActive,
    });

  // Клас для посилань у кінці навігації
  const getLinkClassForEnds = ({ isActive }: { isActive: boolean }) =>
    classNames(styles.itemEnd, {
      [styles.isActive]: isActive,
    });

  // Визначення посилання для авторизації або профілю
  const getAuthLink = () => (isLoggedIn ? '/profile' : '/auth');

  // Визначення тексту для кнопки авторизації або профілю
  const getAuthText = () => (isLoggedIn ? currentUser?.username || 'Profile' : 'Auth');

  // Обробник виходу з системи
  const handleLogout = () => {
    dispatch(logout());
    navigate('/')
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {/* Ліва частина навігації */}
        <div className={styles.start}>
          <li className={styles.item}>
            <NavLink className={getLinkClass} to="/product">
              Product
            </NavLink>
          </li>
          <li className={styles.item}>
            <NavLink className={getLinkClass} to="/top">
              Top
            </NavLink>
          </li>
          <li className={styles.item}>
            <NavLink className={getLinkClass} to="/new">
              New
            </NavLink>
          </li>
        </div>

        {/* Права частина навігації */}
        <div className={styles.end}>
          <li className={styles.itemEnd}>
            <NavLink className={getLinkClassForEnds} to={getAuthLink()}>
              {getAuthText()}
            </NavLink>
          </li>
          {isLoggedIn && (
            <li className={styles.itemEnd}>
              <button
                className={classNames(styles.itemEnd, styles.linkButton)}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </li>
          )}
        </div>
      </ul>
    </nav>
  );
};
