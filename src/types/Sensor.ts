import { Location } from './Location';
import { Indicator } from 'types/Indicator.ts';

export interface Sensor {
  id: number;
  name: string;
  location: Location;
  indicators: Indicator[];
}
