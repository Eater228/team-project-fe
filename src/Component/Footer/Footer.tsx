import { NavLink } from 'react-router-dom';
import { topScroll } from '../../Function/ScrolTop/topScrol';
import { GridContainer } from '../GridContainer/GridContainer';
import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <div className={styles.container}>
      <GridContainer>
        <div className={styles.content}>
          <div className={styles.top}>
            <NavLink to="/">
              <img
                src="/img/icons/Vector.svg"
                alt="Logo"
                className={styles.logo}
              />
            </NavLink>
            <div className={styles.icons}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/img/icons/Instagram.svg" alt="GitHub" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
              >
              <img src="/img/icons/Facebook.svg" alt="Rights" />
              </a>
              <a
                href="https://t.me/Eater1503"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/img/icons/Telegram.svg" alt="Telegram" />
              </a>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.name}>
              <h2>@TopBid.ua - 2024</h2>
            </div>
            <div className={styles.name}>
              <h2>Privacy Statement</h2>
            </div>
          </div>
        </div>
      </GridContainer>
    </div>
  );
};
