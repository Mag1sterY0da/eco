import { Box, Stack, Typography } from '@mui/material'

enum PollutionLevel {
  Небезпечний = '#f44336',
  Високий = '#ff9800',
  Нормальний = '#4caf50',
  Низький = '#2196f3'
}

const getColorForLevel = (level: string): string => {
  return PollutionLevel[level as keyof typeof PollutionLevel] || '#000000'
}

const SensorData = ({ data }) => {
  if (data.value === -1) return null

  return (
    <Stack direction='row' spacing={3}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: getColorForLevel(data.message),
          borderRadius: '12px',
          width: '70px',
          height: '70px'
        }}
      >
        <Stack direction='column' sx={{ color: 'white', textAlign: 'center' }}>
          <Typography variant='h6'>{data.value.toFixed(2)}</Typography>
          <Typography variant='body2'>{data.unit}</Typography>
        </Stack>
      </Box>
      <Stack direction='column' justifyContent='center'>
        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
          {data.message}
        </Typography>
        <Typography variant='body2'>{data.date}</Typography>
        <Typography variant='body2'>{data.name}</Typography>
      </Stack>
    </Stack>
  )
}

export default SensorData
