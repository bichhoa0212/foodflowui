import React, { useEffect, useState, ReactNode } from 'react';

interface BaseSliderProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => ReactNode;
  autoPlay?: boolean;
  interval?: number;
  customClass?: string;
  dots?: boolean;
  arrows?: boolean;
  arrowClassName?: string;
  visibleCount?: number;
}

function BaseSlider<T>({
  items,
  renderItem,
  autoPlay = true,
  interval = 4000,
  customClass = '',
  dots = true,
  arrows = true,
  arrowClassName = '',
  visibleCount = 1,
}: BaseSliderProps<T>) {
  const [current, setCurrent] = useState(0);
  const total = items.length;

  useEffect(() => {
    if (!autoPlay || total === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, total]);

  if (total === 0) return null;

  // Tính toán các index sẽ hiển thị
  const visibleItems = [];
  for (let i = 0; i < Math.min(visibleCount, total); i++) {
    visibleItems.push(items[(current + i) % total]);
  }

  return (
    <div className={customClass}>
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ display: 'flex', width: '100%' }}>
          {visibleItems.map((item, idx) => (
            <div key={idx} style={{ flex: 1 }}>
              {renderItem(item, (current + idx) % total)}
            </div>
          ))}
        </div>
        {arrows && total > visibleCount && (
          <>
            <button
              className={arrowClassName}
              style={{ position: 'absolute', left: 0, top: '50%', zIndex: 10, transform: 'translateY(-50%)' }}
              onClick={() => setCurrent((current - 1 + total) % total)}
            >
              &#8592;
            </button>
            <button
              className={arrowClassName}
              style={{ position: 'absolute', right: 0, top: '50%', zIndex: 10, transform: 'translateY(-50%)' }}
              onClick={() => setCurrent((current + 1) % total)}
            >
              &#8594;
            </button>
          </>
        )}
      </div>
      {dots && total > visibleCount && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          {Array.from({ length: total }).map((_, idx) => (
            <span
              key={idx}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: idx === current ? '#176443' : '#e6f4f1',
                display: 'inline-block',
                cursor: 'pointer',
              }}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BaseSlider; 