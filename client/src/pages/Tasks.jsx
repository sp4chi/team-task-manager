import { useEffect, useMemo, useState } from 'react';
import API from '../services/api';

export default function Tasks() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.role === 'admin';

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    dueDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          API.get('/tasks'),
          API.get('/projects'),
        ]);
        setTasks(tasksRes.data);
        setProjects(projectsRes.data);

        if (isAdmin) {
          const usersRes = await API.get('/users');
          setUsers(usersRes.data);
        }
      } catch (err) {
        setError(err?.response?.data?.msg || 'Failed to load tasks');
      }
    };

    loadData();
  }, [isAdmin]);

  const createTask = async () => {
    if (!form.title || !form.projectId) return;
    try {
      const res = await API.post('/tasks', {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate) : null,
      });
      setTasks((prev) => [res.data, ...prev]);
      setForm({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '' });
    } catch (err) {
      setError(err?.response?.data?.msg || 'Create task failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.patch(`/tasks/${id}`, { status });
      setTasks((prev) => prev.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      setError(err?.response?.data?.msg || 'Update failed');
    }
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tasks]);

  return (
    <div className='stack'>
      <div className='page-header'>
        <div>
          <h1>Tasks</h1>
          <p>Assign tasks, track delivery, and keep everyone on schedule.</p>
        </div>
      </div>

      {error && <div className='alert'>{error}</div>}

      {isAdmin && (
        <div className='card'>
          <h2>Create task</h2>
          <div className='form-grid'>
            <div>
              <label className='label'>Title</label>
              <input
                className='input'
                value={form.title}
                placeholder='Finalize onboarding flow'
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className='label'>Project</label>
              <select
                className='select'
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                <option value=''>Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='label'>Assignee</label>
              <select
                className='select'
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value=''>Unassigned</option>
                {users.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='label'>Due date</label>
              <input
                className='input'
                type='date'
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div className='form-wide'>
              <label className='label'>Description</label>
              <textarea
                className='textarea'
                rows='3'
                value={form.description}
                placeholder='Add any key requirements or context.'
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <button className='btn btn-primary' onClick={createTask}>
              Create task
            </button>
          </div>
        </div>
      )}

      <div className='card'>
        <h2>All tasks</h2>
        {sortedTasks.length === 0 ? (
          <div className='empty'>No tasks yet.</div>
        ) : (
          <div className='list'>
            {sortedTasks.map((task) => (
              <div key={task._id} className='list-item'>
                <div>
                  <div className='card-title'>{task.title}</div>
                  <div className='muted'>
                    {task.projectId?.name || 'No project'} ·{' '}
                    {task.assignedTo?.name || 'Unassigned'}
                  </div>
                  {task.dueDate && (
                    <div className='meta'>
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className='row'>
                  <select
                    className='select'
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}>
                    <option value='todo'>To do</option>
                    <option value='in-progress'>In progress</option>
                    <option value='done'>Done</option>
                  </select>
                  <span className={`badge ${task.status}`}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
