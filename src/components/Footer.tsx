import React from 'react';
import styles from './Footer.module.css';

/**
 * Footer cố định cho toàn bộ app
 * - Hiển thị thông tin liên hệ, liên kết, copyright
 */
const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Thông tin app */}
        <div className={styles.section}>
          <h2>FlowMarket</h2>
          <p>
            Siêu thị cá nhân - Nền tảng bán hàng trực tuyến cho cá nhân, cung cấp sản phẩm chất lượng, giao hàng nhanh chóng.
          </p>
        </div>
        {/* Liên kết */}
        <div className={styles.section}>
          <h2>Liên kết</h2>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}><a href="#">Về chúng tôi</a></li>
            <li className={styles.linkItem}><a href="#">Điều khoản sử dụng</a></li>
            <li className={styles.linkItem}><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>
        {/* Liên hệ */}
        <div className={styles.section}>
          <h2>Liên hệ</h2>
          <p>Email: support@flowmarket.com<br />
            Hotline: 1900-xxxx<br />
            Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
          </p>
        </div>
      </div>
      <div className={styles.copyright}>
        © 2024 FlowMarket. Tất cả quyền được bảo lưu.
      </div>
    </div>
  </footer>
);

export default Footer; 