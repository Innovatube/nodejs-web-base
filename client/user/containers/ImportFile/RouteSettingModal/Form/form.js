import React from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import data from '../data';
import Input from '../Input/index';
import Radio from '../Input/radio';
import Checkbox from '../Input/checkbox';
import CenterLabel from './CenterLabel';
import CenterElement from './CenterElement';
import Error from '../Errors/index';
import Errors from '../../../../components/Errors/index';
import 'react-datepicker/dist/react-datepicker.css';
import '../Input/input.css';
import DateInput from './DateInput';


class Form extends React.Component {
  handleInputChange = name => (e) => {
    this.props.handleSettingRoute({
      path: name,
      value: (name === 'tollway' || name === 'useConstraints' || name === 'zonebased') ? e.target.checked : e.target.value,
    });
  }

  handleDatePicker = (value) => {
    this.props.handleSettingRoute({
      path: 'date',
      value,
    });
  }

  render() {
    const {
      date, fileName, tollway, calculateMode, coefficient, routingMode, useConstraints, type, vehicleLimit, dropToDrop, errors, zonebased,
    } = this.props.routeSetting;
    const { uploading } = this.props;
    const { t } = this.props;

    return (
      <div className="container">
        <form>
          <ReactTooltip />
          <div className="form-group row">
            <div
              data-tip={t('file_name_description')}
              className="col-5 col-sm-4"
            >{t('file_name_label')}
            </div>
            <CenterLabel
              title={fileName}
              className="col-7 col-sm-6"
            />
          </div>
          <div className="form-group row">
            <div
              data-tip={t('departure_date_description')}
              className="col-5 col-sm-4"
            >{t('departure_date_label')}
            </div>
            <div className="col-7 col-sm-6">
              <div className="input-cal">
                <DatePicker
                  dateFormat="YYYY/MM/DD"
                  className="form-control"
                  type="date"
                  name="date"
                  selected={date}
                  onChange={this.handleDatePicker}
                  errors={errors}
                  disabled={uploading}
                  id="date"
                  customInput={<DateInput />}
                />
              </div>
            </div>
            <Error
              errors={errors && errors.date}
            />
          </div>
          <div className="form-group row">
            <div
              data-tip={t('toll_ways_description')}
              className="col-5 col-sm-4"
            >{t('toll_ways_label')}
            </div>
            <div
              className="col-2 col-sm-2"
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Checkbox
                type="checkbox"
                checked={tollway}
                onChange={this.handleInputChange('tollway')}
                name="tollway"
                disabled={uploading}
              />
            </div>
          </div>
          <div className="form-group row">
            <div
              data-tip={t('calculate_mode_description')}
              className="col-5 col-sm-4"
            >{t('calculate_mode_label')}
            </div>
            <div
              className="col-7 col-sm-8 row"
            >
              <div
                className="col-12 col-sm-6"
                style={{
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingBottom: 5,
                }}
              >
                <Radio
                  style={{
                    marginRight: 5,
                  }}
                  type="radio"
                  name="calculateMode"
                  value="time"
                  className="radio"
                  checked={calculateMode === 'time'}
                  onChange={this.handleInputChange('calculateMode')}
                  disabled={uploading}
                />
                <div>{t('shortest_time_label')}</div>
              </div>
              <div
                className="col-12 col-sm-6"
                style={{
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingBottom: 5,
                  paddingRight: 0,
                }}
              ><Radio
                style={{
                  marginRight: 5,
                }}
                type="radio"
                className="radio"
                name="calculateMode"
                value="distance"
                checked={calculateMode === 'distance'}
                onChange={this.handleInputChange('calculateMode')}
                disabled={uploading}
              />
                <div>{t('shortest_distance_label')}</div>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div
              data-tip={t('load_factor_description')}
              className="col-5 col-sm-4"
            >{t('load_factor_label')}
            </div>
            <ReactTooltip />
            <CenterElement
              className="col-7 col-sm-6"
            >
              <Input
                type="range"
                className="route-setting__slider"
                min="0"
                max="1"
                step="0.1"
                value={coefficient}
                name="coefficient"
                onChange={this.handleInputChange('coefficient')}
                disabled={uploading}
              />
              <div style={{
                width: '40%',
                background: '#868A8B',
                textAlign: 'center',
                marginLeft: '5px',
                borderRadius: '6px',
              }}
              >{`${coefficient * 100}%`}
              </div>
            </CenterElement>
          </div>
          {(type && type !== 'master') && (
          <div className="form-group row">
            <div
              data-tip={t('planning_mode_description')}
              className="col-5 col-sm-4"
            >{t('planning_mode_label')}
            </div>
            <CenterElement
              className="col-7 col-sm-6"
            >
              <select
                className="form-control"
                name="routingMode"
                value={routingMode}
                onChange={this.handleInputChange('routingMode')}
                disabled={uploading}
              >
                {data.routingMode.map((mode, index) => (
                  <option key={index} value={index}>{t(mode)}</option>
                ))}
              </select>
            </CenterElement>
          </div>
          )}
          {
            (type && type !== 'master') && (
              <div className="form-group row">
                <div
                  data-tip={t('use_zone_description')}
                  className="col-5 col-sm-4"
                >{t('use_zone_label')}
                </div>
                <div
                  className="col-2 col-sm-2"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    type="checkbox"
                    checked={zonebased}
                    onChange={this.handleInputChange('zonebased')}
                    name="zonebased"
                    disabled={uploading}
                  />
                </div>
              </div>
            )
          }
          {(type && type !== 'general') && (
          <div className="form-group row">
            <div
              data-tip={t('use_constraints_description')}
              className="col-5 col-sm-4"
            >{t('use_constraints_label')}
            </div>
            <div
              className="col-2 col-sm-2"
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Checkbox
                type="checkbox"
                checked={useConstraints}
                onChange={this.handleInputChange('useConstraints')}
                name="useConstraints"
                disabled={uploading}
              />
            </div>
          </div>
          )}
          {
            (type && type !== 'master') && (
              <React.Fragment>
                <div className="form-group row">
                  <div
                    data-tip={t('drop_to_drop_description')}
                    className="col-5 col-sm-4"
                  >{t('drop_to_drop_label')}
                  </div>
                  <div className="col-7 col-sm-6">
                    <Input
                      className="form-control input__placeholder"
                      type="text"
                      name="dropToDrop"
                      value={dropToDrop}
                      placeholder={t('KM')}
                      onChange={this.handleInputChange('dropToDrop')}
                      disabled={uploading}
                    />
                  </div>
                  <Error
                    errors={errors && errors.dropToDrop}
                  />
                </div>
                <div className="form-group row">
                  <div
                    data-tip={t('vehicle_leg_description')}
                    className="col-5 col-sm-4"
                  >{t('vehicle_leg_label')}
                  </div>
                  <div className="col-7 col-sm-6">
                    <Input
                      className="form-control"
                      type="text"
                      name="vehicleLimit"
                      value={vehicleLimit}
                      onChange={this.handleInputChange('vehicleLimit')}
                      disabled={uploading}
                    />
                  </div>
                  <Error
                    errors={errors && errors.vehicleLimit}
                  />
                </div>
              </React.Fragment>
            )
          }
          <div className="form-group row">
            <div style={{
              marginLeft: 15,
            }}
            >
              {
                errors && errors.apiErrors && <Errors errors={errors.apiErrors} />}
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default (translate('routersetting')(Form));
Form.propTypes = {
  date: PropTypes.string,
  tollway: PropTypes.bool,
  calculateMode: PropTypes.string,
  coefficient: PropTypes.string,
  routingMode: PropTypes.string,
  fileName: PropTypes.string,
  routeSetting: PropTypes.object,
  handleSettingRoute: PropTypes.func,
  useConstraints: PropTypes.bool,
  uploading: PropTypes.bool,
  zonebased: PropTypes.bool,
  t: PropTypes.func,
};
