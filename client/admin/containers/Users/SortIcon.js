import React from 'react';
import PropTypes from 'prop-types';

class SortIcon extends React.Component {
  render() {
    return (
      <React.Fragment>
        {(this.props.isSort && this.props.order === 'desc' && (<i className="fas fa-caret-down" />))}
        {(this.props.isSort && this.props.order === 'asc' && (<i className="fas fa-caret-up" />))}
        {(!this.props.isSort && (<i className="fas fa-sort" />))}
      </React.Fragment>
    );
  }
}

export default SortIcon;
SortIcon.propTypes = {
  order: PropTypes.string,
  isSort: PropTypes.bool,
};
