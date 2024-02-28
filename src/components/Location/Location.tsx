import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Location } from 'types/Location';
import { API_URL } from 'utils/const/apiUrl';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};

const Location = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<Location | null>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [value, setValue] = useState<Dayjs | null>(dayjs(new Date()));

  useEffect(() => {
    axios.get(`${API_URL}/locations/${id}`).then(res => {
      setLocation(res.data);
    });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      value: 0,
      indicators: 1
    },
    onSubmit: values => {
      const data = {
        value: values.value,
        date: value?.format('YYYY-MM-DD'),
        time: value?.format('HH:mm')
      };
      console.log(data);
    }
  });

  console.log(location);

  return (
    <>
      <Container sx={{ my: 5 }}>
        <Typography variant='h2'>Локація</Typography>
        <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>
          {location?.region}, {location?.city}, {location?.address}
        </Typography>
        <Stack direction='row' spacing={2}>
          <Button variant='contained' color='primary'>
            Додати датчик
          </Button>
          <Button variant='outlined' onClick={handleOpen}>
            Додати значення показників
          </Button>
        </Stack>
        <Box sx={{ my: 3 }}>
          {location?.sensors.map(sensor => {
            return sensor?.indicators.map((indicator, i) => (
              <p key={i}>
                <b>{sensor.name}</b>: {indicator.data?.value} {indicator.unit}({indicator.data?.date} -{' '}
                {indicator.data?.time})
              </p>
            ));
          })}
        </Box>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                Додавання значення показника до датчика
              </Typography>
              <FormControl>
                <InputLabel htmlFor='grouped-select'>Показники</InputLabel>
                <Select
                  name='indicators'
                  value={formik.values.indicators}
                  onChange={formik.handleChange}
                  id='grouped-select'
                  label='Показники'
                >
                  {location?.sensors.map(sensor => (
                    <MenuItem key={sensor.id} value={sensor.id}>
                      {sensor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name='value'
                value={formik.values.value}
                onChange={formik.handleChange}
                id='outlined-basic'
                label='Значення'
                variant='outlined'
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker label='Controlled picker' value={value} onChange={newValue => setValue(newValue)} />
                </DemoContainer>
              </LocalizationProvider>
              <Button color='primary' variant='contained' fullWidth type='submit'>
                Додати
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Location;
