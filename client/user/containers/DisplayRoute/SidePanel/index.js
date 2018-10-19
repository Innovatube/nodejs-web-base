import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './index.css';
import MoveRouteModal from '../MoveRouteModal';
import { closeMoveRoute } from '../../../../actions/moveRoute';
import ReSequenceModal from '../ReSequenceModal';
import RouteDetail from '../RouteDetail';
import MapButton from '../../../components/MapButton';

const styles = {
  container: width => ({
    display: 'flex',
    direction: 'rtl',
    flexFlow: 'column',
    flexWrap: 'wrap',
    right: 5,
    position: 'absolute',
    zIndex: 0,
    width,
  }),
  panelContainer: backgroundColor => ({
    width: '100%',
    overflowY: 'scroll',
    overflowX: 'hidden',
    backgroundColor,
    direction: 'ltr',
  }),
  mapButtonContainer: {
    minHeight: 250,
    flex: '250px 1 1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
};

class SidePanel extends React.Component {
  isOpen() {
    const {
      moveRoute,
    } = this.props;

    return moveRoute.sidePanelOpen;
  }

  content() {
    switch (this.props.moveRoute.status) {
      case 'ROUTE_DETAIL':
        return <RouteDetail selectedPlanId={this.props.fleet.selectedPlanId} />;

      case 'RE_SEQUENCE':
        return <ReSequenceModal {...this.props} />;

      case 'MOVE_TO':
      case 'NEW_PLAN':
      case 'ARRANGE':
        return <MoveRouteModal onRequestClose={() => this.props.closeMoveRoute()} />;

      default:
        return null;
    }
  }

  contentWidth() {
    if (!this.isOpen()) {
      return 0;
    }

    switch (this.props.moveRoute.status) {
      case 'ROUTE_DETAIL':
      case 'RE_SEQUENCE':
        return 275;

      case 'MOVE_TO':
        return 450;

      default:
        return 550;
    }
  }

  contentBackgroundColor() {
    if (this.props.moveRoute.status === 'ROUTE_DETAIL') {
      return 'transparent';
    }

    return '#062A30';
  }

  render() {
    return (
      <div
        className="nexty__map--sidebar"
        style={styles.container(this.contentWidth())}
      >
        {this.isOpen() && (
          <div style={styles.panelContainer(this.contentBackgroundColor())}>
            {this.content()}
          </div>
        )}
        <div style={styles.mapButtonContainer}>
          <MapButton
            map={this.props.map}
            isShowTraffic={this.props.isShowTraffic}
            isShowOrder={this.props.isShowOrder}
            isShowLabel={this.props.isShowLabel}
            toggleTraffic={this.props.toggleTraffic}
            toggleSequence={this.props.toggleSequence}
            toggleLabel={this.props.toggleLabel}
            toggleRouteDetail={this.props.toggleRouteDetail}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  moveRoute: state.moveRoute,
  fleet: state.fleet.data,
});

const mapDispatchToProps = dispatch => ({
  closeMoveRoute: () => dispatch(closeMoveRoute()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
SidePanel.propTypes = {
  moveRoute: PropTypes.object,
  fleet: PropTypes.object,
  map: PropTypes.any,
  closeMoveRoute: PropTypes.func,

  isShowTraffic: PropTypes.bool,
  isShowOrder: PropTypes.bool,
  isShowLabel: PropTypes.bool,

  toggleTraffic: PropTypes.func,
  toggleSequence: PropTypes.func,
  toggleLabel: PropTypes.func,
  toggleRouteDetail: PropTypes.func,
};
