import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel, ListSubheader,
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
import CreateSensor from 'components/create-sensor/CreateSensor.tsx';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
    const [allIndicators, setAllIndicators] = useState([]);

    const [anotherIndicators, setAnotherIndicators] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/indicators`).then(res => {
            setAllIndicators(res.data);
        });
    }, []);
    const {id} = useParams();
    const locationAddressRef = useRef(null);
    const sensorNameRef = useRef(null);
    const [location, setLocation] = useState<Location | null>(null);

    const [openCreateSensor, setOpenCreateSensor] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = id => {
        setOpen(true);
        setChosenSensor(id);
    };
    const handleClose = () => setOpen(false);

    const [openAddIndicator, setOpenAddIndicator] = useState(false);
    const handleOpenAddIndicator = sensor => {
        setOpenAddIndicator(true);
        const anotherIndicators = JSON.parse(JSON.stringify(allIndicators));
        for (const key of Object.keys(anotherIndicators)) {
            sensor.indicators.forEach(indicator => {
                anotherIndicators[key] = anotherIndicators[key].filter(el => el.id !== indicator.id);
            });
        }
        setChosenSensor(sensor.id);
        setAnotherIndicators(anotherIndicators);
    };
    const handleCloseAddIndicator = () => setOpenAddIndicator(false);

    const [chosenSensor, setChosenSensor] = useState(0);

    const [value, setValue] = useState<Dayjs | null>(dayjs(new Date()));

    const createSensor = values => {
        const sensor = {
            ...values,
            locationId: location?.id
        };
        axios.post(`${API_URL}/sensors`, sensor).then(res => {
            axios.get(`${API_URL}/locations/${id}`).then(res => {
                setLocation(res.data);
                setOpenCreateSensor(false);
            });
        });
    };

    const deleteLocation = (id: number) => {
        axios.delete(`${API_URL}/locations/${id}`);
        window.location.href = '/';
    };

    const deleteSensor = (sensorId: number) => {
        axios.delete(`${API_URL}/sensors/${sensorId}`).then(() => {
            axios.get(`${API_URL}/locations/${id}`).then(res => {
                setLocation(res.data);
            });
        });
    };

    const deleteIndicator = (sensorId: number, indicatorId: number) => {
        axios.delete(`${API_URL}/sensors/${sensorId}/indicators/${indicatorId}`).then(() => {
            axios.get(`${API_URL}/locations/${id}`).then(res => {
                setLocation(res.data);
            });
        });
    };

    const updateLocationAddress = (id: number, address: string) => {
        axios.put(`${API_URL}/locations/${id}`, {address}).then(() => {
            axios.get(`${API_URL}/locations/${id}`).then(res => {
                setLocation(res.data);
            });
        });
    };

    const updateSensorName = (sensorId: number, name: string) => {
        axios.put(`${API_URL}/sensors/${sensorId}`, {name}).then(() => {
            axios.get(`${API_URL}/locations/${id}`).then(res => {
                setLocation(res.data);
            });
        });
    };

    const formik = useFormik({
        initialValues: {
            value: 0,
            indicators: 1
        },
        onSubmit: values => {
            const data = {
                value: values.value,
                indicatorId: values.indicators,
                date: value?.format('YYYY-MM-DD'),
                time: value?.format('HH:mm'),
                sensorId: chosenSensor
            };
            axios.post(`${API_URL}/data`, data).then(res => {
                axios.get(`${API_URL}/locations/${id}`).then(res => {
                    setLocation(res.data);
                    setOpen(false);
                });
            });
        }
    });

    useEffect(() => {
        axios.get(`${API_URL}/locations/${id}`).then(res => {
            setLocation(res.data);
        });
    }, [id]);


    const formik2 = useFormik({
        initialValues: {
            indicators: []
        },
        onSubmit: values => {
            const data = {
                indicators: values.indicators,
            };
            console.log(data);
            axios.put(`${API_URL}/sensors/${chosenSensor}/indicators`, data).then(res => {
                axios.get(`${API_URL}/locations/${id}`).then(res => {
                    setLocation(res.data);
                    setOpen(false);
                });
            });
        }
    });

    return (
        <>
            <Container maxWidth={'xl'} sx={{my: 5}}>
                <Typography variant="h2">Локація</Typography>
                <Typography variant="h5" gutterBottom sx={{mb: 3}}>
                    {location?.region}, {location?.city}, {location?.address}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={() => setOpenCreateSensor(true)}>
                        Додати датчик
                    </Button>

                    <TextField inputRef={locationAddressRef} defaultValue={location?.address}/>
                    <Button
                        variant="contained"
                        onClick={() => updateLocationAddress(location?.id, locationAddressRef.current.value)}
                    >
                        Змінити адресу
                    </Button>
                    <Button variant="contained" color="error" onClick={() => id && deleteLocation(Number(id))}>
                        Видалити локацію
                    </Button>
                </Stack>
                {location?.sensors.length ? <Stack direction="row" spacing={2} sx={{my: 2}}>
                    <TextField inputRef={sensorNameRef} label="Нова назва датчика"/>
                </Stack> : null}
                <Box sx={{my: 3}}>
                    {location?.sensors.map(sensor => {
                        return (
                            <Box key={sensor.id} sx={{my: 3}}>
                                <Stack direction="row" spacing={2} style={{fontSize: '1.5rem'}}>
                                    <b>Датчик - {sensor.name}</b>
                                    <Button variant="outlined" onClick={() => handleOpenAddIndicator(sensor)}>
                                        Додати показники
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleOpen(sensor.id)}>
                                        Додати значення показників
                                    </Button>
                                    <Button variant="contained"
                                            onClick={() => updateSensorName(sensor?.id, sensorNameRef.current.value)}>
                                        Змінити назву
                                    </Button>
                                    <Button variant="outlined" color="error" onClick={() => deleteSensor(sensor.id)}>
                                        Видалити датчик
                                    </Button>
                                    <Button variant="contained">
                                        <Link to={`/sensor/${sensor.id}`}>
                                            Сторінка датчика</Link>
                                    </Button>
                                </Stack>
                                <Box sx={{ms: 3}}>
                                    {sensor?.indicators.map(
                                        (indicator, i) =>
                                            indicator.data && (
                                                <Stack direction="row" alignItems="center" sx={{my: 1}} gap={1} key={i}>
                                                    <Typography variant="body1">
                                                        <span style={{fontSize: '1.1rem'}}>{indicator.name}</span> {' = '}
                                                        {indicator.data?.value} {indicator.unit}({indicator.data?.date} - {indicator.data?.time})
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => deleteIndicator(sensor.id, indicator.id)}
                                                    >
                                                        Видалити
                                                    </Button>
                                                </Stack>
                                            )
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
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
                                <Select
                                    name="indicators"
                                    value={formik.values.indicators}
                                    onChange={formik.handleChange}
                                    id="grouped-select"
                                    label="Показники"
                                >
                                    {location?.sensors
                                        .find(sensor => sensor.id === chosenSensor)
                                        ?.indicators.map(el => (
                                            <MenuItem key={el.id} value={el.id}>
                                                {el.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <TextField
                                name="value"
                                value={formik.values.value}
                                onChange={formik.handleChange}
                                id="outlined-basic"
                                label="Значення"
                                variant="outlined"
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker label="Controlled picker" value={value}
                                                    onChange={newValue => setValue(newValue)}/>
                                </DemoContainer>
                            </LocalizationProvider>
                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Додати
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Modal>
            <Modal
                open={openAddIndicator}
                onClose={handleCloseAddIndicator}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={formik2.handleSubmit}>
                        <Stack spacing={3}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Додавання показника до датчика
                            </Typography>
                            <FormControl>
                                <InputLabel htmlFor="grouped-select">Показники</InputLabel>
                                <Select
                                    name="indicators"
                                    value={formik2.values.indicators}
                                    onChange={formik2.handleChange}
                                    id="grouped-select"
                                    label="Показники"
                                    multiple
                                >
                                    {Object.entries(anotherIndicators).map(entry => {
                                        const [group, items] = entry;
                                        return [
                                            <ListSubheader key={`header-${group}`}>{group}</ListSubheader>,
                                            ...items.map(el => (
                                                <MenuItem key={el.id} value={el.id}>
                                                    {el.name}
                                                </MenuItem>
                                            ))
                                        ];
                                    })}
                                </Select>
                            </FormControl>
                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Додати
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Modal>
            {openCreateSensor ? <CreateSensor onSubmit={createSensor}/> : null}
        </>
    );
};

export default Location;
