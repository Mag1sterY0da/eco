import { reverseGeocode } from 'api/reverseGeocode';
import { useMapEvents } from 'react-leaflet';
import CreateSensor from 'components/create-sensor/CreateSensor.tsx';
import React, { useState } from 'react';
import { Sensor } from 'types/Sensor.ts';
import { Location} from 'types/Location.ts';
import axios from 'axios';
import { API_URL } from '../../utils/const/apiUrl.ts';

type AddSensorProps = {
    locations: Location[];
    setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
};

const AddSensorOnClick = ({ locations, setLocations }: AddSensorProps) => {

    useMapEvents({
        click: async e => {
            const lng = e.latlng.lng;
            const lat = e.latlng.lat;
            const geoData = await reverseGeocode(lat, lng);

            const location: Location = {
                region:
                    geoData.address?.region ||
                    geoData.address?.district ||
                    geoData.address?.state ||
                    geoData.address?.borough ||
                    geoData.address?.quarter ||
                    geoData.address?.county ||
                    'Unknown',
                city: geoData.address.city || geoData.address.town || 'Unknown',
                address: `${geoData.address?.road}, ${geoData.address?.house_number ? geoData.address?.house_number : ''}`,
                longitude: e.latlng.lng.toString(),
                latitude: e.latlng.lat.toString()
            }

            axios.post(`${API_URL}/locations`, location).then(res => {
                axios.get(`${API_URL}/locations`).then(res => {
                    setLocations(res.data);
                });
            })
        }
    });

    return null;
};

export default AddSensorOnClick;
