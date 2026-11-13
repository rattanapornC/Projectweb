import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function Reader() {
  const { chapterId } = useParams();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    api(`/api/chapters/${chapterId}/pages`).then((d) => setPages(d.pages));
  }, [chapterId]);

  return pages.map((src, i) => <img key={src} src={src} loading="lazy" alt={`หน้า ${i + 1}`} />);
}