import { useParams } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import { Sensor } from 'types/Sensor.ts';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const mockedSensor: Sensor = {
    'id': 6,
    'name': 'Test6',
    'location': {
        'id': 2,
        'region': 'Kyiv',
        'city': 'Kyiv',
        'address': 'Street',
        'longitude': '123.123132',
        'latitude': '12.123124'
    },
    'indicators': [
        {
            'id': 1,
            'name': 'Test Indicator 1',
            'type': 'Стан повітря',
            'unit': 'Test unit',
            'data': {
                'id': 3,
                'value': 123.0,
                'date': '2024-02-27',
                'time': '21:45'
            }
        },
        {
            'id': 2,
            'name': 'Test Indicator 2',
            'type': 'Стан водних ресурсів',
            'unit': 'Test unit 2',
            'data': null
        }
    ]
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const Sensor = () => {
    const {id} = useParams();
    const [sensor, setSensor] = useState<Sensor>(mockedSensor);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [value, setValue] = useState<Dayjs | null>(dayjs(new Date()));

    useEffect(() => {
        // http request
    }, []);

    const formik = useFormik({
        initialValues: {
            value: 0,
            indicators: 1,
        },
        onSubmit: (values) => {
            const data = {
                value: values.value,
                date: value?.format('YYYY-MM-DD'),
                time: value?.format('HH:mm')
            }
            console.log(data);
        },
    });

    return (
        <>
            <Container sx={{my: 5}}>
                <Typography variant="h2">
                    Датчик - {sensor?.name}
                    <Button sx={{ml: 10}} variant="outlined" onClick={handleOpen}>Додати значення показників</Button>
                </Typography>
                <Typography variant="h5" gutterBottom sx={{mb: 3}}>
                    {sensor?.location.region}, {sensor?.location.city}, {sensor?.location.address}
                </Typography>
                {sensor?.indicators.map(indicator => {
                    if (indicator.data) {
                        return (
                            <p key={indicator.id}>
                                <b>{indicator.name}</b> = {indicator.data?.value} {indicator.unit} ({indicator.data?.date} - {indicator.data?.time})
                            </p>
                        );
                    }
                })}
            </Container>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={3}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Додавання значення показника до датчика
                            </Typography>
                            <FormControl>
                                <InputLabel htmlFor="grouped-select">Показники</InputLabel>
                                <Select name="indicators"
                                        value={formik.values.indicators}
                                        onChange={formik.handleChange}
                                        id="grouped-select"
                                        label="Показники"
                                >
                                    {sensor.indicators.map(el =>
                                        <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <TextField name="value"
                                       value={formik.values.value}
                                       onChange={formik.handleChange}
                                       id="outlined-basic"
                                       label="Значення"
                                       variant="outlined"
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker
                                        label="Controlled picker"
                                        value={value}
                                        onChange={(newValue) => setValue(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Додати
                            </Button>
                        </Stack>

                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default Sensor;
