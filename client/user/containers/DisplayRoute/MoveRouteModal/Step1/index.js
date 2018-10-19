import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { ModalHeader } from 'reactstrap';
import { closeMoveRoute, selectToPlan } from '../../../../../actions/moveRoute';
import RouteItem from './route_item';
import NewPlanItem from './new_plan';

const styles = {
  container: {
    width: 275,
    right: 5,
    position: 'absolute',
    zIndex: 0,
  },
  headerContainer: {
    height: 29,
    backgroundColor: 'black',
    display: 'flex',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingLeft: 8,
    paddingRight: 8,

    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'gray',
  },
  title: {
    color: 'white',
  },
  closeIcon: {
    color: 'white',
  },
  bodyContainer: {
    maxHeight: 400 - 29,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
};

class Index extends React.Component {
  filteredPlans() {
    const { fleet: { plans }, fromPlan } = this.props;

    if (!fromPlan) {
      return plans;
    }

    return plans.filter(plan => plan.id !== fromPlan.id);
  }

  render() {
    const { fleet: { plans } } = this.props;
    const { t } = this.props;

    return (this.props.status === 'MOVE_TO') && (
      <React.Fragment>
        <ModalHeader
          toggle={() => {
            if (confirm('This action cannot be undo. Are you sure?')) {
              this.props.closeMoveRoute();
            }
          }}
          className="route-setting__modal--header"
          style={{ color: 'lightgray' }}
        >
          {t('move_to')} ...
        </ModalHeader>
        <div style={styles.bodyContainer}>
          <NewPlanItem />
          {plans && this.filteredPlans().map(plan => (
            <RouteItem
              key={plan.id}
              plan={plan}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
  status: state.moveRoute.status,
  selectedStop: state.moveRoute.selectedStop,
  fromPlan: state.moveRoute.fromPlan,
});

const mapDispatchToProps = dispatch => ({
  selectToPlan: plan => dispatch(selectToPlan(plan)),
  closeMoveRoute: () => dispatch(closeMoveRoute()),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('moveModel')(Index));
Index.propTypes = {
  status: PropTypes.any,
  fleet: PropTypes.object,
  fromPlan: PropTypes.object,

  closeMoveRoute: PropTypes.func,
  t: PropTypes.func,
};
