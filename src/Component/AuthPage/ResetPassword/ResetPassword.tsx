import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import styles from './ResetPassword.module.scss';
import { GridContainer } from '../../GridContainer/GridContainer';
import { Field, Form, Formik, FormikProps } from 'formik';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../../../Reducer/UsersSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';

const VALID_REFRESH_TOKEN = "testRefreshToken"; // Тестовий валідний refreshToken

export const ResetPassword = () => {
  // const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const formikRef = useRef<FormikProps<any>>(null);

  // Отримуємо параметри з URL
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const refreshToken = queryParams.get('refreshToken');
  const state = useSelector((state: RootState) => state.userData);

  // console.log('userData',state);
  // console.log('refreshToken:', refreshToken);
  // console.log('email:', email);
  // console.log('queryParams:', queryParams);

  const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

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
          <div className={styles.resetForm}>
            <button className={styles.backToHome} onClick={() => navigate('/Home')}>
              <img src="/img/icons/Close.svg" alt="Close" />
            </button>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>
                Set new password
              </h2>
              <p>And then try login again</p>
            </div>
            <Formik
              innerRef={formikRef}
              initialValues={{
                password: '',
                repeatPassword: '',
              }}
              validateOnMount={true}
              onSubmit={({ password, repeatPassword }, formikHelpers) => {
                formikHelpers.setSubmitting(true);

                // Валідація refreshToken
                if (refreshToken !== VALID_REFRESH_TOKEN) {
                  setError('Invalid refresh token.');
                  // setMessage('');
                  formikHelpers.setSubmitting(false);
                  return;
                }

                // Оновлення пароля
                if (password === repeatPassword && email) {
                  dispatch(updatePassword({ email, password }));
                  // setMessage('Password successfully changed');
                  setError('');
                } else {
                  // setMessage('');
                  setError('Passwords do not match or invalid email.');
                }
                setTimeout(() => {
                  navigate('/auth');
                  formikHelpers.setSubmitting(false);
                }, 1000);
              }}
            >
              {({ touched, errors, isSubmitting, handleChange, values }) => (
                <Form className={styles.form}>
                  <div className={styles.control}>
                    <span className={styles.iconRight}>
                      Enter new password
                    </span>
                    <Field
                      validate={validatePassword}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder=" "
                      className={cn(styles.field, {
                        [styles.isDanger]: touched.password && errors.password,
                      })}
                      onChange={(e: any) => {
                        handleChange(e);
                        setError('');
                      }}
                    />
                    <span className={styles.iconLeft} onClick={toggleShowPassword}>
                      {showPassword
                        ? <img src="/img/icons/Eye-Show.svg" alt="eye-slash" />
                        : <img src="/img/icons/Eye-Hide.svg" alt="eye" />}
                    </span>
                  </div>
                  <div className={styles.control}>
                    <span className={styles.iconRight}>
                      Repeat your new password
                    </span>
                    <Field
                      validate={(value: string) => validateRepeat(value, values.password)}
                      name="repeatPassword"
                      type={showRepeatPassword ? "text" : "password"}
                      id="repeatPassword"
                      placeholder=" "
                      className={cn(styles.field, {
                        [styles.isDanger]: touched.repeatPassword && errors.repeatPassword,
                      })}
                      onChange={(e: any) => {
                        handleChange(e);
                        setError('');
                      }}
                    />
                    <span className={styles.iconLeft} onClick={toggleShowRepeatPassword}>
                      {showRepeatPassword
                        ? <img src="/img/icons/Eye-Show.svg" alt="eye-slash" />
                        : <img src="/img/icons/Eye-Hide.svg" alt="eye" />}
                    </span>
                    <span className={styles.errorMessageBlock}>
                      {/* Якщо нічого не заповнено і є хоча б одна помилка */}
                      {touched.password && errors.password
                        ? `${errors.password}`
                        : touched.repeatPassword && errors.repeatPassword
                          ? `${errors.repeatPassword}`
                          : ''}

                      {/* Якщо є помилки в паролі */}

                      {/* Якщо є помилки в повторі пароля */}
                      { }

                      {/* Якщо одночасно є помилки в паролі і повторі пароля
                      {touched.password && touched.repeatPassword && errors.password && errors.repeatPassword && (
                        `${errors.password}. ${errors.repeatPassword}.`
                      )} */}
                    </span>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      type="submit"
                      className={cn(styles.isSuccess, {
                        [styles.isLoading]: isSubmitting,
                      })}
                      disabled={isSubmitting || !!errors.password || !!errors.repeatPassword}
                    >
                      <span className={styles.buttonText}>Confirm</span>
                    </button>
                  </div>
                  {error && <div className={styles.errorMessage}>{error}</div>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </GridContainer>
    </>
  );
};
