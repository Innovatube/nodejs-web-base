import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import SideMenuItem from './item';
import Header from './header';
import constant from '../helper/constant';

class SideMenu extends React.Component {
  render() {
    const {
      scrollTop,
      fleet,
      t,
    } = this.props;


    return (
      <div style={{ width: constant.sideMenuWidth, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 'auto', overflow: 'hidden' }}>
          <div style={{ marginTop: -scrollTop }}>
            {(fleet && fleet.unserved && fleet.unserved.length > 0) && (
              <SideMenuItem title={t('un_served')} />
            )}
            {fleet.plans && fleet.plans.map(plan => (
              <SideMenuItem
                key={plan.id}
                plan={plan}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
});

export default connect(mapStateToProps)(translate('timeline')(SideMenu));
SideMenu.propTypes = {
  fleet: PropTypes.object,
  scrollTop: PropTypes.number,
  t: PropTypes.func,
};
