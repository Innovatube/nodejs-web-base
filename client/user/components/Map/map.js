import { format, diff, getDuration } from '../../util/date';
import { convertMeterToKilometer } from '../../util/distance';
import {
  ROUTE, POINT, UNSERVED, START,
} from './constants';
import box from '../../image/box.png';
import i18next from '../../../i18n';
import renderColor from '../../util/color';

export const renderMarker = (point, map, options = {}) => (
  new window.google.maps.Marker({
    position: point,
    map,
    animation: window.google.maps.Animation.DROP,
    ...options,
  })
);

export const renderPolyline = (path, options) => new window.google.maps.Polyline({
  path,
  strokeColor: '#1EB4FA',
  strokeOpacity: 1,
  strokeWeight: 10,
  ...options,
});

export function handleZoomIn(map) {
  const currentZoomLevel = map.getZoom();
  if (currentZoomLevel !== 30) {
    map.setZoom(currentZoomLevel + 1);
  }
}

export function handleZoomOut(map) {
  const currentZoomLevel = map.getZoom();
  if (currentZoomLevel !== 0) {
    map.setZoom(currentZoomLevel - 1);
  }
}

export const getNumOfDrops = (route) => {
  let numOfDrops = 0;
  if (route && route.legs) {
    route.legs.map((item, index) => {
      if (index === 0) {
        numOfDrops++;

        return item;
      } if (index === route.legs.length - 1) {
        if (item.stop_id === route.client_vehicle_id) {
          return item;
        }
        numOfDrops++;

        return item;
      }
      numOfDrops++;

      return item;
    });
  }

  return numOfDrops;
};


export const renderInfoWindow = (collection, type, data) => {
  let infoWindow = null;
  const wrapper = document.createElement('div');
  const content = document.createElement('div');
  const submitButton = document.createElement('button'); // eslint-disable-line
  submitButton.classList.add('btn_rese');
  submitButton.classList.add('fs-14');
  submitButton.addEventListener('click', () => {
    infoWindow.close();
    collection.event();
  });
  if (type === ROUTE) {
    content.innerHTML = `
    <h3 
    style="
      width: 80%;
      max-width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    " 
    class='fs-16'>
      ${data.client_vehicle_id}
    </h3>
    <p class="br-marker fs-14">
      <i class="fas fa-truck fs-14 distance"></i> ${convertMeterToKilometer(data.total_distance)} ${i18next.t('KM')}
    </p>
    <p class='fs-14 margin-0 padding-bottom-5'>${format(data.time_start)} - ${format(data.time_end)} (${getDuration(data)} hr)</p>
    <p class='fs-14'>${getNumOfDrops(data)} ${i18next.t('drops')}</p>`;
    submitButton.innerHTML = i18next.t('re_sequence');
    i18next.on('languageChanged', () => {
      content.innerHTML = `<h3 class='fs-16'>${data.client_vehicle_id}</h3><p class="br-marker fs-14"><i class="fas fa-truck fs-14 distance"></i> ${convertMeterToKilometer(data.total_distance)} ${i18next.t('KM')}</p><p class='fs-14 margin-0 padding-bottom-5'>${format(data.time_start)} - ${format(data.time_end)} (${diff(data.time_end, data.time_start)} hr)</p><p class='fs-14'>${getNumOfDrops(data)} ${i18next.t('drops')}</p>`;
      submitButton.innerHTML = i18next.t('re_sequence');
      content.appendChild(submitButton);
    });
    content.appendChild(submitButton);
  } else if (type === POINT) {
    const { stopPoint, filteredPlan } = collection;
    content.innerHTML = `<h3 class='fs-16'><img class="window-image" src='${box}' /></i> ${stopPoint.client_stop_id}</h3><p class="br-marker fs-14 margin-0 padding-bottom-5">${i18next.t('service')} ${stopPoint.service_time} ${i18next.t('min')}</p><p class='fs-14 margin-0 padding-top-5 padding-bottom-5'>${filteredPlan && format(filteredPlan.arrive_time)}</p><p class='fs-14 margin-0 padding-bottom-5'>${(stopPoint && stopPoint.name) ? stopPoint.name : ''}</p>`;
    submitButton.innerHTML = i18next.t('move');
    i18next.on('languageChanged', () => {
      content.innerHTML = `<h3 class='fs-16'><img class="window-image" src='${box}' /></i> ${stopPoint.client_stop_id}</h3><p class="br-marker fs-14 margin-0 padding-bottom-5">${i18next.t('service')} ${stopPoint.service_time} ${i18next.t('min')}</p><p class='fs-14 margin-0 padding-top-5 padding-bottom-5'>${filteredPlan && format(filteredPlan.arrive_time)}</p><p class='fs-14 margin-0 padding-bottom-5'>${(stopPoint && stopPoint.name) ? stopPoint.name : ''}</p>`;
      submitButton.innerHTML = i18next.t('move');
      content.appendChild(submitButton);
    });
    content.appendChild(submitButton);
  } else if (type === UNSERVED) {
    content.innerHTML = `<h3 class='fs-16'><i class="fas fa-exclamation-circle fs-14"></i>${data.client_stop_id}</h3><p class="br-marker fs-14">${i18next.t('service_time')} ${data.service_time} ${i18next.t('min')}.</p><p class="error fs-14">${i18next.t('UNSERVED')} !</p></p><p class='fs-14'>${(data && data.name) ? data.name : ''}</p>`;
    submitButton.innerHTML = i18next.t('move');
    i18next.on('languageChanged', () => {
      content.innerHTML = `<h3 class='fs-16'><i class="fas fa-exclamation-circle fs-14"></i>${data.client_stop_id}</h3><p class="br-marker fs-14">${i18next.t('service_time')} ${data.service_time} ${i18next.t('min')}.</p><p class="error fs-14">${i18next.t('UNSERVED')} !</p></p><p class='fs-14'>${(data && data.name) ? data.name : ''}</p>`;
      submitButton.innerHTML = i18next.t('move');
      content.appendChild(submitButton);
    });
    content.appendChild(submitButton);
  } else if (type === START) {
    const { vehicleInfo } = collection;
    content.innerHTML = `<h3 class='fs-16'><img class="window-image" src='${box}' /></i> ${vehicleInfo.client_vehicle_id}</h3><p class="br-marker fs-14 margin-0 padding-bottom-5"></p><p class='fs-14 margin-0 padding-top-5 padding-bottom-5'>${format(vehicleInfo.time_start, { moment: 'HH:mm:ss', format: 'HH:mm' })}</p>`;
  }
  wrapper.appendChild(content);

  infoWindow = new window.google.maps.InfoWindow({
    content: wrapper,
    disableAutoPan: false,
  });

  return infoWindow;
};

const generateMapButton = (content) => {
  const centerControlDiv = document.createElement('div');
  const controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'black';
  controlUI.style.borderRadius = '3px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Toggle';
  centerControlDiv.appendChild(controlUI);
  const controlText = document.createElement('div');
  controlText.style.color = 'white';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '28px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.style.width = '35px';
  controlText.innerHTML = content;
  controlUI.appendChild(controlText);
  centerControlDiv.index = 1;
  centerControlDiv.style['padding-right'] = '10px';

  return {
    controlUI,
    centerControlDiv,
  };
};

const LinearProgress1 = (label, stops, vehicle) => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'row';
  container.style.alignItems = 'center';
  container.style.opacity = '1';
  container.style.height = '30px';
  container.style.minWidth = '70%';
  container.style.justifyContent = 'flex-start';
  container.style.marginTop = '5px';
  const text1 = `<label style="font-size: 11px !important; width: 30% !important;">${i18next.t('volume')}</label>`;
  container.innerHTML = text1;
  const progress = document.createElement('div');
  progress.style.display = 'flex';
  progress.style.flexDirection = 'row';
  progress.style.justifyContent = 'space-between';
  progress.style.alignItems = 'center';
  progress.style.height = 'auto';
  progress.style.flex = '1 1 auto';
  progress.style.marginBottom = '-1px';
  container.appendChild(progress);
  const withBar = (!stops.volume || stops.volume === null) ? 0 : stops.volume;
  const n = withBar.toFixed(1);
  const m = (vehicle && vehicle.volume !== undefined && vehicle.volume !== null) ? vehicle.volume.toFixed(1) : 0;
  const bar = document.createElement('div');
  bar.style.position = 'relative';
  bar.style.height = '4px';
  bar.style.display = 'block';
  bar.style.backgroundColor = 'rgb(189, 189, 189)';
  bar.style.borderRadius = '2px';
  bar.style.margin = '3px 5px 10px';
  bar.style.overflow = 'hidden';
  bar.style.flex = '0 0 44%';
  progress.appendChild(bar);
  const bar2 = `<div style ="height: 100%;background-color: ${renderColor(n / m * 100)};width: ${n / m * 100}% !important;"></div>`;
  bar.innerHTML += bar2;
  const text2 = `<label style="font-size: 9px; width: 65% !important;">${n}/${m}</label>`;
  progress.innerHTML += text2;

  return container;
};
const LinearProgress2 = (label, stops, vehicle) => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'row';
  container.style.alignItems = 'center';
  container.style.opacity = '1';
  container.style.height = '30px';
  container.style.minWidth = '70%';
  container.style.justifyContent = 'flex-start';
  const text1 = `<label style="font-size: 11px !important;width: 30% !important ">${i18next.t('weight')}</label>`;
  container.innerHTML = text1;
  const progress = document.createElement('div');
  progress.style.display = 'flex';
  progress.style.flexDirection = 'row';
  progress.style.justifyContent = 'space-between';
  progress.style.alignItems = 'center';
  progress.style.height = 'auto';
  progress.style.flex = '1 1 auto';
  progress.style.marginBottom = '-1px';
  container.appendChild(progress);
  const withBar = (!stops.weight || stops.weight === null) ? 0 : stops.weight;
  const n = withBar.toFixed(1);
  const m = (vehicle && vehicle.weight !== undefined && vehicle.weight !== null) ? vehicle.weight.toFixed(1) : 0;
  const a = n / m;
  const b = (isNaN(a) || a === null || a === Infinity) ? 0 : a; // eslint-disable-line
  const bar = document.createElement('div');
  bar.style.position = 'relative';
  bar.style.height = '4px';
  bar.style.display = 'block';
  bar.style.backgroundColor = 'rgb(189, 189, 189)';
  bar.style.borderRadius = '2px';
  bar.style.margin = '3px 5px 10px';
  bar.style.overflow = 'hidden';
  bar.style.flex = '0 0 44%';
  progress.appendChild(bar);
  const bar2 = `<div style ="height: 100%;background-color: ${renderColor(a * 100)};width: ${b * 100}% !important;"></div>`;
  bar.innerHTML += bar2;
  const text2 = `<label style="font-size: 9px !important;width: 65% !important; ">${n}/${m}</label>`;
  progress.innerHTML += text2;

  return container;
};
export const renderIdJob = (stops, vehicle, filteredPlan) => {
  let jobWindow = null;
  const wrapper = document.createElement('div');
  const content = document.createElement('div');
  content.innerHTML = `<h3 class='fs-16'><img class="window-image" src='${box}' /></i> ${stops.client_stop_id}</h3>`;
  content.innerHTML += `<p class="br-marker fs-14 margin-0 padding-bottom-5">${i18next.t('service')} ${stops.service_time} ${i18next.t('min')}</p>`;
  content.innerHTML += `<p class="fs-14 padding-bottom-5" style="margin-top: 5px;">${filteredPlan && format(filteredPlan.arrive_time)}</p>`;
  content.innerHTML += `<p class='fs-14 margin-0 padding-bottom-5'>${(stops && stops.name) ? stops.name : ''}</p>`;
  content.appendChild(LinearProgress1('volume', stops, vehicle));
  content.appendChild(LinearProgress2('weight', stops, vehicle));
  wrapper.appendChild(content);
  jobWindow = new window.google.maps.InfoWindow({
    content: wrapper,
    disableAutoPan: true,
  });

  return jobWindow;
};

const generateSwitchButton = (event) => {
  const centerControlDiv = document.createElement('div');
  centerControlDiv.index = 1;
  centerControlDiv.style['padding-right'] = '10px';
  const controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'black';
  controlUI.style.borderRadius = '3px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Traffic';
  centerControlDiv.appendChild(controlUI);
  const controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '28px';
  controlText.style.padding = '5px';
  controlText.style.width = '120px';
  controlText.style.height = '30px';
  controlText.style.display = 'flex';
  controlText.style.justifyContent = 'space-between';
  controlText.style.alignItems = 'center';
  const textLabel = document.createElement('div');
  textLabel.innerHTML = 'Traffic';
  textLabel.style.fontSize = '12px';
  textLabel.style.color = 'white';
  controlText.appendChild(textLabel);
  const switchWrapper = document.createElement('label');
  switchWrapper.style.margin = 0;
  switchWrapper.classList.add('switch');
  const checkBox = document.createElement('input');
  checkBox.classList.add('input');
  checkBox.type = 'checkbox';
  if (event.value) {
    checkBox.checked = true;
  } else {
    checkBox.checked = false;
  }
  checkBox.addEventListener('change', () => {
    event.click();
  });
  const slider = document.createElement('span');
  slider.classList.add('slider');
  slider.classList.add('round');
  const onText = document.createElement('div');
  onText.classList.add('switch-on');
  onText.innerHTML = 'ON';
  const offText = document.createElement('div');
  offText.classList.add('switch-off');
  offText.innerHTML = 'OFF';
  slider.appendChild(onText);
  slider.appendChild(offText);
  switchWrapper.appendChild(checkBox);
  switchWrapper.appendChild(slider);
  controlText.appendChild(switchWrapper);
  controlUI.appendChild(controlText);
  centerControlDiv.appendChild(controlUI);

  return centerControlDiv;
};

export const generateToggleButton = (map, event) => {
  const toggle = generateMapButton('<i class="fas fa-angle-right"></i>');
  toggle.controlUI.addEventListener('click', event.click);
  map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(toggle.centerControlDiv);
};

export const generateZoom = (map) => {
  const zoomOut = generateMapButton('<i class="fas fa-minus"></i>');
  zoomOut.controlUI.addEventListener('click', () => {
    handleZoomOut(map);
  });
  map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomOut.centerControlDiv);
  const zoomIn = generateMapButton('<i class="fas fa-plus"></i>');
  zoomIn.controlUI.style.marginBottom = '5px';
  zoomIn.controlUI.addEventListener('click', () => {
    handleZoomIn(map);
  });
  map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomIn.centerControlDiv);
};

export const generateTrafficButton = (map, event) => {
  const traffic = generateSwitchButton(event);
  map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(traffic);
};

export const decodePolyline = (url, callback) => {
  const paths = decodeURIComponent(url);

  return window.google.maps.geometry.encoding.decodePath(paths).map((coordinate, index) => {
    if (callback) {
      callback(coordinate, index);
    }

    return coordinate;
  });
};

export const renderTrafficPolyline = (url) => {
  const paths = decodeURIComponent(url);

  return window.google.maps.geometry.encoding.decodePath(paths);
};


export const createLatLong = (position) => {
  if (position.lat && position.long && window.google) {
    return new window.google.maps.LatLng(position.lat, position.long);
  }

  return null;
};

export const transformRawPathsToGooglePaths = (routes) => {
  const newRoutes = routes.map((route) => {
    const temp = route;
    temp.path = route.path.map(position => createLatLong(position));

    return route;
  });

  return newRoutes;
};

export const addEvent = (element, event, callback) => {
  window.google.maps.event.addListener(element, event, callback);
};

export const initMap = (id, mapOptions) => {
  const canvas = document.getElementById(id);

  const options = {
    zoom: 12,
    disableDoubleClickZoom: true,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    ...mapOptions,
  };

  return new window.google.maps.Map(canvas, options);
};

export function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
  }
}

export const showTrafficColor = (color) => {
  switch (color) {
    case '#820A0D':
      return '#ffaaaa';
    case '#E31B1F':
      return '#ffb7b7';
    case '#FDC02F':
      return '#fffbbb';
    case '#74BA59':
      return '#d4ffc2';
    default:
      return color;
  }
};

export const showCorrectTrafficColor = (color) => {
  switch (color) {
    case '#ffaaaa':
      return '#820A0D';
    case '#ffb7b7':
      return '#E31B1F';
    case '#fffbbb':
      return '#FDC02F';
    case '#d4ffc2':
      return '#74BA59';
    default:
      return color;
  }
};

export default {
  renderMarker,
  renderPolyline,
  renderInfoWindow,
  generateToggleButton,
  decodePolyline,
  createLatLong,
  transformRawPathsToGooglePaths,
  addEvent,
  initMap,
  toggleBounce,
};
