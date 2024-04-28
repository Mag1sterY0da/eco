import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { API_URL } from 'utils/const/apiUrl'

const getGradientTextColor = (value, min, max) => {
  const ratio = (value - min) / (max - min)
  // Further reduced the green (G) and blue (B) components to make low values darker
  const color = `rgb(${Math.round(173 + (0 - 173) * ratio)}, 
                      ${Math.round(216 + (150 - 216) * ratio)}, 
                      ${Math.round(230 + (255 - 230) * ratio)})`
  return color
}
const renderTableForIndicator = (indicator, data) => {
  const values = data.map(item => item.value)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return (
    <Stack direction='column'>
      <Typography variant='h6' component='div' sx={{ my: 2 }}>
        {indicator}
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4, width: '300px' }}>
        <Table aria-label={`${indicator} table`}>
          <TableHead>
            <TableRow>
              <TableCell>Місто</TableCell>
              <TableCell align='right'>Значення</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.city}</TableCell>
                <TableCell
                  align='right'
                  style={{
                    color: getGradientTextColor(item.value, min, max)
                  }}
                >
                  {Math.trunc(item.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

const WasteUtintsPage = () => {
  const [unitsData, setUnitsData] = useState([])

  console.log(unitsData)

  useEffect(() => {
    axios.get(`${API_URL}/integral-indicator/waste`).then(res => {
      setUnitsData(res.data)
    })
  }, [])

  return (
    <Container maxWidth={'xl'} sx={{ my: 5 }}>
      <Typography variant='h4'>Показники по відходах</Typography>
      <Stack direction='row' gap={4} flexWrap={'wrap'}>
        {Object.entries(unitsData).map(([indicator, data]) => renderTableForIndicator(indicator, data))}
      </Stack>
    </Container>
  )
}

export default WasteUtintsPage
