import Location from 'components/Location'
import Map from 'components/Map'
import { SensorPage } from 'components/Sensor Info Page/SensorPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EconomicUnitsPage from './pages/EconomicUnits'
import WasteUtintsPage from './pages/WasteUtints'
import { ActivityPage } from './pages/ActivityPage/ActivityPage.tsx';
import { RegionActivityPage } from './pages/region-activity-page/region-activity.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Map />} />
        <Route path='/location/:id' element={<Location />} />
        <Route path='/sensor/:id' element={<SensorPage />} />
        <Route path='/economic-units' element={<EconomicUnitsPage />} />
        <Route path='/waste-units' element={<WasteUtintsPage />} />
        <Route path='/activity/:id' element={<ActivityPage />} />
        <Route path='/region-activity' element={<RegionActivityPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
