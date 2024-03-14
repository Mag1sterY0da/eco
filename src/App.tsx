import Location from 'components/Location';
import Map from 'components/Map';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SensorPage } from 'components/Sensor Info Page/SensorPage.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Map />} />
        <Route path='/location/:id' element={<Location />} />
        <Route path='/sensor/:id' element={<SensorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
