import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MangaDetail from './pages/MangaDetail';
import Reader from './pages/Reader';
import AuthPage from './pages/AuthPage';
import Bookmarks from './pages/Bookmarks';
import Admin from './pages/Admin';

export default function App() {
 return <AuthProvider><div className="app"><Navbar/><main><Routes>
  <Route path="/" element={<Home/>}/><Route path="/library" element={<Home/>}/>
  <Route path="/manga/:id" element={<MangaDetail/>}/><Route path="/read/:id" element={<Reader/>}/>
  <Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/>
  <Route path="/bookmarks" element={<Bookmarks/>}/><Route path="/admin" element={<Admin/>}/>
  <Route path="*" element={<Home/>}/>
 </Routes></main><Footer/></div></AuthProvider>;
}
