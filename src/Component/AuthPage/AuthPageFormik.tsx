import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styles from './AuthPage.module.scss';
import { GridContainer } from '../GridContainer/GridContainer';
import { Field, Form, Formik, FormikProps } from 'formik';
import { authService } from '../../Service/authService';
import cn from 'classnames';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch } from 'react-redux';
// import 'bulma/css/bulma.css';
// import { GoogleLogin, CredentialResponse, useGoogleLogin, googleLogout } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';


interface Errors {
  username: boolean;
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  repeatPassword: boolean;
}

export const AuthPageFormik = () => {
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formikRef = useRef<FormikProps<any>>(null); // створення рефу для Formik

  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;
  const PASSWORD_PATTERN = /^[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;

  function validateEmail(value: string) {
    if (!value) return 'Email is required';
    if (!EMAIL_PATTERN.test(value)) return 'Email is not valid';
  }


  function validatePassword(value: string): string | undefined {
    if (!value) return 'Password is required';
  
    if (value.length < 6) return 'Password must be at least 6 characters long';
  
    if (!PASSWORD_PATTERN.test(value)) {
      return 'Password must contain only English letters';
    }
  
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
  
    if (!/[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
      return 'Password must contain number';
    }
  
    return undefined; // Валідний пароль
  }

  function validateRepeat(value: string, password: string) {
    if (!value) return 'Repeat password is required';
    if (value !== password) return 'Passwords do not match';
  }

  function validateName(value: string) {
    if (!value) return 'Username is required'
    if (value.length < 2) return 'At least 2 charters'
    if (value.length > 20) return 'Max sumbol 20'
  }

  // function validateEmpty(value: string) {
  //   if (!value) return 'Is required';
  // }

  const toggleFormMode = () => {
    setIsSignInMode((prev) => !prev);

    if (formikRef.current) {
      formikRef.current.resetForm();
      setError('');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const toggleShowRepeatPassword = () => {
    setShowRepeatPassword(prev => !prev);
  };

  const handleFocus = () => {
    setError('');
  };

  return (
    <>
      <GridContainer>
        <div className={styles.container}>
          <div className={styles.background}></div>
          <div className={cn({
            [styles.authFormRegister]: !isSignInMode,
            [styles.authFormLogin]: isSignInMode,
          })}>
            <button className={styles.backToHome} onClick={() => navigate(-1)}>
              <img src="/img/icons/Close.svg" alt="" />
            </button>
            <div className={styles.switchContainer}>
              <div className={styles.switchBlock}>
                <div
                  className={`${styles.switchButton} ${isSignInMode ? styles.activeSignUp : styles.activeLogIn}`}
                ></div>
                <div className={styles.switchTextContainer}>
                  <div
                    className={`${styles.signUp} ${isSignInMode ? styles.active : ''}`}
                    onClick={toggleFormMode}
                  >
                    Register
                  </div>
                  <div
                    className={`${styles.logIn} ${!isSignInMode ? styles.active : ''}`}
                    onClick={toggleFormMode}
                  >
                    Log In
                  </div>
                </div>
              </div>
            </div>
            {
            }
            {!isSignInMode ?
              (<Formik
                innerRef={formikRef}
                initialValues={{
                  userName: '',
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  repeatPassword: '',
                }}
                validateOnMount={true}
                onSubmit={({ userName, firstName, lastName, email, password, repeatPassword }, formikHelpers) => {
                  formikHelpers.setSubmitting(true);
                  authService
                    .register(
                      { userName, first_name: firstName, last_name: lastName, email, password, repeatPassword },
                      dispatch
                    )
                    .then(() => {
                      console.log('User registered successfully');
                      setIsSignInMode(true); // Переключення в режим входу після реєстрації
                    })
                    .catch((error) => {
                      const serverErrors = error
                      // Створюємо масив для збереження всіх повідомлень помилок
                      const allErrorMessages: string[] = [];
                      // Проходимо через всі помилки та додаємо їх в масив
                      Object.entries(serverErrors).forEach(([field, messages]) => {
                        allErrorMessages.push(...(messages as string[])); // Додаємо всі повідомлення для кожного поля
                      });
                      setError(allErrorMessages.join(', ')); // Об'єднуємо всі повідомлення в один рядок
                      // Логування помилки для дебагу
                      // console.error('Registration error:', error);
                    })
                    .finally(() => formikHelpers.setSubmitting(false));
                }}
              >
                {({ touched, errors, isSubmitting, values }) => (
                  <Form className={styles.form}>
                    <div className={styles.nameContainer}>
                      <div className={styles.nameControl}>
                        <span className={styles.iconRight}>
                          First name
                        </span>
                        <Field
                          validate={validateName}
                          name="firstName"
                          type="text"
                          id="firstName"
                          onFocus={handleFocus}
                          // placeholder="First name"
                          className={cn(styles.field, {
                            [styles.isDanger]: touched.firstName && errors.firstName,
                          })}
                        />
                        <span className={styles.errorMessageBlock}>
                          {(touched.firstName && errors.firstName) && `${errors.firstName}`}
                        </span>
                      </div>
                      <div className={styles.nameControl}>
                        <span className={styles.iconRight}>
                          Last name
                        </span>
                        <Field
                          validate={validateName}
                          name="lastName"
                          type="text"
                          id="lastName"
                          onFocus={handleFocus}
                          // placeholder="Last name"
                          className={cn(styles.field, {
                            [styles.isDanger]: touched.lastName && errors.lastName,
                          })}
                        />
                        <span className={styles.errorMessageBlock}>
                          {(touched.lastName && errors.lastName) && `${errors.lastName}`}
                        </span>
                      </div>
                    </div>
                    <div className={styles.control}>
                      <span className={styles.iconRight}>
                        Email
                      </span>
                      <Field
                        validate={validateEmail}
                        name="email"
                        type="email"
                        id="email"
                        onFocus={handleFocus}
                        // placeholder="bobsmith@gmail.com"
                        className={cn(styles.field, {
                          [styles.isDanger]: touched.email && errors.email,
                        })}
                      />
                      <span className={styles.errorMessageBlock}>
                        {(touched.email && errors.email) && `${errors.email}`}
                      </span>
                    </div>
                    <div className={styles.control}>
                      <span className={styles.iconRight}>
                        Password
                      </span>
                      <Field
                        validate={validatePassword}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        onFocus={handleFocus}
                        // placeholder="*******"
                        className={cn(styles.field, {
                          [styles.isDanger]: touched.password && errors.password,
                        })}
                      />
                      <span className={styles.iconLeft} onClick={toggleShowPassword}>
                        {showPassword
                          ? <img src="/img/icons/Eye-Show.svg" alt="eye-slash" />
                          : <img src="/img/icons/Eye-Hide.svg" alt="eye" />}
                      </span>
                    </div>
                    <span className={styles.errorMessageBlock}>
                      {(touched.password && errors.password) && `${errors.password}`}
                    </span>
                    <div className={styles.control}>
                      <span className={styles.iconRight}>
                        Repeat password
                      </span>
                      <Field
                        validate={(value: string) => validateRepeat(value, values.password)}
                        name="repeatPassword"
                        type={showRepeatPassword ? "text" : "password"}
                        id="repeatPassword"
                        onFocus={handleFocus}
                        // placeholder="*******"
                        className={cn(styles.field, {
                          [styles.isDanger]: touched.repeatPassword && errors.repeatPassword,
                        })}
                      />
                      <span className={styles.iconLeft} onClick={toggleShowRepeatPassword}>
                        {showRepeatPassword
                          ? <img src="/img/icons/Eye-Show.svg" alt="eye-slash" />
                          : <img src="/img/icons/Eye-Hide.svg" alt="eye" />}
                      </span>
                    </div>
                    <span className={styles.errorMessageBlock}>
                      {(touched.repeatPassword && errors.repeatPassword) && `${errors.repeatPassword}`}
                    </span>
                    {/* <span className={styles.errorMessageBlock}>
                      {console.log(errors)}
                      {touched.password && errors.password
                        ? `${errors.password}`
                        : touched.repeatPassword && errors.repeatPassword
                          ? `${errors.repeatPassword}`
                          : Object.keys(errors).length > 1 
                            ? 'Need fill all field'
                            : ''
                      }
                    </span> */}
                    {errors && <div className={styles.errorMessage}>{error}</div>}
                    <div className={styles.fullWidthLine}></div>

                    <div className={styles.authWihtContainer}>
                      <div className="google">
                        {/* <i className="fa-brands fa-google fa-2xl"></i> */}
                        <img src="/img/icons/Google.png" alt="Google icons" />
                      </div>
                      <div className="apple">
                        {/* <i className="fa-brands fa-apple fa-2xl"></i> */}
                        <img src="/img/icons/Apple.png" alt="Apple icons" />
                      </div>
                      <div className="facebook">
                        {/* <i className="fa-brands fa-facebook fa-2xl"></i> */}
                        <img src="/img/icons/Facebook.png" alt="Facebook icons" />
                      </div>
                    </div>

                    <div className={styles.buttonContainer}>
                      <button
                        type="submit"
                        className={cn(styles.isSuccess, {
                          [styles.isLoading]: isSubmitting,
                        })}
                        disabled={isSubmitting
                          || values.email === ''
                          || values.password === ''
                          || values.userName === ''
                          || values.firstName === ''
                          || values.lastName === ''
                          || values.repeatPassword === ''
                        }
                      >
                        <span className={styles.buttonText}>Register</span>
                      </button>
                    </div>
                  </Form>
                )}


              </Formik>) :
              (<Formik
                innerRef={formikRef}
                initialValues={{
                  email: '',
                  password: '',
                }}
                validateOnMount={true}
                onSubmit={({ email, password }, formikHelpers) => {
                  formikHelpers.setSubmitting(true);
                  authService
                    .login({ email, password }, dispatch)
                    .then(() => {
                      console.log('User logged in successfully');
                      navigate('/Home'); // Переадресація після авторизації
                    })
                    .catch((error) => {
                      setError(error);
                      console.error('Login error:', error);
                    })
                    .finally(() => formikHelpers.setSubmitting(false));
                }}
              >
                {({ touched, errors, isSubmitting, values }) => (
                  <Form className={styles.form}>
                    <div className={styles.control}>
                      <span className={styles.iconRight}>
                        Email
                      </span>
                      <Field
                        validate={validateEmail}
                        name="email"
                        type="email"
                        id="email"
                        onFocus={handleFocus}
                        // placeholder="bobsmith@gmail.com"
                        className={cn(styles.field, {
                          [styles.isDanger]: touched.email && errors.email,
                        })}
                      />
                      <span className={styles.errorMessageBlock}>
                        {(touched.email && errors.email) && `${errors.email}`}
                      </span>
                    </div>
                    <div className={styles.control}>
                      <span className={styles.iconRight}>
                        Password
                      </span>
                      <Field
                        validate={validatePassword}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        onFocus={handleFocus}
                        // placeholder="*******"
                        className={cn(styles.field, {
                          [styles.isDanger]: touched.password && errors.password,
                        })}
                      />

                      <span className={styles.iconLeft} onClick={toggleShowPassword}>
                        {showPassword
                          ? <img src="/img/icons/Eye-Show.svg" alt="eye-slash" />
                          : <img src="/img/icons/Eye-Hide.svg" alt="eye" />}
                      </span>
                    </div>
                    <span className={styles.errorMessageBlock}>
                      {(touched.password && errors.password) && `${errors.password}`}
                      {error && `${error}`}
                    </span>
                    <div className={styles.forgotPassword}>
                      <NavLink to="/forgotPassword">Forgot Password?</NavLink>
                    </div>

                    <div className={styles.fullWidthLine}></div>

                    <div className={styles.authWihtContainer}>
                      <div className="google">
                        {/* <i className="fa-brands fa-google fa-2xl"></i> */}
                        <img src="/img/icons/Google.png" alt="Google icons" />
                      </div>
                      <div className="apple">
                        {/* <i className="fa-brands fa-apple fa-2xl"></i> */}
                        <img src="/img/icons/Apple.png" alt="Apple icons" />
                      </div>
                      <div className="facebook">
                        {/* <i className="fa-brands fa-facebook fa-2xl"></i> */}
                        <img src="/img/icons/Facebook.png" alt="Facebook icons" />
                      </div>
                    </div>
                    <div className={styles.buttonContainer}>
                      <button
                        type="submit"
                        className={cn(styles.isSuccess, {
                          [styles.isLoading]: isSubmitting,
                        })}
                        disabled={isSubmitting
                          || values.email === ''
                          || values.password === ''
                        }
                      >
                        <span className={styles.buttonText}>Log in</span>
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>)
            }
          </div>
        </div>
      </GridContainer>
    </>
  );
};
