import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
export default function Navbar() {
 const { user, logout } = useAuth();
 return <header className="top"><Link to="/" className="brand"><span className="brandicon"><BookOpen /></span><span>Manga<span className="pink">Hub</span><small>READ • DISCOVER • ENJOY</small></span></Link><nav><Link to="/">หน้าแรก</Link><Link to="/library">คลังมังงะ</Link>{user && <Link to="/bookmarks">บุ๊กมาร์ก</Link>}{user?.role === 'admin' && <Link to="/admin">Admin</Link>}</nav><div className="right">{user ? <><span className="username"><User size={15}/>{user.display_name}</span><button className="iconbtn" onClick={logout} title="ออกจากระบบ"><LogOut size={17}/></button></> : <><Link className="login" to="/login">เข้าสู่ระบบ</Link><Link className="primary small" to="/register">สมัครสมาชิก</Link></>}</div></header>;
}
