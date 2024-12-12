import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './AuthPage.module.scss';
import { GridContainer } from '../GridContainer/GridContainer';

export const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const clearForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    clearForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const backToHome = () => {
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      console.log('Sign Up:', formData);
    } else {
      console.log('Log In:', formData);
    }
    clearForm();
  };

  return (
    <>
      <button onClick={backToHome}>Back To Home</button>
      <GridContainer>
        <div className={styles.container}>
          <div className={styles.authForm}>
            <div className={styles.switchContainer}>
              <div
                className={`${styles.switchButton} ${
                  isSignIn ? styles.activeSignUp : styles.activeLogIn
                }`}
              ></div>
              <div className={styles.switchTextContainer}>
                <div
                  className={`${styles.signUp} ${isSignIn ? styles.active : ''}`}
                  onClick={toggleForm}
                >
                  Sign Up
                </div>
                <div
                  className={`${styles.logIn} ${!isSignIn ? styles.active : ''}`}
                  onClick={toggleForm}
                >
                  Log In
                </div>
              </div>
            </div>
            <div className={styles.formContainer}>
              <form className={styles.form} onSubmit={handleSubmit}>
                {isSignIn ? (
                  // Форма реєстрації
                  <div className={styles.formInputContainer}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button type="submit">Log In</button>
                  </div>
                ) : (
                  // Форма входу
                  <div className={styles.formInputContainer}>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button type="submit">Sign Up</button>
                  </div>
                  
                )}
              </form>
            </div>
          </div>
        </div>
      </GridContainer>
    </>
  );
};
