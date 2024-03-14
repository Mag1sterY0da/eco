import {
    Container, FormControl,
    InputLabel, MenuItem,
    Paper, Select, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from 'utils/const/apiUrl.ts';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, LinearScale, CategoryScale } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend);

const timeLabels = Array.from({length: 24}, (_, i) => ('0' + i).slice(-2))

export const SensorPage = () => {
    const {id} = useParams();

    const [tableData, setTableData] = useState([]);
    const [category, setCategory] = useState('');
    const [allIndicators, setAllIndicators] = useState([]);
    const [avgData, setAvgData] = useState([]);
    const [maxData, setMaxData] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/indicators`).then(res => {
            setAllIndicators(res.data);
        });
    }, []);

    const handleCategoryChange = (e) => {
        const selected = e.target.value;
        setCategory(selected);
        axios.get(`${API_URL}/data/table?sensorId=${id}&category=${selected}`).then(res => {
            setTableData(res.data);
        });
        axios.get(`${API_URL}/data/histogram?sensorId=${id}&category=${selected}`).then(res => {
            setAvgData(res.data.avg);
            setMaxData(res.data.max);
        });
        axios.get(`${API_URL}/data/day?sensorId=${id}&category=${selected}`).then(result => {
            setLineChartData(result.data);
        });
    };

    const randomColor = (num) => {
        const res = [];
        for (let i = 0; i < num; i++) {
            const r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
            const g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
            const b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue
            res.push('rgb(' + r + ', ' + g + ', ' + b + ')');
        }
        return res;
    };

    return (
        <Container maxWidth={'xl'} sx={{my: 5}}>
            <FormControl fullWidth sx={{mb: 3}}>
                <InputLabel htmlFor="grouped-select">Оберіть категорію</InputLabel>
                <Select
                    name="category"
                    value={category}
                    onChange={handleCategoryChange}
                    id="grouped-select"
                    label="Оберіть категорію"
                >
                    {Object.keys(allIndicators).map(el => (
                        <MenuItem key={el} value={el}>
                            {el}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Показник</TableCell>
                            <TableCell align="right">Дата</TableCell>
                            <TableCell align="right">Одиниця виміру</TableCell>
                            <TableCell align="right">Середнє значення</TableCell>
                            <TableCell align="right">ГДК average</TableCell>
                            <TableCell align="right">Перевищення</TableCell>
                            <TableCell align="right">Max викидів</TableCell>
                            <TableCell align="right">ГДК max</TableCell>
                            <TableCell align="right">Перевищення</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((row, idx) => (
                            <TableRow
                                key={idx}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.indicatorName}
                                </TableCell>
                                <TableCell align="right">{row.date}</TableCell>
                                <TableCell align="right">{row.unit}</TableCell>
                                <TableCell align="right">{row.average}</TableCell>
                                <TableCell align="right">{row.tlk}</TableCell>
                                <TableCell align="right">{row.exceeding}</TableCell>
                                <TableCell align="right">{row.max}</TableCell>
                                <TableCell align="right">{row.tlkMax}</TableCell>
                                <TableCell align="right">{row.maxExceeding}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {avgData.length ? <Stack direction="row" spacing={2} sx={{mt: 5, mb: 5}}>
                <div
                    style={{
                        width: '50%',
                        height: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                    <Typography sx={{textAlign: 'center'}}>Графік середніх значень</Typography>
                    <Pie
                        data={
                            {
                                labels: avgData.map(el => el.indicatorName),
                                datasets: [{
                                    label: 'Avg',
                                    data: avgData.map(el => el.value),
                                    backgroundColor: randomColor(avgData.length),
                                    hoverOffset: 4
                                }]
                            }
                        }
                    />
                </div>
                <div
                    style={{
                        width: '50%',
                        height: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                    <Typography sx={{textAlign: 'center'}}>Графік максимальних значень</Typography>
                    <Pie
                        data={
                            {
                                labels: maxData.map(el => el.indicatorName),
                                datasets: [{
                                    label: 'Max',
                                    data: maxData.map(el => el.value),
                                    backgroundColor: randomColor(maxData.length),
                                    hoverOffset: 4
                                }]
                            }
                        }
                    /></div>
            </Stack> : null}

            {lineChartData.length ? <Stack flexWrap={'wrap'} direction="row" spacing={2} sx={{mt: 5}}>
                {
                    lineChartData.map(lineChart => <div
                        style={{
                            width: '48%',
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                        <Bar
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top' as const,
                                    },
                                    title: {
                                        display: true,
                                        text: lineChart.chartName,
                                    },
                                },
                                scales: {
                                    x: {
                                        type: 'category',
                                        labels: timeLabels,
                                },
                            }
                            }}
                            data={
                                {
                                    datasets: [{
                                        label: 'Value',
                                        // data: timeLabels.map((el, idx) => {
                                        //     let res = null;
                                        //     Object.entries(lineChart.values).forEach(val => {
                                        //         if (val[0].slice(2) === el) {
                                        //             res = val[1]
                                        //         }
                                        //     })
                                        //     return res;
                                        // }),
                                        data: Object.values(lineChart.values),
                                        backgroundColor: randomColor(avgData.length),
                                    }]
                                }
                            }
                        />
                    </div>)
                }
            </Stack> : null}

        </Container>
    );
};
