import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store/Store';
import { userService } from '../../Service/userService';
import styles from './Profile.module.scss';
import { BalanceModal } from '../../Component/BalanceModal/BalanceModal';
import { updateUser } from '../../Reducer/UsersSlice';

export const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.userData.currentUser);
  
  // Стани компонента
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
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
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [newFirstName, setNewFirstName] = useState(currentUser?.first_name || '');
  const [newLastName, setNewLastName] = useState(currentUser?.last_name || '');

  useEffect(() => {
    setNewFirstName(currentUser?.first_name || '');
    setNewLastName(currentUser?.last_name || '');
    setNewContact({
      phone: currentUser?.phone_number || '',
      telegram: currentUser?.telegram || '',
      instagram: currentUser?.instagram || '',
      viber: currentUser?.viber?.toString() || '',
    });
  }, [currentUser]);

  const handleEditName = () => {
    if (isEditingLastName) {
      setIsEditingLastName(false);
    } else {
      setIsEditingLastName(true);
    }
  };

  const handleEditFirstName = async () => {
    if (isEditingFirstName) {
      try {
        const updatedUser = await userService.updateProfile({ first_name: newFirstName });
        dispatch(updateUser(updatedUser.data)); // Використовуємо .data з відповіді
      } catch (error) {
        console.error('Error updating first name:', error);
      }
    }
    setIsEditingFirstName(!isEditingFirstName);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLastName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
  };

  const handleSavePassword = async () => {
    if (newPassword === repeatPassword) {
      try {
        await userService.updateProfile({ password: newPassword });
        setPasswordChangeSuccess(true);
        setTimeout(() => setPasswordChangeSuccess(false), 3000);
      } catch (error) {
        console.error('Password update failed:', error);
      }
    } else {
      alert('Passwords do not match!');
    }
    setIsEditingPassword(false);
    setNewPassword('');
    setRepeatPassword('');
  };

  const handleCancelPasswordEdit = () => {
    setIsEditingPassword(false);
    setNewPassword('');
    setRepeatPassword('');
  };

  const handleChangePassword = () => {
    setIsEditingPassword(true);
    setPasswordChangeSuccess(false);
  };

  const handleEditContact = async (contactType: string) => {
    if (isEditingContact[contactType]) {
      try {
        const apiField = contactType === 'phone' ? 'phone_number' : contactType;
        let value: string | boolean = newContact[contactType];
        
        if (contactType === 'viber') {
          value = value === 'true';
        }

        const updatedUser = await userService.updateProfile({ [apiField]: value });
        dispatch(updateUser(updatedUser.data)); // Використовуємо .data з відповіді
      } catch (error) {
        console.error(`Error updating ${contactType}:`, error);
      }
    }
    setIsEditingContact(prev => ({
      ...prev,
      [contactType]: !prev[contactType]
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>, contactType: string) => {
    setNewContact(prev => ({ ...prev, [contactType]: e.target.value }));
  };

  const toggleBalanceModal = () => setShowBalanceModal(prev => !prev);

  const handleBalanceClick = () => {
    setShowBalanceModal(true);
  };

  const handleAddBalance = async (amount: number) => {
    try {
      // Оновлюємо баланс через API
      const updatedUser = await userService.updateProfile({
        balance: (currentUser?.balance || 0) + amount
      });
      
      // Оновлюємо Redux store
      dispatch(updateUser(updatedUser.data));
    } catch (error) {
      console.error('Error adding balance:', error);
      throw error;
    }
  };


  return (
    <div className={styles.profilePage}>
      <div className={styles.sidebar}>
        <h2>Profile</h2>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.balanceSection}>
          <h3>On your balance</h3>
          <div className={styles.balanceContainer}>
            <p>${currentUser?.balance || 0}</p>
            <div className={styles.addBalanceButton} onClick={handleBalanceClick}>
              <img src="/img/icons/Plus.svg" alt="Add Auction" />
            </div>
          </div>
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
              {isEditingFirstName ? (
                <input
                  type="text"
                  id="firstName"
                  value={newFirstName}
                  onChange={handleFirstNameChange}
                  className={styles.inputDiv}
                />
              ) : (
                <div className={styles.inputDiv}>{currentUser?.first_name}</div>
              )}
              <button className={styles.changeNameButton} onClick={handleEditFirstName}>
                {isEditingFirstName ? <img src='./img/icons/diskette.svg' /> : <img src='./img/icons/Pencil.svg' />}
              </button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              {isEditingLastName ? (
                <input
                  type="text"
                  id="lastName"
                  value={newLastName}
                  onChange={handleLastNameChange}
                  className={styles.inputDiv}
                />
              ) : (
                <div className={styles.inputDiv}>{currentUser?.last_name}</div>
              )}
              <button className={styles.changeNameButton} onClick={handleEditName}>
                {isEditingLastName ? <img src='./img/icons/diskette.svg' /> : <img src='./img/icons/Pencil.svg' />}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={isEditingPassword ? styles.passwordLabel : undefined} htmlFor="password">Password</label>
            {isEditingPassword ? (
              <div className={styles.passwordFields}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password">New Password</label>
                  <input
                    type="text"
                    id="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className={styles.inputPassword}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="repeatPassword">Repeat Password</label>
                  <input
                    type="text"
                    id="repeatPassword"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    className={styles.inputPassword}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button className={styles.cancelButton} onClick={handleCancelPasswordEdit}>Back</button>
                  <button className={styles.saveButton} onClick={handleSavePassword}>Save</button>
                </div>
              </div>
            ) : (
              <div className={styles.inputDiv}>*******</div>
            )}
            {!isEditingPassword && (
              <button className={styles.changePasswordButton} onClick={handleChangePassword}>
                <img src="./img/icons/Pencil.svg" alt="Edit" />
              </button>
            )}
            {/* {passwordChangeSuccess && <div className={styles.successMessage}>Password changed successfully!</div>} */}
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
                {isEditingContact[contactType] ? <img src='./img/icons/diskette.svg' /> : <img src='./img/icons/Pencil.svg' />}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.sidebar}>
      </div>
      {/* Модальне вікно балансу */}
      {showBalanceModal && <BalanceModal onClose={toggleBalanceModal} onAddBalance={handleAddBalance} />}
    </div>
  );
};