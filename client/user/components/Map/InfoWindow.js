import SnazzyInfoWindow from 'snazzy-info-window';
import i18next from '../../../i18n';
import renderColor from '../../util/color';

const renderContent = (content) => {
  const wrapper = document.createElement('div');
  wrapper.style.height = '100%';
  wrapper.innerHTML = `<div 
      style="height: 100%; display:flex; flex-direction: column;"
    >
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex: 1 1 15px;
      "
    >
      <div
        style="
          width: 10px !important;
          min-width: 10px;
          max-width: 10px;
          height: 10px;
          background-color: ${content.color};
          border-radius: 50%;
          margin-right: 2px;
        ">
      </div>
      <div
        style="font-size: 12px;
        max-width: 80%;
        width: 80%;
        margin: 0;
        "
      ><p style="
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        max-width: 100%;
        white-space: nowrap;
      ">${content.content}</p>
      </div>
    </div>
    <div style="flex: 1 1 auto; display: flex; justify-content: space-between; flex-direction: column;">
      ${(content && content.vehicleInfo && content.vehicleInfo.volume) ? (
    `
      <div style="display: flex; flex-direction: row; align-items: baseline; justify-content: flex-start;">
        <p style="width: 35px;font-size: 8px!important; margin: 0; padding-right: 5px">${i18next.t('volume')}</p>
        <div class="progress" style="height: 5px; width: 70px !important;">
          <div class="progress-bar" role="progressbar" style="width: ${content.plan.percentage_volume}% !important; height: 5px; background-color: ${renderColor(content.plan.percentage_volume)}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <p style="font-size: 8px!important; margin: 0; padding-left: 5px">${content.plan.total_volume.toFixed(1)} / ${content.vehicleInfo.volume.toFixed(1)}</p>
      </div>
    `
  ) : ''
}
      ${(content && content.vehicleInfo && content.vehicleInfo.weight) ? (
    `
        <div style="display: flex; flex-direction: row; align-items: baseline; justify-content: flex-start;">
          <p style="width: 35px;font-size: 8px!important; margin: 0; padding-right: 5px">${i18next.t('weight')}</p>
          <div class="progress" style="height: 5px; width: 70px !important;">
            <div class="progress-bar" role="progressbar" style="width: ${content.plan.percentage_weight}% !important; height: 5px; background-color: ${renderColor(content.plan.percentage_weight)}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <p style="font-size: 8px!important; margin: 0; padding-left: 5px">${content.plan.total_weight.toFixed(1)} / ${content.vehicleInfo.weight.toFixed(1)}</p>
        </div>
    `
  ) : ''}
    </div>
  </div>`;

  return wrapper;
};


const infoWindow = (marker, content) => new SnazzyInfoWindow({
  marker,
  content: renderContent(content),
  pointer: 5,
  showCloseButton: false,
  shadow: false,
  offset: {
    top: '-18px',
    left: '11px',
  },
  closeOnMapClick: false,
  wrapperClass: 'label-info-wrapper',
  openOnMarkerClick: false,
  backgroundColor: '#252525',
  border: {
    color: '#252525',
  },
  fontColor: 'white',
});

export default infoWindow;
