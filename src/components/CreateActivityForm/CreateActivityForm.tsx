import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from 'utils/const/apiUrl.ts';
import { useFormik } from 'formik';
import {
    Box, Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

const CreateActivityForm = ({ id, showDeleteBtn, act }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/types`).then(res => {
            setCategories(res.data);
        });
    }, []);

    const initialValues = {
            name: '',
            document: 'asdasd',
            sensorId: 1,
            typeId: '',
            data: [
                { year: 2024, value: 0 }
            ]
        };

    const formik = useFormik({
        initialValues: act.id ? act : initialValues,
        onSubmit: values => {
            onSubmit(values);
        }
    });
    const handleDataChange = (index, field, value) => {
        const { data } = formik.values;
        data[index][field] = value;
        formik.setFieldValue('data', data);
    };
    const addYearField = () => {
        formik.setFieldValue('data', [...formik.values.data, { year: 2024, value: 0 }]);
    };

    const onSubmit = (values) => {
        values.sensorId = id;
        values.data = values.data.map(el => ({ year: +el.year, value: +el.value }))
        if (showDeleteBtn) {
            axios.put(`${API_URL}/activities`, values).then(() => {
                window.location.reload();
            });
        } else {
            axios.post(`${API_URL}/activities`, values).then(() => {
                window.location.reload();
            });
        }
    }

    const deleteAct = () => {
        axios.delete(`${API_URL}/activities/${act.id}`).then(res => {
            window.location.reload();
        });
    }

    return (
        <Modal open={true} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
            <Box sx={style}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={3}>
                        <Typography id='modal-modal-title' variant='h6' component='h2'>
                            Додавання заходу
                        </Typography>
                        <FormControl>
                            <InputLabel htmlFor='grouped-select'>Категорія</InputLabel>
                            <Select
                                name='typeId'
                                value={formik.values.typeId}
                                onChange={formik.handleChange}
                                id='grouped-select'
                                label='Категорія'
                            >
                                {categories.map(category => {
                                    return (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            name='name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            id='outlined-basic'
                            label='Захід'
                            variant='outlined'
                        />

                        <TextField
                            name='document'
                            value={formik.values.document}
                            onChange={formik.handleChange}
                            id='outlined-basic'
                            label='Нормативний документ'
                            variant='outlined'
                        />
                        <div style={{overflow: 'auto', maxHeight: '250px', padding: '10px 0'}}>
                            {formik.values.data.map((detail, index) => (
                                <Stack direction='row' key={index} spacing={2} sx={{mb: 2}}>
                                    <TextField
                                        name={`details[${index}].year`}
                                        value={detail.year}
                                        onChange={e => handleDataChange(index, 'year', e.target.value)}
                                        id={`outlined-basic-${index}`}
                                        label='Рік'
                                        variant='outlined'
                                        fullWidth
                                        type={'number'}
                                    />
                                    <TextField
                                        name={`details[${index}].value`}
                                        value={detail.value}
                                        onChange={e => handleDataChange(index, 'value', e.target.value)}
                                        id={`outlined-basic-value-${index}`}
                                        label='Ціна'
                                        variant='outlined'
                                        fullWidth
                                        type={'number'}
                                    />
                                </Stack>
                            ))}
                        </div>
                        <Button color='primary' variant='contained' fullWidth type='button' onClick={addYearField}>
                            Додати Рік і Ціну
                        </Button>
                        <Button color='primary' variant='contained' fullWidth type='submit'>
                            { showDeleteBtn ? 'Редагувати' : 'Додати'}
                        </Button>
                        {showDeleteBtn ? <Button color="error" variant="contained" fullWidth type="button" onClick={deleteAct}>
                            Видалити
                        </Button> : null }
                    </Stack>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateActivityForm;
