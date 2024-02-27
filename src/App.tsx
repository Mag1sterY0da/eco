import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import './App.scss';
import { sensors } from './data/markers';

const icon = new Icon({
  iconUrl: '/marker.png',
  iconSize: [38, 38]
});

const App = () => {
  return (
    <div className='app'>
      <MapContainer center={[48.8566, 2.3522]} zoom={13} className='map'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {sensors.map((m, i) => (
          <Marker position={[+m.location.latitude, +m.location.longitude]} icon={icon} key={i}>
            <Popup>{m.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
