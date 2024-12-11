import { NavLink } from 'react-router-dom';
import { Navbar } from '../NavBar';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo_container}>
        <NavLink to="/">
          <img className={styles.logo} src="https://logospng.org/download/vite-js/vite-js-256-logo.png" alt=""/>
        </NavLink>
      </div>
      <Navbar />
    </div>
  );
};
