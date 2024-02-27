import { reverseGeocode } from 'api/reverseGeocode';
import { useMapEvents } from 'react-leaflet';
import { Sensor } from 'types/Sensor';

type AddSensorProps = {
  sensors: Sensor[];
  setSensors: React.Dispatch<React.SetStateAction<Sensor[]>>;
};

const AddSensorOnClick = ({ sensors, setSensors }: AddSensorProps) => {
  useMapEvents({
    click: async e => {
      const lng = e.latlng.lng;
      const lat = e.latlng.lat;
      const geoData = await reverseGeocode(lat, lng);

      console.log(geoData);

      const newSensor = {
        id: sensors.length + 1,
        name: `Sensor ${sensors.length + 1}`,
        location: {
          id: sensors.length + 1,
          region:
            geoData.address?.region ||
            geoData.address?.district ||
            geoData.address?.state ||
            geoData.address?.borough ||
            geoData.address?.quarter ||
            geoData.address?.county ||
            'Unknown',
          city: geoData.address.city || geoData.address.town || 'Unknown',
          address: `${geoData.address?.road}, ${geoData.address?.house_number}`,
          longitude: e.latlng.lng.toString(),
          latitude: e.latlng.lat.toString()
        },
        indicators: []
      };
      setSensors(currentSensors => [...currentSensors, newSensor]);
    }
  });

  return null;
};

export default AddSensorOnClick;
