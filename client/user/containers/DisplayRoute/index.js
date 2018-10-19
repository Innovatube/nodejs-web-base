import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../../components/Header/index';
import { DynamicMap } from '../../components/Map';
import Timeline from './Timeline';
import FooterMenu from './FooterMenu';
import './index.css';
import LoadingFull from '../../components/LoadingFull';
import SidePanel from './SidePanel';
import { fetchData } from '../../../actions/fleet';
import {
  closeMoveRoute,
  closePanel,
  openPanel,
  openReSequence,
} from '../../../actions/moveRoute';
import ErrorDialog from '../../components/ErrorDialog';

class DisplayRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenRouteDetail: true,
      isShowTimeline: true,
      isShowReSequence: false,
      selectedRoute: null,
      loading: false,
      map: false,
      isShowTraffic: false,
      isShowOrder: false,
      isShowLabel: false,
    };
    window.onbeforeunload = () => true;
  }

  componentDidMount() {
    this.props.fetchData(this.props.match.params.id);
  }

  setSelectedRoute = (index) => {
    this.setState({
      selectedRoute: index,
    });

    this.props.openReSequence();
  }

  handleReSequenceSuccess = () => {
    this.props.fetchData(this.props.match.params.id);
  }

  toggleRouteDetail = () => {
    this.setState(prevState => ({
      isOpenRouteDetail: !prevState.isOpenRouteDetail,
    }));

    if (this.props.sidePanelOpen === false) {
      this.props.openPanel();
    } else {
      this.props.closePanel();
    }
  }

  toggleReSequence = () => {
    this.setState(prevState => ({
      isShowReSequence: !prevState.isShowReSequence,
    }));
  }

  closeReSequence = () => {
    this.setState({
      selectedRoute: null,
      isOpenRouteDetail: true,
    });
    this.props.closeMoveRoute();
  }

  toggleLoading = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  }

  toggleTraffic = () => {
    this.toggleLoading();
    this.setState(prev => ({
      isShowTraffic: !prev.isShowTraffic,
    }), () => {
      setTimeout(() => {
        this.toggleLoading();
      }, 2000);
    });
  }

  toggleSequence = () => {
    this.toggleLoading();
    this.setState(prev => ({
      isShowOrder: !prev.isShowOrder,
    }), () => {
      setTimeout(() => {
        this.toggleLoading();
      }, 2000);
    });
  }

  toggleLabel = () => {
    this.toggleLoading();
    this.setState(prev => ({
      isShowLabel: !prev.isShowLabel,
    }), () => {
      setTimeout(() => {
        this.toggleLoading();
      }, 2000);
    });
  }

  render() {
    return (
      <div className="display-route" style={{ display: 'flex' }}>
        <Header
          history={this.props.history}
        />
        <div className="nexty__map" style={{ position: 'relative', flex: 'auto' }}>
          <DynamicMap
            setSelectedRoute={this.setSelectedRoute}
            closeReSequence={this.closeReSequence}
            isShowTraffic={this.state.isShowTraffic}
            isShowOrder={this.state.isShowOrder}
            isShowLabel={this.state.isShowLabel}
            mapRef={(ref) => {
              this.setState({
                map: ref,
              });
            }}
          />
          <SidePanel
            selectedRoute={this.state.selectedRoute}
            closeReSequence={this.closeReSequence}
            handleReSequenceSuccess={this.handleReSequenceSuccess}
            toggleLoading={this.toggleLoading}
            map={this.state.map}
            isShowTraffic={this.state.isShowTraffic}
            isShowOrder={this.state.isShowOrder}
            isShowLabel={this.state.isShowLabel}
            toggleTraffic={() => this.toggleTraffic()}
            toggleSequence={() => this.toggleSequence()}
            toggleLabel={() => this.toggleLabel()}
            toggleRouteDetail={this.toggleRouteDetail}
            {...this.props.match}
          />
        </div>
        <FooterMenu
          history={this.props.history}
          toggleShowTimeline={() => this.setState({ isShowTimeline: !this.state.isShowTimeline })}
          jobId={Number(this.props.match.params.id)}
          isShowTimeline={this.state.isShowTimeline}
        />
        { this.state.isShowTimeline && this.props.fleet && this.props.fleet.plans && (
          <Timeline
            plans={this.props.fleet.plans}
            stops={this.props.stop}
          />
        )}
        {
          (this.state.loading || this.props.loading > 0) && <LoadingFull />
        }
        {
          this.props.fleetError && (
          <ErrorDialog
            fleetError={this.props.fleetError}
          />
          )
        }
      </div>
    );
  }
}
const mapStateToProps = state => ({
  fleet: state.fleet.data,
  loading: state.moveRoute.loading,
  sidePanelOpen: state.moveRoute.sidePanelOpen,
  fleetError: state.fleet.error,
});

const mapDispatchToProps = dispatch => ({
  closeMoveRoute: () => dispatch(closeMoveRoute()),
  fetchData: jobId => dispatch(fetchData(jobId)),
  openReSequence: () => dispatch(openReSequence()),
  openPanel: () => dispatch(openPanel()),
  closePanel: () => dispatch(closePanel()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayRoute);
DisplayRoute.propTypes = {
  sidePanelOpen: PropTypes.any,
  match: PropTypes.object,
  history: PropTypes.object,
  fleet: PropTypes.object,
  closeMoveRoute: PropTypes.func,
  setStops: PropTypes.func,
  fetchData: PropTypes.func,
  openReSequence: PropTypes.func,
  openRouteDetail: PropTypes.func,
  stop: PropTypes.array,
  loading: PropTypes.any,
  status: PropTypes.any,
  openPanel: PropTypes.func,
  closePanel: PropTypes.func,
  fleetError: PropTypes.any,
};
