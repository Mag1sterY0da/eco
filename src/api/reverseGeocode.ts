import axios from 'axios';

export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    const response = await axios(url);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
