import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';

import { useTranslation } from 'react-i18next';
import '../Assets/stylesheets/Signup.scss';

const LoginSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  email: Yup.string()
    .email('NO_MESSAGE')
    .required('Email is required'),
});

const Login = ({ firebase }) => {
  const [isSubmitting, changeIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const submit = values => {
    changeIsSubmitting(true);
    LoginSchema.validate(values, {
      strict: true,
      stripUnknown: true,
    })
      .then(() => {
        firebase
          .signIn(values)
          .then(() => <Redirect to={{ pathname: '/' }} />)
          .catch(error => {
            toast.error(error);
            changeIsSubmitting(false);
          });
      })
      .catch(({ message }) => {
        if (message !== 'NO_MESSAGE') {
          toast.error(message);
        }
        changeIsSubmitting(false);
      });
  };
  const handleKeyPress = ({ keyCode, charCode }, values) => {
    if (keyCode === 13 || charCode === 13) {
      submit(values);
    }
  };
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={submit}
      render={({ values, handleBlur, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit} autoCapitalize="off">
          <div className="form-container login">
            <div className="text-field-container">
              <TextField
                autoFocus
                id="email"
                label={t('email')}
                type="email"
                className="text-field"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="password"
                type="password"
                label={t('password')}
                className="text-field"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                margin="normal"
                variant="outlined"
                onKeyDown={e => handleKeyPress(e, values)}
              />
            </div>
            <div className="button-container">
              <Button
                variant="contained"
                color="primary"
                className="button"
                onClick={handleSubmit}
                disabled={isSubmitting}>
                {t('login')}
              </Button>
            </div>
          </div>
        </form>
      )}
    />
  );
};
Login.propTypes = {
  firebase: PropTypes.object,
};

export default withFirebase(Login);
