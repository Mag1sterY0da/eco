import { Sensor } from '../types/Sensor';

export const sensors: Sensor[] = [
  {
    id: 0,
    name: 'Sensor 1',
    location: {
      sensorId: 0,
      region: 'Paris',
      city: 'Paris',
      address: '10 Avenue Gambetta, 75020 Paris',
      longitude: '2.3522',
      latitude: '48.8566'
    }
  },
  {
    id: 1,
    name: 'Sensor 2',
    location: {
      sensorId: 1,
      region: 'Paris',
      city: 'Paris',
      address: '10 Avenue Gambetta, 75020 Paris',
      longitude: '2.3632',
      latitude: '48.8569'
    }
  },
  {
    id: 2,
    name: 'Sensor 3',
    location: {
      sensorId: 2,
      region: 'Paris',
      city: 'Paris',
      address: '10 Avenue Gambetta, 75020 Paris',
      longitude: '2.3529',
      latitude: '48.8536'
    }
  }
];
