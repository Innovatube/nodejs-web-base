import React from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

class DragAndDropToolTip extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div>
        <Tooltip placement="top" autohide={false} isOpen={this.props.tooltipOpen} target={this.props.target} delay={10000}>
          {t('drag_drop')}
        </Tooltip>
      </div>
    );
  }
}

export default translate('resequence')(DragAndDropToolTip);
DragAndDropToolTip.propTypes = {
  tooltipOpen: PropTypes.bool,
  target: PropTypes.string,
  t: PropTypes.func,
};
