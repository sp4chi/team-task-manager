import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');

  const createProject = async () => {
    await API.post('/projects', { name });
    window.location.reload();
  };

  useEffect(() => {
    API.get('/projects').then((res) => setProjects(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Projects</h2>
      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        projects.map((p) => (
          <div key={p._id}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <input
              onChange={(e) => setName(e.target.value)}
              placeholder='Project name'
            />
            <button onClick={createProject}>Create</button>
          </div>
        ))
      )}
    </div>
  );
}
