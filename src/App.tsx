import Map from 'components/Map';
import Sensor from 'components/Sensor';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Map />} />
        <Route path='/sensor/:id' element={<Sensor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
