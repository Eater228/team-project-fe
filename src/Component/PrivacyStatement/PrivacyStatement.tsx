import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PrivacyStatement.module.scss';

export const PrivacyStatement: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBackClick}>
        <img src="/img/icons/ArrowBack.svg" alt="Back" />
      </button>
      <h1>Privacy Policy</h1>
      <div className={styles.block}>
        <div className={styles.mainText}>
          <p>This Privacy Policy explains how TopBid ("we", "our", "us") collects, uses, and protects your personal information when you use our online auction website, top-bid (the "Site"). By using the Site, you agree to the terms of this Policy.</p>
          <ul>
            <li>
              <h2>Information We Collect</h2>
            </li>
          </ul>
          {/* <p>We may collect the following information:</p> */}
          <p>Personal Data: Name, email address, phone number, address, payment information.<br />
            Technical Data: IP address, browser type, cookie data, device information.<br />
            Activity Information: Bidding history, purchases, comments left.</p>
          <ul>
            <li>
              <h2>How We Use Your Information</h2>
            </li>
          </ul>
          <p>
            Provide access to the Site's features and process bids.<br />
            Verify users and prevent fraud.<br />
            Improve the Site and personalize user experience.<br />
            Send important notifications and marketing offers (with your consent).</p>
          <ul>
            <li>
              <h2>How We Protect Your Information</h2>
            </li>
          </ul>
          <p>We use modern security measures to protect your data from unauthorized access, modification, or disclosure.</p>
          <ul>
            <li>
              <h2>Do We Share Your Data with Third Parties?</h2>
            </li>
          </ul>
          <p>We do not sell or share your personal data with third parties without your consent, except as required by law or necessary for the operation of the Site (e.g., payment services).</p>
          <ul>
            <li>
              <h2>Use of Cookies</h2>
            </li>
          </ul>
          <p>The Site uses cookies to improve performance and analyze traffic. You can manage cookie settings in your browser.</p>
          <ul>
            <li>
              <h2>Your rights</h2>
            </li>
          </ul>
          <p>You have the right to:<br />
            Access your data and request its correction or deletion.<br />
            Withdraw consent to the processing of personal data.<br />
            File a complaint with the data protection authority.</p>
          <ul>
            <li>
              <h2>Changes to the Privacy Policy</h2>
            </li>
          </ul>
          <p>We may update this Policy. Updates are published on this page, and your continued access to the Site constitutes acceptance of the new terms.</p>
          <ul>
            <li>
              <h2>Contact Information</h2>
            </li>
          </ul>
          <p>
            If you have questions about this Policy, please contact us:<br />
            Email: [Email]<br />
            Phone: [Phone]<br />
            Address: [Physical Address]
          </p>
          <br />
          <p>Last updated: February 10</p>
        </div>
      </div>
    </div >
  );
};
