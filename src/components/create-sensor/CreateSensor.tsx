import {
    Box,
    Button,
    FormControl,
    InputLabel, ListSubheader,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../utils/const/apiUrl.ts';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const mockedIndicators = {
    "Стан водних ресурсів": [
        {
            "id": 2,
            "name": "Test Indicator 2",
            "type": "Стан водних ресурсів",
            "unit": "Test unit 2",
            "data": null
        },
        {
            "id": 3,
            "name": "Test Indicator 3",
            "type": "Стан водних ресурсів",
            "unit": "Test unit 3",
            "data": null
        }
    ],
    "Стан повітря": [
        {
            "id": 1,
            "name": "Test Indicator 1",
            "type": "Стан повітря",
            "unit": "Test unit",
            "data": null
        }
    ],
    "Стан радіації": [
        {
            "id": 4,
            "name": "Test Indicator 4",
            "type": "Стан радіації",
            "unit": "Test unit 4",
            "data": null
        }
    ]
}

const CreateSensor = ({ onSubmit }) => {
    const [indicators, setIndicators] = useState(mockedIndicators);

    // useEffect(() => {
    //     axios.get(`${API_URL}/indicators`).then(res => {
    //         setIndicators(res.data);
    //     });
    // }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            indicators: [],
        },
        onSubmit: (values) => {
            onSubmit(values);
        },
    });
    return (
        <Modal
            open={true}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={3}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Додавання датчика
                        </Typography>
                        <TextField name="name"
                                   value={formik.values.name}
                                   onChange={formik.handleChange}
                                   id="outlined-basic"
                                   label="Назва датчика"
                                   variant="outlined"
                        />
                        <FormControl>
                            <InputLabel htmlFor="grouped-select">Показники</InputLabel>
                            <Select name="indicators"
                                    value={formik.values.indicators}
                                    onChange={formik.handleChange}
                                    id="grouped-select"
                                    label="Показники"
                                    multiple
                            >
                                {Object.entries(indicators).map((entry) => {
                                    const [group, items] = entry;
                                    return [
                                        <ListSubheader key={`header-${group}`}>{group}</ListSubheader>,
                                        ...items.map(el => (
                                            <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
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
    );
};

export default CreateSensor;
