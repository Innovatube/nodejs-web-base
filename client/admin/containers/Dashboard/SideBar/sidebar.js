import React from 'react';

class SideBar extends React.Component {
  render() {
    return (
      <div>
        <div className="sidebar">
          <nav className="sidebar-nav">
            <ul className="nav">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="nav-icon cui-speedometer" /> User
                </a>
              </li>
            </ul>
          </nav>
          <button className="sidebar-minimizer brand-minimizer" type="button" />
        </div>
      </div>
    );
  }
}
export default SideBar;
