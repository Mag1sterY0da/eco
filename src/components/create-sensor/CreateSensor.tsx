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

const CreateSensor = () => {
    const formik = useFormik({
        initialValues: {
            name: '',
            indicators: [],
        },
        onSubmit: (values) => {
            console.log(values);
            // axios.post('', values).then(console.log);
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
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <ListSubheader>Category 1</ListSubheader>
                                <MenuItem value={1}>Option 1</MenuItem>
                                <MenuItem value={2}>Option 2</MenuItem>
                                <ListSubheader>Category 2</ListSubheader>
                                <MenuItem value={3}>Option 3</MenuItem>
                                <MenuItem value={4}>Option 4</MenuItem>
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
