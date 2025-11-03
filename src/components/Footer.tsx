import { SiGithub, SiX, SiTelegram } from 'react-icons/si';
import styles from "../styles/Footer.module.css"
import Link from "next/link"
import { Image } from 'antd'


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <Image preview={false} width={24} src="/logo.png" className={styles.logo} />
              <span className={styles.footerLogoTitle}>Hyperlane 中文社区</span>
            </div>
            <p className={styles.footerDescription}>Hyperlane 中文社区是连接生态参与者的桥梁，在这里，与 Hyperlane CN 一起交流、分享、 建设 Hyperlane。</p>
          </div>
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>生态系统</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/ecosystem/tutorials" className={styles.footerLink}>
                  交互教程
                </Link>
              </li>
              <li>
                <Link href="/ecosystem/community" className={styles.footerLink}>
                  社区展示
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>开发者支持</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/docs" target="_blank" className={styles.footerLink}>
                  
                </Link>
              </li>
              <li>
                <Link href="/docs/protocol/protocol-overview" target="_blank" className={styles.footerLink}>
                  学习指南
                </Link>
              </li>
              <li>
                <Link href="/docs/operate/overview-agents" target="_blank" className={styles.footerLink}>
                  
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>社区</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/events" className={styles.footerLink}>社区活动</Link></li>
              <li><Link href="/posts" className={styles.footerLink}>社区帖子</Link></li>
              <li><Link href="/feedback" className={styles.footerLink}>反馈与建议</Link></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>联系我们</h3>
            <div className={styles.footerSocial}>
              <Link className={styles.socialButton} href="https://github.com/hyperlane-cn" target="_blank">
                <SiGithub className={styles.socialIcon} />
              </Link>
              <Link className={styles.socialButton} href="https://x.com/hyperlanecc" target="_blank">
                <SiX className={styles.socialIcon} />
              </Link>
              <Link className={styles.socialButton} href="https://t.me/hyperlanecc" target="_blank">
                <SiTelegram className={styles.socialIcon} />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            &copy; 2025 hyperlane 中文社区。 由 <Link href="https://openbuild.xyz/" className={styles.toOpenBuild}>OpenBuild</Link> 支持
          </p>
          {/* <Link href="/privacy">隐私政策</Link> ·{' '} */}
          {/* <Link href="/terms">服务条款</Link> */}
        </div>
      </div>
    </footer>
  )
}

