import axios from 'axios';
import AddSensorOnClick from 'components/AddSensor';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Location } from 'types/Location.ts';
import { API_URL } from '../../utils/const/apiUrl.ts';
import './Map.scss';

const icon = new Icon({
  iconUrl: '/marker.png',
  iconSize: [38, 38]
});

const Map = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    axios.get(`${API_URL}/locations`).then(res => {
      setLocations(res.data);
    });
  }, []);

  return (
    <div className='map-wrapper'>
      <MapContainer center={[50.4504, 30.5245]} zoom={13} className='map'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <AddSensorOnClick locations={locations} setLocations={setLocations} />
        {locations.map((m, i) => (
          <Marker position={[+m.latitude, +m.longitude]} icon={icon} key={i}>
            <Popup>
              <Link to={`/location/${m.id}`}>{m.address}</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
