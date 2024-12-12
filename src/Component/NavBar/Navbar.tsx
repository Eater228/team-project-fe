import styles from './Navbar.module.scss';
import classNames from 'classnames';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
// import { Context } from '../../Store/Store';
// import { BurgerMenu } from '../BurgerMenu';

export const Navbar = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames('', {
      [styles.isActive]: isActive,
    });

  const getLinkClassForEnds = ({ isActive }: { isActive: boolean }) =>
    classNames(styles.itemEnd, {
      [styles.isActive]: isActive,
    });

  const AuthToProfile = (userStatus: boolean) => {
    if (userStatus === true) {
      return 'profile'
    } else {
      return 'auth'
    }
  }

  // const { favorite, carts, burgerMenuOpen, setBurgerMenuOpen } =
  //   useContext(Context);

  // const toggleBurgerMenu = () => {
  //   setBurgerMenuOpen(!burgerMenuOpen);
  // };

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
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
        <div className={styles.end}>
          {/* <NavLink className={getLinkClassForEnds} to="/favorites">
            <li>
              <img src="img/icons/favourites_icon.svg" alt="favorites" />
              {favorite.length !== 0 && (
                <span className={styles.counter}>{favorite.length}</span>
              )}
            </li> 
           
          </NavLink>
          <NavLink className={getLinkClassForEnds} to="/cart">
            <li>
              <img src="img/icons/cart_icon.svg" alt="cart" />
              {carts.length !== 0 && (
                <span className={styles.counter}>{carts.length}</span>
              )}
            </li>
          </NavLink> */}
          
        <li className={styles.itemEnd}>
          <NavLink className={getLinkClassForEnds} to={AuthToProfile(false)}>
              {`${AuthToProfile(false)}`}
          </NavLink>
        </li>
        </div>
        {/* <div className={styles.burgerСcontainer}>
          <img
            src="img/icons/Menu.svg"
            alt="burger menu"
          />
        </div> */}
      </ul>
      {/* {burgerMenuOpen && (
        <div className={styles.burgerMenu}>
          <BurgerMenu toggleMenu={toggleBurgerMenu} />
        </div>
      )} */}
    </nav>
  );
};
