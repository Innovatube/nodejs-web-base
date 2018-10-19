import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { ProgressBar } from '../../../../components/index';
import constant from '../helper/constant';
import { showPlan, hidePlan } from '../../../../../actions/fleet';

const styles = {
  container: {
    backgroundColor: '#111c20',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    height: constant.itemHeight,
    width: constant.sideMenuWidth,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 16,
    position: 'relative',
  },
  nameContainer: {
    width: constant.sideMenuWidth - 106,
    color: 'white',
    fontSize: 13,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    height: 34,
    width: 150,
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
  },
  progressBarTitle: {
    color: 'white',
    width: 45,
    textAlign: 'center',
    fontSize: 12,
  },
  progressBar: {
    backgroundColor: 'white',
    flex: '0 0 100%',
    height: 6,
  },
};

class SideMenuItem extends React.Component {
  isHightlight() {
    const { selectedPlanId, plan } = this.props;

    return selectedPlanId === plan.id;
  }

  isHidden() {
    const { hiddenPlans, plan } = this.props;

    return hiddenPlans.some(planId => planId === plan.id);
  }

  didClickToggle() {
    if (this.isHidden()) {
      this.props.showPlan(this.props.plan.id);
    } else {
      this.props.hidePlan(this.props.plan.id);
    }
  }

  render() {
    const {
      plan,
      title,
      t,
    } = this.props;

    if (plan) {
      return (
        <div style={styles.container} onClick={() => this.didClickToggle()}>
          { this.isHightlight() && (
            <div
              style={{
                backgroundColor: '#888888',
                width: constant.sideMenuWidth,
                height: constant.itemHeight - 16,
                position: 'absolute',
                left: 0,
                top: 8,
                borderLeftWidth: 1,
                opacity: 0.2,
                pointerEvents: 'none',
              }}
            />
          )}
          <div style={styles.nameContainer}>
            <i className="fas fa-eye" style={{ marginRight: 8, color: this.isHidden() ? 'gray' : 'white' }} />
            <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: 90 }}>
              {plan.client_vehicle_id}
            </div>
          </div>
          <div style={styles.progressBarContainer}>
            <ProgressBar
              percentage={plan.percentage_volume}
              left={t('volume')}
              isHidden={this.isHidden()}
              leftTitleStyle={styles.progressBarTitle}
              progressStyle={styles.progressBar}
            />
            <ProgressBar
              percentage={plan.percentage_weight}
              left={t('weight')}
              isHidden={this.isHidden()}
              leftTitleStyle={styles.progressBarTitle}
              progressStyle={styles.progressBar}
            />
          </div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div style={styles.nameContainer}>
          {title}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedPlanId: state.fleet.selectedPlanId,
  hiddenPlans: state.fleet.hiddenPlans,
});

const mapDispatchToProps = dispatch => ({
  showPlan: planId => dispatch(showPlan(planId)),
  hidePlan: planId => dispatch(hidePlan(planId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('timeline')(SideMenuItem));
SideMenuItem.propTypes = {
  title: PropTypes.string,
  plan: PropTypes.object,

  selectedPlanId: PropTypes.any,
  hiddenPlans: PropTypes.array,

  showPlan: PropTypes.func,
  hidePlan: PropTypes.func,
  t: PropTypes.func,
};
