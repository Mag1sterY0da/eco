import { Sensor } from './Sensor';

export interface Location {
  id: number;
  region: string;
  city: string;
  address: string;
  longitude: string;
  latitude: string;
  sensors: Sensor[];
}
