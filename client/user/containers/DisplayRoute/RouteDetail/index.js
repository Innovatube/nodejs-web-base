import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'reactstrap';
import { connect } from 'react-redux';
import './index.css';
import RouteItem from './RouteItem';
import ColorHelper from '../Timeline/helper/color';

const colors = [
  '#ff7543',
  '#0000FF',
  '#00C853', '#94469A', '#55AFCE', '#ECBC4E', '#DA4A79', '#51ADAD', '#F2C494', '#6E292C',
];


class RouteDetail extends React.Component {
  render() {
    const { data, stop, vehicles } = this.props;

    return (
      <ListGroup>
        <div />
        {
          data && data.plans && data.plans.map((route, index) => (
            <RouteItem
              route={route}
              index={index}
              colors={colors}
              key={index}
              ColorHelper={ColorHelper}
              plans={data.plans}
              stop={stop}
              vehicles={vehicles}
            />
          ))
        }
      </ListGroup>
    );
  }
}

const mapStateToProps = state => ({
  data: state.fleet.data,
  stop: state.stops.data,
  vehicles: state.vehicles.data,
});

export default connect(mapStateToProps)(RouteDetail);
RouteDetail.propTypes = {
  vehicles: PropTypes.array,
  data: PropTypes.object,
  stop: PropTypes.array,
};
