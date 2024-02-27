import { Sensor } from '../types/Sensor';

export const sensorsData: Sensor[] = [
  {
    id: 0,
    name: 'Sensor 1',
    location: {
      id: 0,
      region: 'Paris',
      city: 'Paris',
      address: '10 Avenue Gambetta, 75020 Paris',
      longitude: '2.3522',
      latitude: '48.8566'
    },
    indicators: []
  },
  {
    id: 1,
    name: 'Sensor 2',
    location: {
      id: 1,
      region: 'Paris',
      city: 'Paris',
      address: '10 Avenue Gambetta, 75020 Paris',
      longitude: '2.3632',
      latitude: '48.8569'
    },
    indicators: []
  },
  {
    id: 2,
    name: 'Sensor 3',
    location: {
      id: 2,
      region: 'Paris',
      city: 'Paris',
      address: '10 Avenue Gambetta, 75020 Paris',
      longitude: '2.3529',
      latitude: '48.8536'
    },
    indicators: []
  }
];
