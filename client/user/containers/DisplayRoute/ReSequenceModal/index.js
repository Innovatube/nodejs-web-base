import React from 'react';
import {
  ListGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import ReSequenceBody from './ReSequenceBody';
import ColorHelper from '../Timeline/helper/color';
import BlackButton from '../../../components/Buttons/BlackButton';
import WhiteButton from '../../../components/Buttons/WhiteButton';
import routeApi from '../../../../api/api-change-route';
import importApi from '../../../../api/api-user.import';
import './index.css';
import Errors from '../../../components/Errors';

class ReSequenceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
      isAutoReRoute: false,
    };
    this.toggleAutoReRoute = this.toggleAutoReRoute.bind(this);
  }

  componentDidMount() {
    const { data, selectedRoute, stops } = this.props;
    if (data && selectedRoute !== null && stops) {
      const plan = data.plans[selectedRoute];
      const newState = this.transformData({
        plan,
        stops,
      });
      if (newState) {
        this.setState({
          data: newState,
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data, selectedRoute, stops } = nextProps;
    if (data && selectedRoute !== null && stops) {
      const plan = data.plans[selectedRoute];
      const newState = this.transformData({
        plan,
        stops,
      });
      if (newState) {
        this.setState({
          data: newState,
          error: null,
          isAutoReRoute: false,
        });
      }
    }
  }

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId
      && destination.index === source.index) {
      return; //eslint-disable-line
    }
    const column = this.state.data.columns[source.droppableId];
    const newLegIds = Array.from(column.legIds);
    newLegIds.splice(source.index, 1);
    newLegIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      legIds: newLegIds,
    };
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        columns: {
          ...this.state.data.columns,
          [newColumn.id]: newColumn,
        },
      },
    });
  }

  transformData = (state) => {
    const { plan, stops } = state;
    const legs = {};
    const columns = {
      'column-1': {
        id: 'column-1',
        title: 'Todo',
        legIds: [],
      },
    };
    const columnOrder = ['column-1'];
    if (plan && plan.legs && stops) {
      const planId = plan.id;
      const data = stops
        .filter(stop => (stop.plan_id === planId))
        .sort((current, next) => current.seq - next.seq);
      data.map((leg, legIndex) => {
        const id = `leg-${legIndex}`;
        legs[id] = {
          id,
          content: leg.client_stop_id,
          customerName: leg.name,
          volume: leg.volume,
          weight: leg.weight,
          index: legIndex,
          client_stop_id: leg.client_stop_id,
        };
        columns['column-1'].legIds.push(id);

        return leg;
      });

      return {
        legs,
        columns,
        columnOrder,
      };
    }

    return null;
  }

  handleSubmit = async () => {
    const { data, selectedRoute } = this.props;
    const [columnId] = this.state.data.columnOrder;
    const params = this.state.data.columns[columnId].legIds.map((leg, legIndex) => ({
      client_stop_id: this.state.data.legs[leg].client_stop_id,
      seq: legIndex + 1,
    }));
    this.props.toggleLoading();
    const result = await routeApi.reSequence({
      job_id: this.props.params.id,
      plan_id: data.plans[selectedRoute].id,
      stops: params,
    });
    if (!result.error) {
      this.setState({
        error: null,
      });
      this.checkStatusProgress(this.props.params.id, result.data.task_id);
    } else {
      this.setState({
        error: result,
      }, () => {
        this.props.toggleLoading();
      });
    }
  }

  handleAutoReRoute = async () => {
    const { data, selectedRoute } = this.props;
    this.props.toggleLoading();
    const result = await routeApi.autoReRoute(this.props.params.id, data.plans[selectedRoute].id);
    if (!result.error) {
      this.setState({
        error: null,
      });
      this.checkStatusProgress(this.props.params.id, result.data.task_id);
    } else {
      this.setState({
        error: result,
      }, () => {
        this.props.toggleLoading();
      });
    }
  }

  checkStatusProgress = async (id, taskId) => {
    const status = await importApi.checkStatusProgress({
      taskId,
    });
    if (status.error) {
      this.props.closeReSequence();
      this.props.toggleLoading();
      this.props.handleReSequenceSuccess();
    } else if (status.data.status === 'running' || status.data.status === 'partial-running') {
      setTimeout(() => {
        this.checkStatusProgress(id, taskId);
      }, 2000);
    } else if (status.data.status === 'success') {
      this.props.closeReSequence();
      this.props.toggleLoading();
      this.props.handleReSequenceSuccess();
    }
  }

  toggleAutoReRoute() {
    this.setState(prev => ({
      isAutoReRoute: !prev.isAutoReRoute,
    }));
  }


  render() {
    const {
      data, selectedRoute, stops, vehicles, t,
    } = this.props;
    const { isAutoReRoute } = this.state;

    return (
      <ListGroup style={{
        height: '100%',
      }}
      >
        <div className="resequence__item">
          <h3 className="resequence__p">{t('re_sequence')}</h3>
          {
            stops && selectedRoute !== null && data && data.plans && data.plans[selectedRoute]
            && data.plans[selectedRoute].legs && data.plans[selectedRoute].legs
            && (
            <ReSequenceBody
              plan={data.plans[selectedRoute]}
              stops={stops}
              color={ColorHelper.pathColor(selectedRoute, data.plans.length)}
              data={this.state.data}
              vehicles={vehicles}
              onDragEnd={this.onDragEnd}
              toggleAutoReRoute={this.toggleAutoReRoute}
              isAutoReRoute={this.isAutoReRoute}
            />
            )
          }
          {
            this.state.error && (
            <Errors
              errors={this.state.error}
            />
            )
          }
          <div style={{
            width: '100%',
            paddingRight: 8,
            paddingTop: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
          >
            <BlackButton
              text={t('btn_cancel')}
              style={{
                width: 120,
                height: 35,
              }}
              onClick={this.props.closeReSequence}
            />
            <WhiteButton
              text={t('btn_update')}
              style={{
                width: 120,
                height: 35,
              }}
              onClick={isAutoReRoute ? this.handleAutoReRoute : this.handleSubmit}
            />
          </div>
        </div>
      </ListGroup>
    );
  }
}

const mapStateToProps = state => ({
  data: state.fleet.data,
  stops: state.stops.data,
  vehicles: state.vehicles.data,
});

export default connect(mapStateToProps)(translate('resequence')(ReSequenceModal));
ReSequenceModal.propTypes = {
  selectedRoute: PropTypes.any,
  closeReSequence: PropTypes.func,
  data: PropTypes.object,
  stops: PropTypes.array,
  handleReSequenceSuccess: PropTypes.func,
  params: PropTypes.object,
  toggleLoading: PropTypes.func,
  vehicles: PropTypes.array,
  t: PropTypes.func,
};
