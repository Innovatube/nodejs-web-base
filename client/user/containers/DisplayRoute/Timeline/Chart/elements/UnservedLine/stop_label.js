import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Popover, PopoverBody } from 'reactstrap';
import constant from '../../../helper/constant';
import { startMoveRoute } from '../../../../../../../actions/moveRoute';
import { selectStop } from '../../../../../../../actions/stop';

const styles = {
  container: {
    height: 26,
    marginTop: (constant.itemHeight - 26) / 2,
    marginLeft: 8,
    paddingLeft: 8,
    paddingRight: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 3,
    color: 'white',
    fontSize: 12,
  },
};

class StopLabel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showPopOver: false,
    };
  }

  show() {
    if (!this.state.showPopOver) {
      this.setState({
        showPopOver: true,
      });
    }
  }

  hide() {
    if (this.state.showPopOver) {
      this.setState({
        showPopOver: false,
      });
    }
  }

  render() {
    const { stop } = this.props;

    return (
      <React.Fragment>
        <div
          id={`stop_${stop.id}`}
          style={styles.container}
          onMouseEnter={() => this.show()}
          onMouseLeave={() => this.hide()}
          onMouseOut={() => this.hide()}
          onClick={() => {
            this.props.selectStop(stop.id);
          }}
        >
          {stop.client_stop_id}
        </div>
        <Popover placement="right" isOpen={this.state.showPopOver} target={`stop_${stop.id}`} toggle={() => this.toggle()}>
          <PopoverBody>
            <h6>{stop.client_stop_id}</h6>
            {stop.name}
          </PopoverBody>
        </Popover>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  stops: state.stops.data,
  fleet: state.fleet.data,
});

const mapDispatchToProps = dispatch => ({
  startMoveRoute: (stop, unserved) => dispatch(startMoveRoute(stop, unserved)),
  selectStop: stop => dispatch(selectStop(stop)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StopLabel);
StopLabel.propTypes = {
  stop: PropTypes.object,
  selectStop: PropTypes.func,
};
