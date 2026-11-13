import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/backend';
import { useAuth } from '../auth/AuthContext';
import { titleOf } from '../utils/manga';

function Bookmarks(){const{token}=useAuth(),[items,setItems]=useState([]);useEffect(()=>{api('/api/me/bookmarks',{token}).then(d=>setItems(d.items||[])).catch(()=>{})},[]);return <section className="section"><h2>บุ๊กมาร์กของฉัน / My Bookmarks</h2><div className="grid">{items.map(m=><Link className="mangacard" to={'/manga/'+m.id} key={m.id}><div className="cover">{m.cover_url&&<img src={m.cover_url}/>}</div><div className="cardinfo"><h3>{titleOf(m)}</h3></div></Link>)}</div>{!items.length&&<div className="empty">ยังไม่มีบุ๊กมาร์ก</div>}</section>}
export default Bookmarks;
