import Location from 'components/Location';
import Map from 'components/Map';
import { SensorPage } from 'components/Sensor Info Page/SensorPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EconomicUnitsPage from './pages/EconomicUnits';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Map />} />
        <Route path='/location/:id' element={<Location />} />
        <Route path='/sensor/:id' element={<SensorPage />} />
        <Route path='/economic-units' element={<EconomicUnitsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
