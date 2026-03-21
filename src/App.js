import './App.css';
import logo from './assets/csulb_logo.png';
import map from './assets/campus_map.png';
import schedule from './assets/class_time_table.png';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <MenuIcon className="header-menu"/>
        <img src={logo} className="csulb-logo" alt="logo" />
        <AccountCircleIcon className="header-account"/>
      </header>
      <div className="add-class-container"> 
        <input className="class-name-input" placeholder="Type class name here" />
        <button className="add-class-btn" type="button">+</button>
      </div>
      <div className="class-visualization">
        <img src={map} className="campus-map" alt="map" />
        <img src={schedule} className="class-schedule" alt="schedule" />
      </div>
    </div>
  );
}

export default App;
