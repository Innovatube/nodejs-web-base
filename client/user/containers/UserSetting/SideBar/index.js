import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import './index.css';

class SideBar extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <ul className={this.props.classStyle}>
        <li className="sidebar__item"><Link to="/user-setting">{t('my_profile')}</Link></li>
      </ul>
    );
  }
}

export default (translate('sidebar')(SideBar));
SideBar.propTypes = {
  classStyle: PropTypes.string,
  t: PropTypes.func,
};
