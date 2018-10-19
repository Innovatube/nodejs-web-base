import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';

import {
  closeMoveRoute,
  hideLoading,
  selectToPlan,
  showLoading,
  errorMoveRoute,
} from '../../../../../actions/moveRoute';
import { fetchData } from '../../../../../actions/fleet';

import DragAndDropView from './drag_and_drop';
import PlanDetailView from './plan_detail';
import Error from './error';

import APIChangeRoute from '../../../../../api/api-change-route';
import APIVehicle from '../../../../../api/api-vehicle';
import APIImport from '../../../../../api/api-user.import';

import '../../../ImportFile/RouteSettingModal/Input/input.css';
import '../../../ImportFile/importfile.css';

import Helper from '../../../../../helpers';

const styles = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  container: {
    width: 465,
    right: 5,
    position: 'absolute',
    zIndex: 0,
    background: '#062A30',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  footer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
};

class Step3 extends React.Component {
  async checkApi(taskId) {
    try {
      const { fleet } = this.props;
      const result = await APIImport.checkStatusProgress({
        taskId,
      });

      if (result.error) {
        this.props.errorMoveRoute(result.message);
      } else if (result.data.status === 'success') {
        this.props.fetchData(fleet.job_id);
        this.props.closeMoveRoute();
        this.props.hideLoading();
      } else {
        setTimeout(() => this.checkApi(taskId), 5000);
      }
    } catch (error) {
      this.props.errorMoveRoute(error.message);
    }
  }

  async didPressSave() {
    const {
      fleet,
      toPlan,
      fromPlan,
    } = this.props;

    let result = false;
    this.props.showLoading();
    try {
      if (fromPlan.id !== -1 && toPlan.id !== -2) {
        // move from exist plan to exist plan
        result = await APIChangeRoute.moveStop(fleet.job_id, fromPlan.id, fromPlan.stops, toPlan.id, toPlan.stops);
      } else if (fromPlan.id === -1 && toPlan.id === -2) {
        // move unserved stops and create new vehicle
        result = await APIVehicle.createVehicle(fleet.job_id, {
          ...toPlan,
          client_vehicle_id: toPlan.clientVehicleId,
          id: undefined,
        }, toPlan.stops);
      } else if (fromPlan.id === -1 && toPlan.id !== -2) {
        // move unserved stops to exist plan
        const unserved = fleet.unserved.split(',');
        const addedUnserved = toPlan.stops.filter(stopId => unserved.some(unservedStopId => unservedStopId === stopId));
        result = await APIChangeRoute.addUnserved(fleet.job_id, toPlan.id, toPlan.stops, addedUnserved);
      } else if (fromPlan.id !== -1 && toPlan.id === -2) {
        // move from existing plan to new vehicle
        result = await APIChangeRoute.moveServedToNewRoute(fleet.job_id, fromPlan.id, fromPlan.stops, {
          ...toPlan,
          client_vehicle_id: toPlan.clientVehicleId,
          id: undefined,
        }, toPlan.stops);
      }

      if (result.error) {
        this.props.errorMoveRoute(result.error_code);
      } else if (result.data && result.data.task_id) {
        await this.checkApi(result.data.task_id);
      }
    } catch (error) {
      this.props.errorMoveRoute(error);
    }
  }

  render() {
    const {
      fromPlan,
      toPlan,
      data: { errorMoveUnserved },
      error,
      data,
      t,
    } = this.props;

    return (this.props.status === 'ARRANGE') && (
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
          {t('move')}
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <span style={{ color: 'lightgray' }}>
              {t('drag_and_drop_to_manage')}
            </span>
            <div style={styles.headerContainer}>
              <PlanDetailView planId={fromPlan.id} planData={fromPlan} />
              <PlanDetailView planId={toPlan.id} planData={toPlan} />
            </div>
            <Error data={data} error={error} />
            <DragAndDropView />
          </div>
        </ModalBody>
        <ModalFooter className="route-setting__modal--footer">
          <Button
            style={{
              background: '#022f37',
              color: 'white',
              border: '1px solid #5D6164',
            }}
            onClick={() => this.props.closeMoveRoute()}
          >
            {t('cancel')}
          </Button>{' '}
          <Button style={{ background: '#FFFFFF' }} onClick={() => this.didPressSave()} disabled={errorMoveUnserved}>
            {t('update')}
          </Button>
        </ModalFooter>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  status: state.moveRoute.status,
  fleet: state.fleet.data,
  toPlan: state.moveRoute.toPlan,
  fromPlan: state.moveRoute.fromPlan,
  error: state.moveRoute.error,
  data: Helper.moveRoute(state),
});

const mapDispatchToProps = dispatch => ({
  selectToPlan: plan => dispatch(selectToPlan(plan)),
  closeMoveRoute: () => dispatch(closeMoveRoute()),
  fetchData: jobId => dispatch(fetchData(jobId)),
  showLoading: () => dispatch(showLoading()),
  hideLoading: () => dispatch(hideLoading()),
  errorMoveRoute: error => dispatch(errorMoveRoute(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('moveModel')(Step3));
Step3.propTypes = {
  data: PropTypes.any,
  status: PropTypes.any,
  closeMoveRoute: PropTypes.func,
  fetchData: PropTypes.func,
  toPlan: PropTypes.any,
  fromPlan: PropTypes.any,
  fleet: PropTypes.object,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
  errorMoveRoute: PropTypes.func,
  error: PropTypes.any,
  t: PropTypes.func,
};
