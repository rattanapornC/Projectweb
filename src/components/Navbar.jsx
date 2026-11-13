
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { member, logout, loading } = useAuth();
  const navigate = useNavigate();

  const role = member?.role ?? member?.Role;
  const displayName =
    member?.display_name ??
    member?.DisplayName ??
    member?.email ??
    member?.Email;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        MangaReader
      </NavLink>

      <NavLink to="/" end>หน้าแรก</NavLink>
      <NavLink to="/manga">มังงะทั้งหมด</NavLink>
      <NavLink to="/lab">API Lab</NavLink>
      <NavLink to="/about">เกี่ยวกับ</NavLink>

      <div className="navbar-auth">
        {!loading && member ? (
          <>
            <span className="member-name">{displayName}</span>

            {role === 'admin' && (
              <span className="admin-label">ADMIN</span>
            )}

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              ออกจากระบบ
            </button>
          </>
        ) : !loading ? (
          <>
            <Link to="/login">เข้าสู่ระบบ</Link>
            <Link to="/register" className="register-link">
              สมัครสมาชิก
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}
