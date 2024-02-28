import { reverseGeocode } from 'api/reverseGeocode';
import { useMapEvents } from 'react-leaflet';
import CreateSensor from 'components/create-sensor/CreateSensor.tsx';
import { useState } from 'react';

const AddSensorOnClick = () => {
    const [showCreateSensor, setShowCreateSensor] = useState(false);
    const [location, setLocation] = useState({});

    useMapEvents({
        click: async e => {
            setShowCreateSensor(true);
            const lng = e.latlng.lng;
            const lat = e.latlng.lat;
            const geoData = await reverseGeocode(lat, lng);

            setLocation({
                location: {
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
                }
            });
        }
    });

    const onSubmit = (data) => {
        const newSensor = {...location, ...data};
        console.log(newSensor);
    };

    return showCreateSensor ? <CreateSensor onSubmit={onSubmit}/> : null;
};

export default AddSensorOnClick;
