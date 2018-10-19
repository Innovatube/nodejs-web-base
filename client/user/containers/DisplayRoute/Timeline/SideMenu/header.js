import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import constant from '../helper/constant';
import { hideAllPlan, showAllPlan } from '../../../../../actions/fleet';

const styles = {
  container: {
    backgroundColor: '#111c20',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    height: constant.headerHeight,
    width: constant.sideMenuWidth,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 16,
    flex: `0 0 ${constant.headerHeight}px`,
  },
  nameContainer: {
    width: constant.sideMenuWidth - 140,
    color: 'white',
  },
  progressBarContainer: {
    height: 34,
    width: 150,
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
    color: 'gray',
    textAlign: 'center',
  },
};

class Header extends React.Component {
  allPlanHidden() {
    const { hiddenPlans, fleet: { plans } } = this.props;

    return plans.length === hiddenPlans.length;
  }

  render() {
    const { t } = this.props;

    return (
      <div
        style={styles.container}
        onClick={() => {
          if (this.allPlanHidden()) {
            this.props.showAllPlan();
          } else {
            this.props.hideAllPlan();
          }
        }}
      >
        <div style={styles.nameContainer}>
          <i className="fas fa-eye" style={{ marginRight: 8, color: this.allPlanHidden() ? 'gray' : 'white' }} />
          {t('route')}
        </div>
        <div style={styles.progressBarContainer} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
  hiddenPlans: state.fleet.hiddenPlans,
});

const mapDispatchToProps = dispatch => ({
  showAllPlan: () => dispatch(showAllPlan()),
  hideAllPlan: () => dispatch(hideAllPlan()),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('timeline')(Header));
Header.propTypes = {
  fleet: PropTypes.any,
  hiddenPlans: PropTypes.any,

  showAllPlan: PropTypes.func,
  hideAllPlan: PropTypes.func,
  t: PropTypes.func,
};
