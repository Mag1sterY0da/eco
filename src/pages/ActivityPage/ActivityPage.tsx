import { Button, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import CreateActivityForm from 'components/CreateActivityForm/CreateActivityForm.tsx';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from 'utils/const/apiUrl.ts';

export const ActivityPage = () => {
    const { id } = useParams();
    const [showForm, setShowForm] = useState(false);
    const [activities, setActivities] = useState([]);
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);
    const [act, setAct] = useState({});

    useEffect(() => {
        axios.get(`${API_URL}/activities?sensorId=${id}`).then(res => {
            setActivities(res.data);
            console.log(res.data);
        });
    }, []);

    const openEditing = (act) => {
        setShowDeleteBtn(true);
        setShowForm(true);
        setAct(act);
    }

    const getUniqueYears = () => {
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

    const getSum = () => {
        const years = getUniqueYears();
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
        <Container sx={{py: 3}}>
            <Button sx={{mb:3}} color='primary' variant='contained' onClick={() => setShowForm(true)}>Додати захід</Button>
            {
                showForm ? <CreateActivityForm id={id} showDeleteBtn={showDeleteBtn} act={act}/> : null
            }
            <table border={1} cellSpacing={0}>
                <tbody>
                <tr>
                    <th>Оперативні цілі, завдання та заходи Стратегії</th>
                    <th>Нормативний документ</th>
                    <th colSpan={3}>Обсяги фінансування, тис.грн</th>
                </tr>
                {Object.keys(activities).map((el, idx) => {
                    return (
                        <>
                            <tr key={idx}>
                                <td colSpan={5} align={'center'}><b>{el}</b></td>
                            </tr>
                            {activities[el].map((act, index) => {
                                return (
                                    <>
                                        <tr key={index} onClick={() => openEditing(act)}>
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
                    {getUniqueYears().map(year => {
                        return (
                            <td><i>{year} рік</i></td>
                        )
                    })}
                </tr>
                <tr>
                    {Object.values(getSum()).map(val => {
                        return (
                            <td><u>{val}</u></td>
                        )
                    })}
                </tr>
                </tbody>
            </table>
        </Container>

    )
}
