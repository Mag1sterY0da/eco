import { useParams } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Sensor } from 'types/Sensor.ts';

const mockedSensor: Sensor = {
    "id": 6,
    "name": "Test6",
    "location": {
        "id": 2,
        "region": "Kyiv",
        "city": "Kyiv",
        "address": "Street",
        "longitude": "123.123132",
        "latitude": "12.123124"
    },
    "indicators": [
        {
            "id": 1,
            "name": "Test Indicator 1",
            "type": "Стан повітря",
            "unit": "Test unit",
            "data": {
                "id": 3,
                "value": 123.0,
                "date": "2024-02-27",
                "time": "21:45"
            }
        },
        {
            "id": 2,
            "name": "Test Indicator 2",
            "type": "Стан водних ресурсів",
            "unit": "Test unit 2",
            "data": null
        }
    ]
}


const Sensor = () => {
    const {id} = useParams();
    const [sensor, setSensor] = useState<Sensor>(mockedSensor);

    useEffect(() => {
        // http request
    }, []);

    return (
        <Container sx={{my: 5}}>
            <Typography variant="h2">
                Датчик - { sensor?.name }
                <Button sx={{ml:10}} variant="outlined">Додати значення показників</Button>
            </Typography>
            <Typography variant="h5" gutterBottom sx={{mb:3}}>
                { sensor?.location.region }, { sensor?.location.city }, {sensor?.location.address}
            </Typography>
            {sensor?.indicators.map(indicator => {
                if (indicator.data) {
                    return (
                        <p key={indicator.id}>
                            <b>{indicator.name}</b> = {indicator.data?.value} {indicator.unit} ({indicator.data?.date} - {indicator.data?.time})
                        </p>
                    )
                }
            })}
        </Container>
    );
};

export default Sensor;
