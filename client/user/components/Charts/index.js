// eslint-disable
import React from 'react';
import Header from './header'; // eslint-disable-line
import './index.css';

const ROOTHOUR = 0;
const ENDHOUR = 5;
const DIVWIDTH = 35;
const DIVHEIGHT = 20;
const MARGINLINE = 20;
const UNSERVEDWIDTH = 70;
const SPACEBETWEENUNSERVED = 100;
const spacebetweenTwoHour = (h1, h2) => {
  const rootSpace = 50;
  const rootHour = ROOTHOUR;
  const hour1 = h1 - rootHour >= 0 ? h1 - rootHour : h1 - rootHour + 20;
  const h1Coordinate = rootSpace + (hour1 * 100);

  return {
    h1: h1Coordinate,
    h2: (h2 - h1) > 0 ? h1Coordinate + ((h2 - h1) * 100) : h1Coordinate + ((23 - h1 + window.parseInt(h2) + 1) * 100),
  };
};

const getPositionByHour = (h) => {
  const rootSpace = 50;
  const rootHour = ROOTHOUR;
  const hour1 = h - rootHour >= 0 ? h - rootHour : (23 - rootHour + window.parseInt(h) + 1);
  const h1Coordinate = rootSpace + (hour1 * 100);

  return h1Coordinate;
};

const generateHeader = (start, end) => {
  const result = [];
  for (let i = start; i <= 23; i++) {
    result.push(`${i}:00`);
  }
  for (let i = 0; i <= end; i++) {
    result.push(`${i}:00`);
  }

  return result;
};

const data = {
  point: [
    ['5', '6.5', '9.1666', '10.3333', '13.3333', '14.83333', '17', '18.83333', '22'],
    ['5', '6.5', '22'],
    ['5', '5'],
    ['5', '6.5', '22'],
    ['6', '6.5', '22'],
    ['5', '6.5', '22'],
    ['5', '6.5', '22'],
  ],
  error: ['123123123', '123123123', '123123', '123123'],
};

const total = (data.error && data.error.length > 0) ? data.point.length + 1 : data.point.length; // 1 is row errors
const containerHeight = total * 20 + (total - 1) * 10 + 50; // bonus 50px for beauty UI


const colors = ['#5CB72A', '#94469A', '#55AFCE', '#ECBC4E', '#DA4A79', '#51ADAD', '#F2C494', '#6E292C']; //eslint-disable-line


class Charts extends React.Component {
  componentDidMount() {
  }

  renderRoot = (coordinate, parentKey, index) => (
    <g key={`svg-root-${parentKey}-${index}`}>
      <circle cx={coordinate.x} cy={coordinate.y} r="10" fill="black" stroke="white" strokeWidth="1" />
      <text className="icon fas fa-home" x={coordinate.x} y={coordinate.y + 1} textAnchor="middle" alignmentBaseline="middle" fill="white">&#xf015;</text>
    </g>
  )

  renderPath = (paths, key) => {
    const len = paths.length;

    return paths.map((item, index) => {
      if (index < (len - 1)) {
        const temp = spacebetweenTwoHour(paths[index], paths[index + 1]);
        const startPoint = {
          x: index === 0 ? temp.h1 + 10 : temp.h1 + DIVWIDTH,
          y: key === 0 ? ((key + 1) * 10) : (((key + 1) * 10) + (key * MARGINLINE)),
        };
        const endPoint = {
          x: index === (len - 2) ? temp.h2 - 10 : temp.h2,
          y: key === 0 ? ((key + 1) * 10) : (((key + 1) * 10) + (key * MARGINLINE)),
        };

        return (
          <line
            key={`svg-line-${key}-${index}`}
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            style={{
              stroke: colors[key],
              strokeWidth: 3,
            }}
          />
        );
      }

      return index;
    });
  }

  renderStop = () => (
    <rect
      width="20"
      height="20"
      x="140"
      style={{
        fill: 'rgb(0,0,255)',
        stroke: 'rgb(0,0,0)',
      }}
    />
  )

  renderRoute = (routes, parentKey) => routes.map((item, index) => {
    const len = routes.length;
    if (index === 0) {
      const coordinate = {
        y: parentKey === 0 ? (parentKey + 1) * 10 : ((parentKey + 1) * 10) + (MARGINLINE * parentKey),
        x: getPositionByHour(item),
      };

      return this.renderRoot(coordinate, parentKey, index);
    }
    if (index === (routes.length - 1)) {
      const first = parseInt(routes[0], 10);
      const last = parseInt(routes[len - 1], 10);
      if (last - first > 0) {
        const coordinate = {
          y: parentKey === 0 ? (parentKey + 1) * 10 : ((parentKey + 1) * 10) + (MARGINLINE * parentKey),
          x: getPositionByHour(item),
        };

        return this.renderRoot(coordinate, parentKey, index);
      }
      console.log(spacebetweenTwoHour(first, last));
      const coordinate = {
        y: parentKey === 0 ? (parentKey + 1) * 10 : ((parentKey + 1) * 10) + (MARGINLINE * parentKey),
        x: spacebetweenTwoHour(first, last).h2,
      };

      return this.renderRoot(coordinate, parentKey, index);
    }
    const coordinate = {
      y: parentKey === 0 ? (((parentKey + 1) * 10) - 10) : ((parentKey * 20)) + parentKey * 10,
      x: getPositionByHour(item),
    };

    return this.renderRec(coordinate, item, parentKey, index);
  })

  renderRec = (coordinate, item, parentKey, index) => (
    <g className="rect" key={`svg-rect-path-${parentKey}-${index}`}>
      <rect
        id={item}
        x={coordinate.x}
        y={coordinate.y}
        width={DIVWIDTH}
        height={DIVHEIGHT}
        style={{
          fill: colors[parentKey],
          fillOpacity: 1,
        }}
      />
      <text textAnchor="middle" x={coordinate.x + 17} y={coordinate.y + 13} fontFamily="Verdana" fontSize="10" fill="white">{Math.floor(item)}:{Math.floor((item - Math.floor(item)) * 60)}</text>
    </g>
  )

  renderVerticalLine = (header) => {
    const result = [];
    const START = 50;
    const NUMBEROFHOURS = header.length;
    const DISTANCE = 100;
    for (let i = START; i < DISTANCE * NUMBEROFHOURS; i += DISTANCE) {
      result.push(<line
        x1={i}
        y1="0"
        x2={i}
        y2={header.length * 100}
        style={{
          stroke: '#344854',
          strokeWidth: 1,
        }}
        key={`vertical-line-${i}`}
      />);
    }

    return result;
  }

  renderErrorPoint = (point, key) => { // eslint-disable-line
    return (
      <g className="rect" key={`svg-rect-${key}`}>
        <rect
          id={key}
          x={((key + 1) * SPACEBETWEENUNSERVED + 2)}
          y={0}
          width={UNSERVEDWIDTH}
          height={DIVHEIGHT}
          style={{
            fill: 'red',
            fillOpacity: 1,
          }}
        />
        <text textAnchor="middle" x={((key + 1) * SPACEBETWEENUNSERVED + (UNSERVEDWIDTH / 2))} y={12} fontFamily="Verdana" fontSize="10" fill="white">{point}</text>
      </g>
    );
  }

  renderIconError = header => (
    <g>
      <rect
        x={0}
        y={0}
        width={header.length * 100}
        height={DIVHEIGHT}
        style={{
          fill: 'red',
          fillOpacity: 0.5,
        }}
      />
      <circle cx={50} cy={10} r="10" fill="red" />
      <text id="icon" className="icon fas fa-home" x={50} y={10 + 5} textAnchor="middle" fill="white">&#xf128;</text>
    </g>
  )

  render() {
    const header = generateHeader(ROOTHOUR, ENDHOUR);

    return (
      <div style={{
        height: '100%',
        width: '95%',
      }}
      >
        <div className="timeline">
          <Header
            header={header}
          />
          <div style={{
            paddingTop: 5,
            width: header.length * 100,
          }}
          >
            <svg id="table-timeline" width={header.length * 100} height={containerHeight}>
              {this.renderVerticalLine(header)}
              {this.renderIconError(header)}
              {data.error.map((item, key) => this.renderErrorPoint(item, key))}
              {data.point.map((item, key) => {
                const index = data.error && data.error.length > 0 ? key + 1 : key;

                return this.renderPath(item, index);
              })}
              {data.point.map((item, key) => {
                const index = data.error && data.error.length > 0 ? key + 1 : key;

                return this.renderRoute(item, index);
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default Charts;
