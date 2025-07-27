import React, { useEffect, useState } from 'react';
import styles from './ImageSlider.module.css';
import BaseSlider from './BaseSlider';

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
  useEffect(() => {
    mockFetchImages().then(setImages);
  }, []);

  if (images.length === 0) return null;

  return (
    <BaseSlider
      items={images}
      renderItem={(url, idx) => (
        <img
          key={url}
          src={url}
          alt={`slide-${idx}`}
          className={styles.active}
          style={{ width: '100%' }}
        />
      )}
      customClass={styles.sliderWrapper}
      interval={4000}
      autoPlay
      dots
      arrows
      arrowClassName={styles.arrow}
    />
  );
};

export default ImageSlider; 