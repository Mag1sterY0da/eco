import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios'
import AddSensorOnClick from 'components/AddSensor'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { Location } from 'types/Location.ts'
import { API_URL } from '../../utils/const/apiUrl.ts'
import './Map.scss'
import CreateActivityForm from 'components/CreateActivityForm/CreateActivityForm.tsx';

const icon = new Icon({
  iconUrl: '/marker.png',
  iconSize: [38, 38]
})

const Map = () => {
  const [locations, setLocations] = useState<Location[]>([])
  const [allIndicators, setAllIndicators] = useState([])
  const [category, setCategory] = useState('')
  const [indicator, setIndicator] = useState(1)

  useEffect(() => {
    axios.get(`${API_URL}/locations`).then(res => {
      setLocations(res.data)
    })
    axios.get(`${API_URL}/indicators`).then(res => {
      setAllIndicators(res.data)
    })
  }, [])

  const handleCategoryChange = e => {
    const selected = e.target.value
    setCategory(selected)
    axios
      .get(`${API_URL}/locations`, {
        params: {
          category: selected
        }
      })
      .then(res => {
        setLocations(res.data)
      })
  }

  const handleIndicatorChange = e => {
    const selected = e.target.value
    setIndicator(selected)
    axios
      .get(`${API_URL}/locations`, {
        params: {
          indicatorId: selected
        }
      })
      .then(res => {
        setLocations(res.data)
      })
  }

  return (
    <div className='map-wrapper'>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1000,
          width: '300px',
          height: '370px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px'
        }}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor='grouped-select'>Шар</InputLabel>
          <Select name='category' value={category} onChange={handleCategoryChange} id='grouped-select' label='Шар'>
            {Object.keys(allIndicators).map(el => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel htmlFor='grouped-select'>Показники</InputLabel>
          <Select
            disabled={!category}
            name='indicators'
            value={indicator}
            onChange={handleIndicatorChange}
            id='grouped-select'
            label='Показники'
          >
            {allIndicators[category]?.map(el => (
              <MenuItem key={el.id} value={el.id}>
                {el.name}
              </MenuItem>
            ))}
          </Select>
          <Link to={`/economic-units`}>
            <Button variant='contained' sx={{ mt: 3 }} onClick={() => console.log(locations)}>
              Оцінка економічних показників
            </Button>
          </Link>
          <Link to={`/waste-units`}>
            <Button variant='contained' sx={{ mt: 3, width: '100%' }} onClick={() => console.log(locations)}>
              Відходи
            </Button>
          </Link>
            <Link to={`/region-activity`}>
                <Button variant='contained' sx={{ mt: 3, width: '100%' }} onClick={() => console.log(locations)}>
                    Заходи по регіонам
                </Button>
            </Link>
        </FormControl>
      </div>
      <MapContainer center={[50.4504, 30.5245]} zoom={13} className='map'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <AddSensorOnClick locations={locations} setLocations={setLocations} />
        {locations.map((m, i) => (
          <Marker position={[+m.latitude, +m.longitude]} icon={icon} key={i}>
            <Popup>
              <Link to={`/location/${m.id}`}>{m.address}</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default Map
