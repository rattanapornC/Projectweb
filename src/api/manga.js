import { api } from './backend';
export const getManga = (q = '') => api('/api/manga?q=' + encodeURIComponent(q));
export const getDetail = id => api('/api/manga/' + id);
export const getChapters = id => api('/api/manga/' + id + '/chapters?lang=th,en');
export const getPages = id => api('/api/chapters/' + id + '/pages');
