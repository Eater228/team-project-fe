import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import styles from './ForgotPassword.module.scss';
import { GridContainer } from '../../GridContainer/GridContainer';
import { Field, Form, Formik, FormikProps } from 'formik';
import cn from 'classnames';

export const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formikRef = useRef<FormikProps<any>>(null); // створення рефу для Formik

  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  function validateEmail(value: string) {
    if (!value) return 'Email is required';
    if (!EMAIL_PATTERN.test(value)) return 'Email is not valid';
  }

  return (
    <>
      <GridContainer>
        <div className={styles.container}>
          <div className={styles.background}></div>
          <div className={styles.forgotForm}>
            <button className={styles.backToHome} onClick={() => navigate('/Home')}>
              <img src="/img/icons/Close.svg" alt="Close" />
            </button>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>
                {message ? `We sent you a link on \n${message}` : 'Forgot password?'}
              </h2>
              <p>{message ? 'Check it up👆' : 'No worries, we`ll send you a reset email!'}</p>
            </div>
            <Formik
              innerRef={formikRef}
              initialValues={{
                email: '',
              }}
              validateOnMount={true}
              onSubmit={({ email }, formikHelpers) => {
                formikHelpers.setSubmitting(true);
                // Simulate an API call
                setTimeout(() => {
                  if (email === "test@test1.com") {
                    setMessage(email);
                    setError('');
                    navigate(`/refreshPasssword?email=${email}&refreshToken=testRefreshToken`);
                  } else {
                    setMessage('');
                    setError("Email not found.");
                  }
                  formikHelpers.setSubmitting(false);
                }, 1000);
              }}
            >
              {({ touched, errors, isSubmitting, handleChange }) => (
                <Form className={styles.form}>
                  <div className={styles.control}>
                    <span className={styles.iconRight}>
                      Enter your email
                    </span>
                    <Field
                      validate={validateEmail}
                      name="email"
                      type="email"
                      id="email"
                      placeholder=" "
                      className={cn(styles.field, {
                        [styles.isDanger]: touched.email && errors.email,
                      })}
                      onChange={(e: any) => {
                        handleChange(e);
                        setError('');
                      }}
                    />
                    {/* {touched.email && errors.email && (
                      <span className={cn("is-right has-text-danger", styles.iconLeft)}>
                        <i className="fas fa-exclamation-triangle"></i>
                      </span>
                    )} */}
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      type="submit"
                      className={cn(styles.isSuccess, {
                        [styles.isLoading]: isSubmitting,
                      })}
                      disabled={isSubmitting || !!errors.email}
                    >
                      <span className={styles.buttonText}>Reset password</span>
                    </button>
                  </div>
                  {error && <div className={styles.errorMessage}>{error}</div>}
                  <div className={styles.backToLoginContainer}>
                    <button type='button' className={styles.backToLogin} onClick={() => navigate('/auth')}>
                      Back to Log In
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </GridContainer>
    </>
  );
};
