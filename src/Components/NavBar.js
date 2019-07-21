import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

import { withTranslation } from 'react-i18next';

import { SignedInNavBar, SignedOutNavBar } from '../Navigation';
import { withFirebase } from '../Firebase';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: null,
    };
  }

  handleChange = language => {
    const { firebase, i18n } = this.props;
    if ((localStorage.getItem('language') || 'en') !== language) {
      i18n.changeLanguage(language).then(() => {
        localStorage.setItem('language', language);
        this.handleClose();
        if (firebase.isLoggedIn) {
          firebase
            .updateUserOnDB({ language })
            .then(() => {
              window.location.reload();
            })
            .catch(() => {});
        } else {
          window.location.reload();
        }
      });
    }
  };

  handleClick = e => {
    this.setState({
      menu: e.currentTarget,
    });
  };
  handleClose = () => {
    this.setState({
      menu: null,
    });
  };

  render() {
    const { handleChange, handleClose, handleClick, state, props } = this;
    const { menu } = state;
    const { t, user } = props;
    return (
      <div className="nav">
        {user ? <SignedInNavBar /> : <SignedOutNavBar />}
        <div className="language-switch">
          <Button
            aria-owns={menu ? 'simple-menu' : undefined}
            aria-haspopup="true"
            className="language-button"
            onClick={handleClick}>
            {t('language')}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={menu}
            open={Boolean(menu)}
            onClose={handleClose}>
            <MenuItem onClick={() => handleChange('en')}>
              {t('english')}
            </MenuItem>
            <MenuItem onClick={() => handleChange('ar')}>
              {t('arabic')}
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}
NavBar.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func,
  i18n: PropTypes.object,
  firebase: PropTypes.object,
};

export default withTranslation()(withFirebase(NavBar));
