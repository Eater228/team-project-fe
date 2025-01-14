import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styles from './AuthPage.module.scss';
import { GridContainer } from '../GridContainer/GridContainer';
import { Field, Form, Formik, FormikProps } from 'formik';
import { authService } from '../../Service/authServiceForTest';
import cn from 'classnames';
import '@fortawesome/fontawesome-free/css/all.min.css';
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

  const formikRef = useRef<FormikProps<any>>(null); // створення рефу для Formik

  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;
  const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  function validateEmail(value: string) {
    if (!value) return 'Email is required';
    if (!EMAIL_PATTERN.test(value)) return 'Email is not valid';
  }

  function validatePassword(value: string): string | undefined {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'At least 6 characters';

    if (!PASSWORD_PATTERN.test(value)) {
      return 'Password must contain at least one uppercase letter, one number, and only English letters.';
    }

    return undefined; // Валідний пароль
  }

  function validateRepeat(value: string, password: string) {
    if (!value) return 'Repeat password is required';
    if (value !== password) return 'Passwords do not match';
  }

  // function validUserName(value: string) {
  //   if(!value) return 'Username is required'
  //   if(value.length < 2) return 'At least 2 charters'
  // }

  function validateEmpty(value: string) {
    if (!value) return 'Is required';
  }

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

  return (
    <>
      <GridContainer>
        <div className={styles.container}>
          <div className={styles.background}></div>
          <div className={cn({
            [styles.authFormRegister]: !isSignInMode,
            [styles.authFormLogin]: isSignInMode,
          })}>
            <button className={styles.backToHome} onClick={() => navigate('/Home')}>
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
                    .register({ userName, firstName, lastName, email, password, repeatPassword })
                    .then((data) => {
                      console.log(data)
                      setIsSignInMode(true)
                    })
                    .catch((error) => {
                      setError(error.message);
                      console.log(error)
                    })
                    .finally(() => formikHelpers.setSubmitting(false))
                }}
              >
                {({ touched, errors, isSubmitting, values }) => (
                  <Form className={styles.form}>
                    {/* <div className={styles.control}>
                    <span className={styles.iconRight}>
                      <i className="fa fa-user"></i>
                    </span>
                    <div className={styles.nameContainer}></div>
                  <Field
                    validate={validUserName}
                    name='userName'
                    type='text'
                    id='userName'
                    placeholder='Username'
                    className={cn(styles.field, {
                      [styles.isDanger] : touched.userName && errors.userName,
                    })} 
                  />

                  {touched.userName && errors.userName && (
                    <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  )}
                </div> */}
                    <div className={styles.nameContainer}>
                      <div className={styles.nameControl}>
                        <span className={styles.iconRight}>
                          First name
                        </span>
                        <Field
                          validate={validateEmpty}
                          name="firstName"
                          type="text"
                          id="firstName"
                          // placeholder="First name"
                          className={cn(styles.field, {
                            [styles.isDanger]: touched.firstName && errors.firstName,
                          })}
                        />

                      </div>
                      <div className={styles.nameControl}>
                        <span className={styles.iconRight}>
                          Last name
                        </span>
                        <Field
                          validate={validateEmpty}
                          name="lastName"
                          type="text"
                          id="lastName"
                          // placeholder="Last name"
                          className={cn(styles.field, {
                            [styles.isDanger]: touched.lastName && errors.lastName,
                          })}
                        />

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
                        // placeholder="bobsmith@gmail.com"
                        className={cn(styles.field, {
                          [styles.isDanger]: touched.email && errors.email,
                        })}
                      />
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
                    <div className={styles.control}>
                      <span className={styles.iconRight}>
                        Repeat password
                      </span>
                      <Field
                        validate={(value: string) => validateRepeat(value, values.password)}
                        name="repeatPassword"
                        type={showRepeatPassword ? "text" : "password"}
                        id="repeatPassword"
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
                      {typeof errors.password === 'string' ? `${errors.password} ` : ''}
                      {typeof errors.repeatPassword === 'string' ? errors.repeatPassword : ''}
                    </span>

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
                          || !!errors.email
                          || !!errors.password
                          || !!errors.userName
                          || !!errors.firstName
                          || !!errors.lastName
                          || !!errors.repeatPassword
                        }
                      >
                        <span className={styles.buttonText}>Register</span>
                      </button>
                    </div>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                  </Form>
                )}


              </Formik>) :
              (<Formik
                innerRef={formikRef}
                initialValues={{
                  email: '',
                  password: ''
                }}
                validateOnMount={true}
                onSubmit={({ email, password }, formikHelpers) => {
                  formikHelpers.setSubmitting(true);
                  authService
                    .login({ email, password })
                    .then(() => {
                      // const state = location.state;
                      // console.log(location)
                      navigate('/Home');
                    })
                    .catch((error) => {
                      setError(error.message);
                      console.log('Error:', error);
                    })
                    .finally(() => setTimeout(() => formikHelpers.setSubmitting(false), 1000))

                }}
              >
                {({ touched, errors, isSubmitting }) => (
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
                        // placeholder="bobsmith@gmail.com"
                        className={cn(styles.field, {
                          [styles.isDanger]: touched.email && errors.email,
                        })}
                      />

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

                    <div className={styles.errorMessageBlock}>
                      {(touched.password) && (
                        <div className={styles.errorMessage}>
                          {typeof errors.password === 'string' ? errors.password : ''}
                          {typeof errors.repeatPassword === 'string' ? errors.repeatPassword : ''}
                        </div>
                      )}
                    </div>


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
                        disabled={isSubmitting || !!errors.email || !!errors.password}
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
