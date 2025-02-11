import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { userService } from '../../Service/userService';
import styles from './Profile.module.scss';

export const Profile: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.userData.currentUser);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState<{ [key: string]: boolean }>({
    phone: false,
    telegram: false,
    instagram: false,
    viber: false,
  });
  const [newContact, setNewContact] = useState<{ [key: string]: string }>({
    phone: '',
    telegram: '',
    instagram: '',
    viber: '',
  });

  const handleChangePassword = async () => {
    if (!currentUser?.email || !currentUser?.first_name || !currentUser?.last_name) {
      console.error('Required user data is missing');
      return;
    }

    const updateProfile = {
      email: currentUser.email,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      profile_pic: currentUser.profile_pic || '',
      password: newPassword,
    };

    console.log("Up date profile",updateProfile);
    
    if (isEditingPassword) {
      try {
        await userService.updateProfile(updateProfile);
        setPasswordChangeSuccess(true);
        setTimeout(() => setPasswordChangeSuccess(false), 3000); // Hide success message after 3 seconds
      } catch (error) {
        console.error('Failed to change password:', error);
      }
      // Reset state
      setIsEditingPassword(false);
      setNewPassword('');
    } else {
      setIsEditingPassword(true);
    }
  };
  

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleEditContact = (contactType: string) => {
    if (isEditingContact[contactType]) {
      // Handle contact change logic here
      console.log(`New ${contactType}:`, newContact[contactType]);
      // Reset state
      setIsEditingContact(prev => ({ ...prev, [contactType]: false }));
      setNewContact(prev => ({ ...prev, [contactType]: '' }));
    } else {
      setIsEditingContact(prev => ({ ...prev, [contactType]: true }));
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>, contactType: string) => {
    setNewContact(prev => ({ ...prev, [contactType]: e.target.value }));
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.sidebar}>
        <h2>Profile</h2>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.balanceSection}>
          <h3>On your balance</h3>
          <p>${currentUser?.balance || 0}</p>
        </div>
        <div className={styles.profileInfo}>
          <img src={currentUser?.profile_pic || "/img/icons/default-user.svg"} alt="User" className={styles.profilePic} />
          <div className={styles.profileDetails}>
            <h2>{currentUser?.first_name} {currentUser?.last_name}</h2>
            <p>{currentUser?.email}</p>
          </div>
        </div>
        <div className={styles.formSection}>
          <div className={styles.nameFields}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <div className={styles.inputDiv}>{currentUser?.first_name}</div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <div className={styles.inputDiv}>{currentUser?.last_name}</div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            {isEditingPassword ? (
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={handlePasswordChange}
                className={styles.inputDiv}
              />
            ) : (
              <div className={styles.inputDiv}>********</div>
            )}
            <button className={styles.changePasswordButton} onClick={handleChangePassword}>
              {isEditingPassword ? 'Save Changes' : 'Change Password'}
            </button>
            {passwordChangeSuccess && <div className={styles.successMessage}>Password changed successfully!</div>}
          </div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.contactsSection}>
          <h3>Contacts</h3>
          {['phone', 'telegram', 'instagram', 'viber'].map(contactType => (
            <div className={styles.formGroup} key={contactType}>
              <label htmlFor={contactType}>{contactType.charAt(0).toUpperCase() + contactType.slice(1)}</label>
              <img src={`/img/icons/${contactType.charAt(0).toUpperCase() + contactType.slice(1)}.svg`} alt={contactType} className={styles.contactIcon} />
              {isEditingContact[contactType] ? (
                <input
                  type="text"
                  id={contactType}
                  value={newContact[contactType]}
                  onChange={(e) => handleContactChange(e, contactType)}
                  className={styles.inputDiv}
                />
              ) : (
                <div className={styles.inputDiv}>{currentUser?.[contactType] || 'Not provided'}</div>
              )}
              <button className={styles.changePasswordButton} onClick={() => handleEditContact(contactType)}>
                {isEditingContact[contactType] ? 'Save Changes' : `Add ${contactType.charAt(0).toUpperCase() + contactType.slice(1)}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};