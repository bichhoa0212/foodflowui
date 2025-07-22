import React, { useEffect, useState } from 'react';
import styles from './ImageSlider.module.css';

const mockFetchImages = () => {
  // Giả lập gọi API lấy danh sách url ảnh
  return Promise.resolve([
    'https://theme.hstatic.net/1000282430/1001088848/14/slideshow_4.jpg?v=1558',
    'https://theme.hstatic.net/1000282430/1001088848/14/slideshow_7.jpg?v=1558',
    'https://theme.hstatic.net/1000282430/1001088848/14/slideshow_6.jpg?v=1558',
  ]);
};

const ImageSlider: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    mockFetchImages().then(setImages);
  }, []);

  // Tự động chuyển slide
  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.slider}>
        {images.map((url, idx) => (
          <img
            key={url}
            src={url}
            alt={`slide-${idx}`}
            className={idx === current ? styles.active : styles.inactive}
          />
        ))}
        <button className={styles.prev} onClick={() => setCurrent((current - 1 + images.length) % images.length)}>&lt;</button>
        <button className={styles.next} onClick={() => setCurrent((current + 1) % images.length)}>&gt;</button>
      </div>
      <div className={styles.dots}>
        {images.map((_, idx) => (
          <span
            key={idx}
            className={idx === current ? styles.dotActive : styles.dot}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider; 