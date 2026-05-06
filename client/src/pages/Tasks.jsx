import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const createTask = async () => {
    await API.post('/tasks', { title });
    window.location.reload();
  };

  useEffect(() => {
    API.get('/tasks').then((res) => setTasks(res.data));
  }, []);

  const updateStatus = async (id) => {
    await API.patch(`/tasks/${id}`, { status: 'done' });
    window.location.reload();
  };

  return (
    <div>
      <Navbar />
      <h2>Tasks</h2>
      {tasks.map((t) => (
        <div key={t._id}>
          <p>
            {t.title} - {t.status}
          </p>
          <button onClick={() => updateStatus(t._id)}>Mark Done</button>
        </div>
      ))}
    </div>
  );
}
