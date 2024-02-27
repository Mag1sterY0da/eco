import { sensors } from 'data/mock';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import './Map.scss';

const icon = new Icon({
  iconUrl: '/marker.png',
  iconSize: [38, 38]
});

const Map = () => {
  return (
    <div className='map-wrapper'>
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

export default Map;
