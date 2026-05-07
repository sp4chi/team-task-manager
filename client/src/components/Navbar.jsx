import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    navigate('/');
  };

  return (
    <div className='nav'>
      <div className='nav-brand'>Task Manager</div>
      <div className='nav-links'>
        <Link to='/dashboard'>Dashboard</Link>
        <Link to='/tasks'>Tasks</Link>
      </div>
      <div className='nav-user'>
        <div>
          <div className='nav-name'>{user?.name || 'Guest'}</div>
          <div className='nav-role'>{user?.role || 'member'}</div>
        </div>
        <button className='btn btn-ghost' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
