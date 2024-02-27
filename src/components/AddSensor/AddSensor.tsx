import { useMapEvents } from 'react-leaflet';
import { Sensor } from 'types/Sensor';

type AddSensorProps = {
  sensors: Sensor[];
  setSensors: React.Dispatch<React.SetStateAction<Sensor[]>>;
};

const AddSensorOnClick = ({ sensors, setSensors }: AddSensorProps) => {
  useMapEvents({
    click: e => {
      const newSensor = {
        id: sensors.length + 1,
        name: `Sensor ${sensors.length + 1}`,
        location: {
          id: sensors.length + 1,
          region: 'Dynamic Region',
          city: 'Dynamic City',
          address: 'Dynamic Address',
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
