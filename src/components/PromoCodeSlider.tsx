import React, { useEffect, useState } from 'react';
import styles from './PromoCodeSlider.module.css';

interface PromoCode {
  code: string;
  title: string;
  description: string;
  color?: string;
  image?: string;
  remaining: number;
  expireInDays: number;
}

const mockFetchPromoCodes = (): Promise<PromoCode[]> => {
  return Promise.resolve([
    { code: 'SALE50', title: 'Giảm ship 30k', description: 'Cho đơn hàng tối thiểu 300k', color: '#e3f2fd', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', remaining: 192, expireInDays: 19 },
    { code: 'FREESHIP', title: 'Freeship toàn quốc', description: 'Đơn từ 500k', color: '#fffde7', image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png', remaining: 88, expireInDays: 7 },
    { code: 'XUAN2024', title: 'Ưu đãi Xuân 2024', description: 'Giảm 20% cho đơn đầu', color: '#e8f5e9', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', remaining: 50, expireInDays: 3 },
    { code: 'SUMMER10', title: 'Giảm 10% mùa hè', description: 'Tối đa 50k', color: '#fff3e0', image: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', remaining: 120, expireInDays: 12 },
    { code: 'VIPMEM', title: 'Ưu đãi VIP', description: 'Chỉ dành cho thành viên', color: '#f3e5f5', image: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', remaining: 10, expireInDays: 30 },
    { code: 'FOODLOVE', title: 'Giảm 20k ăn uống', description: 'Đơn từ 200k', color: '#e1f5fe', image: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png', remaining: 200, expireInDays: 15 },
    { code: 'GIFT2024', title: 'Tặng quà 2024', description: 'Tặng kèm đơn hàng', color: '#fce4ec', image: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png', remaining: 30, expireInDays: 5 },
    { code: 'FLASHSALE', title: 'Flash Sale cuối tuần', description: 'Giảm 15%', color: '#f9fbe7', image: 'https://cdn-icons-png.flaticon.com/512/992/992700.png', remaining: 70, expireInDays: 2 },
    { code: 'WELCOMENEW', title: 'Chào mừng khách mới', description: 'Giảm 25k', color: '#f1f8e9', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', remaining: 99, expireInDays: 10 },
    { code: 'EXTRA5', title: 'Thêm 5% cho đơn trên 500k', description: 'Áp dụng toàn bộ sản phẩm', color: '#ede7f6', image: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png', remaining: 60, expireInDays: 8 },
  ]);
};

const PromoCodeSlider: React.FC = () => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [current, setCurrent] = useState(0);
  const perSlide = 10; // 2 hàng x 5 cột
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    mockFetchPromoCodes().then(setCodes);
  }, []);

  const slides = [];
  for (let i = 0; i < codes.length; i += perSlide) {
    slides.push(codes.slice(i, i + perSlide));
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1200);
  };

  if (codes.length === 0) return null;

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.header}>Mã khuyến mãi</div>
      <div className={styles.slider}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={idx === current ? styles.active : styles.inactive}
          >
            <div className={styles.grid}>
              {slide.map((promo, i) => (
                <div
                  key={promo.code}
                  className={styles.promoCard}
                  style={{ background: promo.color || '#f5f5f5' }}
                >
                  <div className={styles.promoRow}>
                    <div className={styles.promoImgCircle}>
                      <img src={promo.image} alt={promo.code} className={styles.promoImg} />
                    </div>
                    <div className={styles.promoContent}>
                      <div className={styles.promoTitle}>{promo.title}</div>
                      <div className={styles.promoDesc}>{promo.description}</div>
                      <div className={styles.promoStatus}>
                        <span className={styles.promoRemain}>Còn {promo.remaining} mã</span>,
                        <span className={styles.promoExpire}> hết hạn trong {promo.expireInDays} ngày</span>
                      </div>
                      <div className={styles.promoProgressBar}>
                        <div
                          className={styles.promoProgress}
                          style={{ width: `${Math.max(5, Math.min(100, (promo.remaining / 200) * 100))}%` }}
                        />
                      </div>
                      <div className={styles.promoActions}>
                        <button className={styles.promoDetail}>Chi tiết</button>
                        <button
                          className={styles.promoCopy}
                          onClick={() => handleCopy(promo.code)}
                        >
                          {copied === promo.code ? 'Đã sao chép!' : 'Sao chép'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className={styles.prev} onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}>&lt;</button>
        <button className={styles.next} onClick={() => setCurrent((current + 1) % slides.length)}>&gt;</button>
      </div>
      <div className={styles.dots}>
        {slides.map((_, idx) => (
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

export default PromoCodeSlider; 