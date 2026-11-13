import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPages } from '../api/manga';
import { useAuth } from '../auth/AuthContext';

function Reader(){const{id}=useParams(),{token,user}=useAuth(),[data,setData]=useState(null),[err,setErr]=useState('');useEffect(()=>{getPages(id).then(setData).catch(e=>setErr(e.message))},[id]);return <section className="reader"><div className="readerbar"><Link to="/">← กลับหน้าหลัก</Link><span>อ่านมังงะ / Manga Reader</span><span>{user?'Member':'Guest'}</span></div>{err?<div className="empty">{err}</div>:!data?<div className="empty">กำลังโหลดหน้ามังงะ...</div>:<><p className="notice">เครดิตกลุ่มแปลจะแสดงตามข้อมูลของตอน · MangaDex chapter content</p>{data.pages.map((src,i)=><img key={src} src={src} loading={i<2?'eager':'lazy'} alt={'Page '+(i+1)}/>)}</>}</section>}
export default Reader;
