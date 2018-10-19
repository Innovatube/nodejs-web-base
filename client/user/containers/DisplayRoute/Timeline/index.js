import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import SideMenu from './SideMenu';
import Chart from './Chart';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#062A30',
    flex: '0 0 200px',
    maxHeight: 200,
  },
};

class Timeline extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      scrollTop: 0,
    };
  }

  render() {
    const { stops, plans } = this.props;

    return (
      <React.Fragment>
        <div style={styles.container}>
          <SideMenu
            plans={plans}
            stops={stops}
            scrollTop={this.state.scrollTop}
          />
          <Chart
            plans={plans}
            stops={stops}
            onScroll={event => this.setState({ scrollTop: event.target.scrollTop })}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Timeline;
Timeline.propTypes = {
  plans: PropTypes.array,
  stops: PropTypes.array,
};
