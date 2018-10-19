import React from 'react';

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import Toggle from './Toggle';
import Traffic from './Traffic';
import ZoomIn from './ZoomIn';
import ZoomOut from './ZoomOut';
import { selectPlan } from '../../../actions/fleet';
import { startMoveRoute } from '../../../actions/moveRoute';

const mapButtonStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 10,
    direction: 'ltr',
    paddingRight: 16,
  },
};

class MapButton extends React.Component {
  render() {
    const { t, map } = this.props;

    return (
      <div style={mapButtonStyle.container}>
        <Toggle
          onClick={this.props.toggleRouteDetail}
          isOpenRouteDetail={this.props.sidePanelOpen}
        />
        <ZoomIn map={map} />
        <ZoomOut map={map} />
        <Traffic
          checked={this.props.isShowTraffic}
          onChange={this.props.toggleTraffic}
          label={t('traffic')}
          style={{
            width: 120,
            height: 37,
          }}
        />
        <Traffic
          checked={this.props.isShowOrder}
          onChange={this.props.toggleSequence}
          label={t('sequence')}
          style={{
            width: 120,
            height: 37,
          }}
        />
        <Traffic
          checked={this.props.isShowLabel}
          onChange={this.props.toggleLabel}
          label={t('vehicle_info')}
          style={{
            width: 120,
            height: 37,
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
  sidePanelOpen: state.moveRoute.sidePanelOpen,
});

const mapDispatchToProps = dispatch => ({
  selectPlan: planId => dispatch(selectPlan(planId)),
  startMoveRoute: (stop, unservedStops, fromPlan) => dispatch(startMoveRoute(stop, unservedStops, fromPlan)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('upload')(MapButton));
MapButton.propTypes = {
  t: PropTypes.func,
  toggleRouteDetail: PropTypes.func,
  map: PropTypes.any,

  sidePanelOpen: PropTypes.bool,

  isShowTraffic: PropTypes.bool,
  isShowOrder: PropTypes.bool,
  isShowLabel: PropTypes.bool,

  toggleTraffic: PropTypes.func,
  toggleSequence: PropTypes.func,
  toggleLabel: PropTypes.func,
};
