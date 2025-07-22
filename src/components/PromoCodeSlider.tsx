import React, { useEffect, useState } from 'react';
import styles from './PromoCodeSlider.module.css';
import BaseSlider from './BaseSlider';

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
  ]);
};

const getVisibleCount = (width: number) => {
  if (width <= 700) return 1;
  if (width <= 1100) return 3;
  return 5;
};

const PromoCodeSlider: React.FC = () => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount(typeof window !== 'undefined' ? window.innerWidth : 1200));

  useEffect(() => {
    mockFetchPromoCodes().then(setCodes);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1200);
  };

  if (codes.length === 0) return null;

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.header}>Mã khuyến mãi</div>
      <BaseSlider
        items={codes}
        renderItem={(promo) => (
          <div className={styles.grid} style={{ gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }}>
            <div
              className={styles.promoCard}
              style={{ background: promo.color || '#f5f5f5', margin: '0 auto', maxWidth: 320 }}
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
          </div>
        )}
        customClass={styles.slider}
        interval={4000}
        autoPlay
        dots
        arrows
        arrowClassName={styles.arrow}
        visibleCount={visibleCount}
      />
    </div>
  );
};

export default PromoCodeSlider; 