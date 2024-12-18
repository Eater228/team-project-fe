import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styles from './AuthPage.module.scss';
import { GridContainer } from '../GridContainer/GridContainer';
import { Field, Form, Formik, FormikProps } from 'formik';
import { authService } from '../../Service/authService';
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
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formikRef = useRef<FormikProps<any>>(null); // створення рефу для Formik

  //test ->
  // const [credential, setCredential] = useState<any>()
  // const responseMessage = (response:  CredentialResponse) => {
  //   console.log(response);
  //   const decodToken = jwtDecode(response.credential!)
  //   console.log(decodToken);

  //   setCredential(decodToken)
  // };

  // const errorMessage = () => {
  //     console.log('Login Faild');
  // };

  //   const [ credential, setCredential ] = useState([]);
  //   const [ profile, setProfile ] = useState([]);

  //   const googleLogin = useGoogleLogin({
  //     onSuccess: (codeResposne) => setCredential(codeResposne),
  //     onError: (error) => console.log('Login Failed', error)
  //   })

  //   useEffect(() => {
  //     if(credential) {
  //       axios
  //       .get(
  //         `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credential.access_token}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${credential.access_token}`,
  //             Accept: 'application/json',
  //           },
  //         }
  //       )
  //       .then((res) => {
  //           setProfile(res.data);
  //       })
  //       .catch((err) => console.log(err));
  //     }
  //   }, [credential])

  //   const logOut = () => {
  //     googleLogout();
  //     setProfile(null);
  // };

  // console.log("profile", profile)
  // console.log("user", credential)
  //<-

  /* validation */
  /* -> */
  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  function validateEmail(value: string) {
    if (!value) return 'Email is required';
    if (!EMAIL_PATTERN.test(value)) return 'Email is not valid';
  }
  
  function validatePassword(value: string) {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'At least 6 characters';
  }

  function validUserName(value: string) {
    if(!value) return 'Username is required'
    if(value.length < 5) return 'At least 5 charters'
  }

  function validEmpty(value: string) {
    if(value === '') {
      return 'Is required'
    }
  }
  /* <- */


  const toggleFormMode = () => {
    setIsSignInMode((prev) => !prev);
    
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

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
          {/* <div className={styles.googleAuth}> */}
            {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
            {/* <button onClick={() => googleLogin()}>Sign in with Google 🚀 </button>
            <button onClick={logOut}>Log out</button> */}
          {/* </div> */}
          { !isSignInMode ? 
          (<Formik 
            innerRef={formikRef}
            initialValues={{
              userName: '',
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              repeatPasswotd: '',
            }}
            validateOnMount={true}
            onSubmit={({userName, firstName, lastName, email, password, repeatPassword}, formikHelpers) => {
              formikHelpers.setSubmitting(true);
              authService
                .register({userName, firstName, lastName, email, password, repeatPassword})
                .then(() => {setIsSignInMode(false)})
                .catch((error) => {
                  console.log(error)
                })
                .finally(() => formikHelpers.setSubmitting(false))
            }}
          >
            {({ touched, errors, isSubmitting }) => (
                <Form className={styles.form}>
                <div className={styles.control}>
                    <span className={styles.iconRight}>
                      <i className="fa fa-user"></i>
                    </span>
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
                </div>
                <div className={styles.control}>
                    <span className={styles.iconRight}>
                      <i className="fa fa-user"></i>
                    </span>
                <Field
                  validate={validEmpty}
                  name="firstName"
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  className={cn(styles.field, {
                    [styles.isDanger] : touched.firstName && errors.firstName,
                  })} 
                />

                {touched.firstName && errors.firstName && (
                  <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
                </div>
                <div className={styles.control}>
                    <span className={styles.iconRight}>
                      <i className="fa fa-user"></i>
                    </span>
                <Field
                  validate={validEmpty}
                  name="lastName"
                  type="text"
                  id="lastName"
                  placeholder="First name"
                  className={cn(styles.field, {
                    [styles.isDanger] : touched.lastName && errors.lastName,
                  })} 
                />

                {touched.lastName && errors.lastName && (
                  <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
                </div>
                <div className={styles.control}>
                    <span className={styles.iconRight}>
                      <i className="fa fa-envelope"></i>
                    </span>
                <Field
                  validate={validateEmail}
                  name="email"
                  type="email"
                  id="email"
                  placeholder="bobsmith@gmail.com"
                  className={cn(styles.field, {
                    [styles.isDanger] : touched.email && errors.email,
                  })} 
                />

                {touched.email && errors.email && (
                  <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
                )}
                </div>
                <div className={styles.control}>
                    <span className={styles.iconRight}>
                      <i className="fa fa-lock"></i>
                    </span>
                <Field
                  validate={validatePassword}
                  name="password"
                  type="password"
                  id="password"
                  placeholder="*******"
                  className={cn(styles.field, {
                    [styles.isDanger] : touched.password && errors.password,
                  })} 
                />

                {touched.password && errors.password && (
                  <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
                </div>
                <div className={styles.control}>
                    <span className={styles.iconRight}>
                      <i className="fa fa-lock"></i>
                    </span>
                <Field
                  validate={validatePassword}
                  name="repeatPassword"
                  type="password"
                  id="repeatPassword"
                  placeholder="*******"
                  className={cn(styles.field, {
                    [styles.isDanger] : touched.repeatPassword && errors.repeatPassword,
                  })} 
                />

                {touched.repeatPassword && errors.repeatPassword && (
                  <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
                </div>
                
                <div className={styles.fullWidthLine}></div>

                <div className={styles.authWihtContainer}>
                  <div className="google">
                    <i className="fa-brands fa-google fa-2xl"></i>
                  </div>
                  <div className="apple">
                    <i className="fa-brands fa-apple fa-2xl"></i>
                  </div>
                  <div className="facebook">
                    <i className="fa-brands fa-facebook fa-2xl"></i>
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
                    <span className={styles.buttonText}>Sing in</span>
                  </button>
                </div>
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
            onSubmit={({email, password}, formikHelpers) => {
              formikHelpers.setSubmitting(true);
              authService
                .login({email, password})
                .then(() => {
                  // const state = location.state;
                  // console.log(location)
                  // navigate(state.from?.pathname ?? '/');
                })
                .catch((error) => {
                  setError(error);
                });
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form className={styles.form}>
                <div className={styles.control}>
                  <span className={styles.iconRight}>
                    <i className="fa fa-envelope"></i>
                  </span>
                <Field
                  validate={validateEmail}
                  name="email"
                  type="email"
                  id="email"
                  placeholder="bobsmith@gmail.com"
                  className={cn(styles.field, {
                    [styles.isDanger] : touched.email && errors.email,
                  })} 
                />

                {touched.email && errors.email && (
                  <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
                </div>
                <div className={styles.control}>
                  <span className={styles.iconRight}>
                    <i className="fa fa-lock"></i>
                  </span>
                <Field
                  validate={validatePassword}
                  name="password"
                  type="password"
                  id="password"
                  placeholder="*******"
                  className={cn(styles.field, {
                    [styles.isDanger] : touched.password && errors.password,
                  })} 
                />

                {touched.password && errors.password && (
                  <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
                )}
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
