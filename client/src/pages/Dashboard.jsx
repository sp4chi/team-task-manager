import { useEffect, useMemo, useState } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.role === 'admin';

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0,
  });
  const [users, setUsers] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [memberSelection, setMemberSelection] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes, summaryRes] = await Promise.all([
          API.get('/projects'),
          API.get('/tasks'),
          API.get('/tasks/summary'),
        ]);

        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
        setSummary(summaryRes.data);

        if (isAdmin) {
          const usersRes = await API.get('/users');
          setUsers(usersRes.data);
        }
      } catch (err) {
        setError(err?.response?.data?.msg || 'Failed to load dashboard');
      }
    };

    fetchData();
  }, [isAdmin]);

  const overdueTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return task.status !== 'done' && new Date(task.dueDate) < now;
    });
  }, [tasks]);

  const createProject = async () => {
    if (!projectForm.name) return;
    try {
      const res = await API.post('/projects', projectForm);
      setProjects((prev) => [res.data, ...prev]);
      setProjectForm({ name: '', description: '' });
    } catch (err) {
      setError(err?.response?.data?.msg || 'Create project failed');
    }
  };

  const addMember = async (projectId) => {
    const memberId = memberSelection[projectId];
    if (!memberId) return;
    try {
      const res = await API.post(`/projects/${projectId}/members`, { memberId });
      setProjects((prev) =>
        prev.map((project) => (project._id === projectId ? res.data : project)),
      );
      setMemberSelection((prev) => ({ ...prev, [projectId]: '' }));
    } catch (err) {
      setError(err?.response?.data?.msg || 'Add member failed');
    }
  };

  return (
    <div className='stack'>
      <div className='page-header'>
        <div>
          <h1>Dashboard</h1>
          <p>Track project health, task status, and overdue work.</p>
        </div>
      </div>

      {error && <div className='alert'>{error}</div>}

      <div className='stats'>
        <div className='stat-card'>
          <div className='stat-value'>{summary.total}</div>
          <div className='stat-label'>Total tasks</div>
        </div>
        <div className='stat-card'>
          <div className='stat-value'>{summary.todo}</div>
          <div className='stat-label'>To do</div>
        </div>
        <div className='stat-card'>
          <div className='stat-value'>{summary.inProgress}</div>
          <div className='stat-label'>In progress</div>
        </div>
        <div className='stat-card'>
          <div className='stat-value'>{summary.done}</div>
          <div className='stat-label'>Done</div>
        </div>
        <div className='stat-card highlight'>
          <div className='stat-value'>{summary.overdue}</div>
          <div className='stat-label'>Overdue</div>
        </div>
      </div>

      {isAdmin && (
        <div className='card'>
          <h2>New project</h2>
          <div className='form-grid'>
            <div>
              <label className='label'>Project name</label>
              <input
                className='input'
                value={projectForm.name}
                placeholder='Website redesign'
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className='label'>Description</label>
              <input
                className='input'
                value={projectForm.description}
                placeholder='Q2 marketing refresh'
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <button className='btn btn-primary' onClick={createProject}>
              Create project
            </button>
          </div>
        </div>
      )}

      <div className='card'>
        <h2>Projects</h2>
        <div className='card-grid'>
          {projects.map((project) => (
            <div key={project._id} className='card inset'>
              <div className='card-title'>{project.name}</div>
              <p className='muted'>{project.description || 'No description'}</p>
              <div className='chip-row'>
                {project.members?.map((member) => (
                  <span key={member._id} className='chip'>
                    {member.name}
                  </span>
                ))}
              </div>
              {isAdmin && (
                <div className='row'>
                  <select
                    className='select'
                    value={memberSelection[project._id] || ''}
                    onChange={(e) =>
                      setMemberSelection((prev) => ({
                        ...prev,
                        [project._id]: e.target.value,
                      }))
                    }>
                    <option value=''>Add team member</option>
                    {users.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                  <button
                    className='btn btn-secondary'
                    onClick={() => addMember(project._id)}>
                    Add
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='card'>
        <h2>Overdue tasks</h2>
        {overdueTasks.length === 0 ? (
          <div className='empty'>No overdue tasks. Great job!</div>
        ) : (
          <div className='list'>
            {overdueTasks.map((task) => (
              <div key={task._id} className='list-item'>
                <div>
                  <div className='card-title'>{task.title}</div>
                  <div className='muted'>
                    {task.projectId?.name || 'No project'}
                  </div>
                </div>
                <div className='badge danger'>
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
