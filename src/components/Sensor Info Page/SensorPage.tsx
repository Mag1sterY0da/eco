import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import SensorData from 'components/SensorData'
import { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { useParams } from 'react-router-dom'
import { API_URL } from 'utils/const/apiUrl.ts'

const EnergyUsageTable = ({ year, data }) => {
  return (
    <>
      <Typography variant='h6' gutterBottom component='div'>
        {year}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label='energy usage table'>
          <TableHead>
            <TableRow>
              <TableCell>Місяць</TableCell>
              <TableCell>Значення</TableCell>
              <TableCell>Робочі дні</TableCell>
              <TableCell>Середньодобове</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([month, monthData]) => (
              <TableRow key={`${year}-${monthData.month}`}>
                <TableCell>{monthData.month}</TableCell>
                <TableCell>{monthData.value.toFixed(3)}</TableCell>
                <TableCell>{monthData.workingDays}</TableCell>
                <TableCell>{monthData.avg.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const MinMaxtable = ({ title, data }) => {
  return (
    <>
      <Typography variant='h6' gutterBottom component='div'>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label='energy usage table'>
          <TableHead>
            <TableRow>
              <TableCell>Місяць</TableCell>
              <TableCell>Значення</TableCell>
              <TableCell>Робочі дні</TableCell>
              <TableCell>Середньодобове</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={`${data.month}`}>
              <TableCell>{data.month}</TableCell>
              <TableCell>{data.value.toFixed(3)}</TableCell>
              <TableCell>{data.workingDays}</TableCell>
              <TableCell>{data.avg.toFixed(3)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const timeLabels = Array.from({ length: 24 }, (_, i) => ('0' + i).slice(-2))

export const SensorPage = () => {
  const { id } = useParams()

  const [tableData, setTableData] = useState([])
  const [category, setCategory] = useState('')
  const [allIndicators, setAllIndicators] = useState([])
  const [avgData, setAvgData] = useState([])
  const [maxData, setMaxData] = useState([])
  const [lineChartData, setLineChartData] = useState([])
  const [integralData, setIntegralData] = useState([])
  const [integatorCons, setIntegatorCons] = useState([])
  const [integralIndicatorData, setIntegralIndicatorData] = useState({})

  useEffect(() => {
    axios.get(`${API_URL}/indicators`).then(res => {
      setAllIndicators(res.data)
    })
    axios.get(`${API_URL}/integral-indicator/${id}`).then(result => {
      setIntegralData(result.data)
    })
    axios.get(`${API_URL}/indicators/cons`).then(result => {
      setIntegatorCons(result.data)
    })
  }, [id])

  useEffect(() => {
    // Make sure integatorCons is not empty
    if (integatorCons.length > 0) {
      // Create a temporary object to store the data
      const newData = { ...integralIndicatorData }

      // Use a promise-based approach to handle multiple requests
      const requests = integatorCons.map(indicator =>
        axios.get(`${API_URL}/integral-indicator/consumption?sensorId=${id}&indicatorId=${indicator.id}`)
      )

      // Wait for all requests to complete
      Promise.all(requests).then(results => {
        results.forEach((result, index) => {
          // Use the indicator id as key to store the data
          newData[integatorCons[index].name] = result.data
        })

        // Update the integralIndicatorData state with the new data
        setIntegralIndicatorData(newData)
      })
    }
  }, [integatorCons, id])

  const handleCategoryChange = e => {
    const selected = e.target.value
    setCategory(selected)
    axios.get(`${API_URL}/data/table?sensorId=${id}&category=${selected}`).then(res => {
      setTableData(res.data)
    })
    axios.get(`${API_URL}/data/histogram?sensorId=${id}&category=${selected}`).then(res => {
      setAvgData(res.data.avg)
      setMaxData(res.data.max)
    })
    axios.get(`${API_URL}/data/day?sensorId=${id}&category=${selected}`).then(result => {
      setLineChartData(result.data)
    })
  }

  console.log(integralIndicatorData)

  const randomColor = num => {
    const res = []
    for (let i = 0; i < num; i++) {
      const r = Math.floor(Math.random() * 256) // Random value between 0 and 255 for red
      const g = Math.floor(Math.random() * 256) // Random value between 0 and 255 for green
      const b = Math.floor(Math.random() * 256) // Random value between 0 and 255 for blue
      res.push('rgb(' + r + ', ' + g + ', ' + b + ')')
    }
    return res
  }

  return (
    <Container maxWidth={'xl'} sx={{ my: 5 }}>
      <Stack direction='row' gap={2} flexWrap='wrap'>
        {integralData?.map((el, i) => (
          <SensorData key={i} data={el} />
        ))}
      </Stack>
      <FormControl fullWidth sx={{ my: 3 }}>
        <InputLabel htmlFor='grouped-select'>Оберіть категорію</InputLabel>
        <Select
          name='category'
          value={category}
          onChange={handleCategoryChange}
          id='grouped-select'
          label='Оберіть категорію'
        >
          {Object.keys(allIndicators).map(el => (
            <MenuItem key={el} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Показник</TableCell>
              <TableCell align='right'>Дата</TableCell>
              <TableCell align='right'>Одиниця виміру</TableCell>
              <TableCell align='right'>Середнє значення</TableCell>
              <TableCell align='right'>ГДК average</TableCell>
              <TableCell align='right'>Перевищення</TableCell>
              <TableCell align='right'>Max викидів</TableCell>
              <TableCell align='right'>ГДК max</TableCell>
              <TableCell align='right'>Перевищення</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, idx) => (
              <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {row.indicatorName}
                </TableCell>
                <TableCell align='right'>{row.date}</TableCell>
                <TableCell align='right'>{row.unit}</TableCell>
                <TableCell align='right'>{row.average}</TableCell>
                <TableCell align='right'>{row.tlk}</TableCell>
                <TableCell align='right'>{row.exceeding}</TableCell>
                <TableCell align='right'>{row.max}</TableCell>
                <TableCell align='right'>{row.tlkMax}</TableCell>
                <TableCell align='right'>{row.maxExceeding}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {avgData.length ? (
        <Stack direction='row' spacing={2} sx={{ mt: 5, mb: 5 }}>
          <div
            style={{
              width: '50%',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>Графік середніх значень</Typography>
            <Pie
              data={{
                labels: avgData.map(el => el.indicatorName),
                datasets: [
                  {
                    label: 'Avg',
                    data: avgData.map(el => el.value),
                    backgroundColor: randomColor(avgData.length),
                    hoverOffset: 4
                  }
                ]
              }}
            />
          </div>
          <div
            style={{
              width: '50%',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>Графік максимальних значень</Typography>
            <Pie
              data={{
                labels: maxData.map(el => el.indicatorName),
                datasets: [
                  {
                    label: 'Max',
                    data: maxData.map(el => el.value),
                    backgroundColor: randomColor(maxData.length),
                    hoverOffset: 4
                  }
                ]
              }}
            />
          </div>
        </Stack>
      ) : null}
      {Object.entries(integralIndicatorData).map(([indicatorName, yearsData]) => {
        // Check if there is data for any year, if not, don't render this indicator
        const hasData = Object.values(yearsData).some(
          yearData => yearData.data && Object.keys(yearData.data).length > 0
        )

        return hasData ? (
          <div key={indicatorName}>
            <Typography variant='h5' gutterBottom component='div'>
              {indicatorName}
            </Typography>
            {Object.entries(yearsData).map(([year, yearData]) => (
              <>
                <EnergyUsageTable key={year} year={year} data={yearData.data} />
                <Typography variant='body1' sx={{ my: 1 }}>
                  Середнє значення: {yearData.avg.toFixed(3)}
                </Typography>
                <Typography variant='body1' sx={{ my: 1 }}>
                  Коефіцієнт нерівністості: {yearData.cof.toFixed(3)}
                </Typography>
                <MinMaxtable title={'Мінімальні значення'} data={yearData?.min} />
                <MinMaxtable title={'Максимальні значення'} data={yearData?.max} />
              </>
            ))}
          </div>
        ) : null // Return null if there is no data
      })}

      {lineChartData.length ? (
        <Stack flexWrap={'wrap'} direction='row' spacing={2} sx={{ mt: 5 }}>
          {lineChartData.map(lineChart => (
            <div
              style={{
                width: '48%',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Bar
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const
                    },
                    title: {
                      display: true,
                      text: lineChart.chartName
                    }
                  },
                  scales: {
                    x: {
                      type: 'category',
                      labels: timeLabels
                    }
                  }
                }}
                data={{
                  datasets: [
                    {
                      label: 'Value',
                      data: timeLabels.map(label => lineChart.values[label] ?? 0),
                      backgroundColor: randomColor(avgData.length)
                    }
                  ]
                }}
              />
            </div>
          ))}
        </Stack>
      ) : null}
    </Container>
  )
}
