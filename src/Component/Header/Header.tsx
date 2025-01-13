import { NavLink } from 'react-router-dom';
import { Navbar } from '../NavBar/Navbar';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo_container}>
        <NavLink to="/Home">
          <img className={styles.logo} src="/img/icons/Vector.svg" alt="Website logo"/>
        </NavLink>
      </div>
      <Navbar />
    </div>
  );
};
