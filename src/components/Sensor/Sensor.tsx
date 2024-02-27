import { useParams } from 'react-router-dom';

const Sensor = () => {
  const { id } = useParams();

  return <div>Sensor {id} info </div>;
};

export default Sensor;
