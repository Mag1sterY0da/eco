import Location from 'components/Location';
import Map from 'components/Map';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Map />} />
        <Route path='/location/:id' element={<Location />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
