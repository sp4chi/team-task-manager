import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div style={{ marginBottom: '20px' }}>
      <Link to='/dashboard' style={{ marginRight: '10px' }}>
        Dashboard
      </Link>
      <Link to='/tasks'>Tasks</Link>
    </div>
  );
}
