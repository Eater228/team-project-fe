import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './AuthPage.module.scss';
import { GridContainer } from '../GridContainer/GridContainer';
import { useSelector, useDispatch } from 'react-redux';
import { login, register } from '../../Reducer/UsersSlice';
import { AppDispatch, RootState } from '../../Store/Store';

interface Errors {
  username: boolean;
  email: boolean;
  password: boolean;
}

export const AuthPage = () => {
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false
  });

  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});

  const userState = useSelector((state: RootState) => state.userData);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  // const validateInput = () => {
  //  const errors = [];
  //  const newErrors: Errors = {
  //   username: false,
  //   email: false,
  //   password: false,
  //  };

  //  if (!formState.email || !EMAIL_PATTERN.test(formState.email)) {
  //   errors.push('Invalid email');
  //   newErrors.email = true;
  //  }

  //  if (!formState.password || formState.password.length < 6) {
  //   errors.push('Password must be at least 6 characters invalid password')
  //   newErrors.password = true;
  //  }

  //  if (!isSignInMode) {
  //    if (!formState.username || formState.username.length < 5) {
  //     errors.push('Not valid username')
  //     newErrors.username = true;
  //    }
  //  }


  //  setErrors(newErrors);
  //  return errors;

  //   // if (!formState.email) errors.push('Email is required');
  //   // else if (!EMAIL_PATTERN.test(formState.email)) errors.push('Invalid email');

  //   // if (!formState.password) errors.push('Password is required');
  //   // else if (formState.password.length < 6) errors.push('Password must be at least 6 characters');

  //   // return errors;

  //   // const errors = {};

  //   // if (!formState.email) {
  //   //   errors.email = 'Email is required';
  //   // } else if (!EMAIL_PATTERN.test(formState.email)) {
  //   //   errors.email = 'Invalid email';
  //   // }

  //   // if (!formState.password) {
  //   //   errors.password = 'Password is required';
  //   // } else if (formState.password.length < 6) {
  //   //   errors.password = 'Password must be at least 6 characters';
  //   // }

  //   // setErrors(errors);
  //   // return Object.keys(errors).length === 0;
  // };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!EMAIL_PATTERN.test(value)) return 'Invalid email format';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'username':
        if (!isSignInMode) {
          if (!value) return 'Username is required';
          if (value.length < 5) return 'Username must be at least 5 characters';
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    if (touchedFields[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const resetForm = () => {
    setFormState({ username: '', email: '', password: '' });
    setErrors({
      username: false,
      email: false,
      password: false,
     })
  }

  const toggleFormMode = () => {
    setIsSignInMode((prev) => !prev);
    resetForm();
  };


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      username: validateField('username', formState.username) ? true : false,
      email: validateField('email', formState.email) ? true : false,
      password: validateField('password', formState.password) ? true : false,
    }
    
    setErrors(errors);

    if(!Object.values(errors).every(value => value === false)) {
      return
    }

    if (isSignInMode) {
      dispatch(login(formState));
    } else {
      dispatch(register(formState));
      toggleFormMode();
    }
  };

  // Виконуємо перенаправлення, коли користувач авторизований
  useEffect(() => {
    if (userState.isLoggedIn) {
      navigate('/');
    }
  }, [userState.isLoggedIn, navigate]);

  return (
    <>
      <button className={styles.backToHome} onClick={() => navigate('/')}>Back To Home</button>
      <GridContainer>
        <div className={styles.container}>
          <div className={styles.authForm}>
            <div className={styles.switchContainer}>
              <div
                className={`${styles.switchButton} ${isSignInMode ? styles.activeSignUp : styles.activeLogIn}`}
              ></div>
              <div className={styles.switchTextContainer}>
                <div
                  className={`${styles.signUp} ${isSignInMode ? styles.active : ''}`}
                  onClick={toggleFormMode}
                >
                  Sign Up
                </div>
                <div
                  className={`${styles.logIn} ${!isSignInMode ? styles.active : ''}`}
                  onClick={toggleFormMode}
                >
                  Log In
                </div>
              </div>
            </div>
{
// Доробити валідацію touch
}
            <div className={styles.formContainer}>
              <form className={styles.form} onSubmit={handleFormSubmit}>
                {isSignInMode ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formState.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.username ? styles.error : ""}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formState.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.username ? styles.error : ""}
                    />
                    {
                      (errors.password || errors.email || errors.username) 
                      && <span className={styles.errorMessage}>All fields must be filled in</span>
                    }
                    <button type="submit">Log In</button>
                    <div className={styles.resetPassword}>
                      <NavLink  to={'/reset'}>Forget password</NavLink>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formState.username}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.username ? styles.error : ""}
                    />
                     {/* {errors.username && <span className={styles.errorMessage}>Username must be at least 5 characters</span>} */}
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formState.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.email ? styles.error : ""}
                    />
                      {/* {errors.email && <span className={styles.errorMessage}>Enter a valid email</span>} */}
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formState.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.password ? styles.error : ""}
                    />
                      {/* {errors.password && <span className={styles.errorMessage}>Password must be at least 6 characters</span>} */}
                      {
                        (errors.password || errors.email || errors.username) 
                        && <span className={styles.errorMessage}>All fields must be filled in</span>
                      }
                    <button type="submit">Sign Up</button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </GridContainer>
    </>
  );
};
