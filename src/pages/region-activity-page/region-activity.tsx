import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from 'utils/const/apiUrl.ts';
import { useFormik } from 'formik';
import { Container, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export const RegionActivityPage = () => {
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState('');
    const [activities, setActivities] = useState([]);

    const formik = useFormik({
        initialValues: {
            city: ''
        },
        onSubmit: values => {
            onSubmit(values);
        }
    });

    const onSubmit = (values) => {

    }

    useEffect(() => {
        axios.get(`${API_URL}/cities`).then(res => {
            setCities(res.data);
        });
    }, []);

    const handleCityChange = e => {
        const selected = e.target.value
        setCity(selected)
        axios.get(`${API_URL}/activities?city=${selected}`).then(res => {
            setActivities(res.data)
        });
    }

    const getUniqueYears = (activities) => {
        const years = [];
        Object.values(activities).forEach(act => {
            act.forEach(el => {
                el.data.forEach(({year}) => {
                    if (!years.includes(year)) {
                        years.push(year);
                    }
                })
            })

        })
        return years;
    }

    const getSum = (activities) => {
        const years = getUniqueYears(activities);
        const datas = [];
        const res = {};
        Object.values(activities).forEach(act => {
            act.forEach(el => {
                el.data.forEach(data => {
                    datas.push(data);
                })
            })

        })
        datas.forEach((el) => {
            if(res[el.year]) {
                res[el.year] += el.value;
            } else {
                res[el.year] = el.value;
            }
        })
        return res;
    }

    return (
        <Container sx={{py:3}}>
            <FormControl fullWidth sx={{ my: 3 }}>
                <InputLabel htmlFor='grouped-select'>Оберіть місто</InputLabel>
                <Select
                    name='category'
                    value={city}
                    onChange={handleCityChange}
                    id='grouped-select'
                    label='Оберіть категорію'
                >
                    {cities.map(el => (
                        <MenuItem key={el} value={el}>
                            {el}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {
                Object.keys(activities).map(sensor => {
                    return (
                        <>
                            <h2>{sensor}</h2>
                            <table border={1} cellSpacing={0}>
                                <tbody>
                                <tr>
                                    <th>Оперативні цілі, завдання та заходи Стратегії</th>
                                    <th>Нормативний документ</th>
                                    <th colSpan={3}>Обсяги фінансування, тис.грн</th>
                                </tr>
                                {Object.keys(activities[sensor]).map((el, idx) => {
                                    return (
                                        <>
                                            <tr key={idx}>
                                                <td colSpan={5} align={'center'}><b>{el}</b></td>
                                            </tr>
                                            {activities[sensor][el].map((act, index) => {
                                                return (
                                                    <>
                                                        <tr key={index}>
                                                            <td rowSpan={2}>{act.name}</td>
                                                            <td rowSpan={2}>{act.document}</td>
                                                            {act.data.map(({year}) => {
                                                                return (
                                                                    <td><i>{year} рік</i></td>
                                                                )
                                                            })}
                                                        </tr>
                                                        <tr>
                                                            {act.data.map(({value}) => {
                                                                return (
                                                                    <td><u>{value}</u></td>
                                                                )
                                                            })}
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                        </>
                                    )
                                })}
                                <tr>
                                    <td rowSpan={2} colSpan={2} align={'right'}>Всього</td>
                                    {getUniqueYears(activities[sensor]).map(year => {
                                        return (
                                            <td><i>{year} рік</i></td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    {Object.values(getSum(activities[sensor])).map(val => {
                                        return (
                                            <td><u>{val}</u></td>
                                        )
                                    })}
                                </tr>
                                </tbody>
                            </table>
                        </>
                    )
                })
            }
        </Container>
    )
}
