export interface Indicator {
  id: number;
  name: string;
  type: string;
  unit: string;
  data: {
    id: number;
    value: number;
    date: string;
    time: string;
  } | null;
}
