import {
  Users,
  Calendar,
  MapPin,
  Zap,
  Star,
  Code,
  Shield,
  Cpu,
  Database,
  BookOpen,
  Globe,
  GitBranch,
  Rocket,
  DollarSign,
  Handshake,
  Lock,
  Network,
  Activity,
  Server,
  ServerCog,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import { SiTelegram, SiX } from 'react-icons/si';
import { Avatar, Image } from 'antd';
import EventSection from './events/section';
import ClientOnly from '../components/ClientOnly';

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Removed stats - currently not used as the stats section is commented out
  const [particleStyles, setParticleStyles] = useState<Array<React.CSSProperties>>([]);

  const scrollGallery = (direction: 'left' | 'right') => {
    const container = document.querySelector(`.${styles.galleryContainer}`) as HTMLElement;
    if (container) {
      const scrollAmount = 312; // Width of one image (280px) plus gap (32px)
      const currentScroll = container.scrollLeft;

      let targetScroll;
      if (direction === 'left') {
        // Scroll to absolute left if we're close to the beginning
        if (currentScroll <= scrollAmount) {
          targetScroll = 0;
        } else {
          targetScroll = currentScroll - scrollAmount;
        }
      } else {
        const maxScroll = container.scrollWidth - container.clientWidth;
        targetScroll = Math.min(maxScroll, currentScroll + scrollAmount);
      }

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 生成粒子样式（客户端挂载后）
    const styles = [...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }));
    setParticleStyles(styles);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <Network className={styles.featureIcon} />,
      title: '模块化架构',
      description: '可自定义的互操作安全模块（ISM）和灵活的 Post-Dispatch Hooks',
    },
    {
      icon: <Server className={styles.featureIcon} />,
      title: '多虚拟机支持',
      description: '支持 EVM、Solana VM、Cosmos SDK 等 7+ 种虚拟机',
    },
    {
      icon: <Shield className={styles.featureIcon} />,
      title: '免费且无需许可',
      description: '零集成费用，开源协议，任何人可部署',
    },
    {
      icon: <Globe className={styles.featureIcon} />,
      title: '通用消息传递',
      description: '支持任意数据的跨链传输，实现复杂跨链应用',
    },
  ];


  const milestones = [
    {
      date: '2022年初',
      title: 'Abacus Works 成立',
      description:
        'Abacus Works 团队成立，开始开发 Hyperlane 跨链互操作协议，致力于构建开放的区块链互操作性框架。',
      src: '',
      icon: <Rocket className={styles.icon} />,
    },
    {
      date: '2022年8月',
      title: '种子轮融资',
      description: '完成 $18.5M 种子轮融资，由 Variant 领投，Circle Ventures、Cosmos、1kx 等知名机构参投。',
      src: '',
      icon: <DollarSign className={styles.icon} />,
    },
    {
      date: '2022年10月',
      title: '品牌升级',
      description: '从 Abacus 正式更名为 Hyperlane，标志着协议发展进入新阶段，专注于跨链互操作性。',
      src: '',
      icon: <Star className={styles.icon} />,
    },
    {
      date: '2023年',
      title: '主网上线',
      description: 'Hyperlane 主网正式上线，开始为多链生态提供通用消息传递和跨链互操作服务。',
      src: '',
      icon: <Rocket className={styles.icon} />,
    },
    {
      date: '2024年',
      title: '生态扩展',
      description: '支持链数量达到 130+，累计处理超过 $10B 跨链资产，成为领先的跨链互操作协议。',
      src: '',
      icon: <Network className={styles.icon} />,
    },
  ];

  const resources = [
    {
      title: '开发文档',
      description: '完整的API文档和开发指南',
      icon: <BookOpen className={styles.resourceIcon} />,
      link: '#',
    },
    {
      title: '代码示例',
      description: '丰富的智能合约示例代码',
      icon: <Code className={styles.resourceIcon} />,
      link: '#',
    },
    {
      title: '开发工具',
      description: '专业的开发工具和SDK',
      icon: <Cpu className={styles.resourceIcon} />,
      link: '#',
    },
    {
      title: '测试网络',
      description: '免费的测试网络环境',
      icon: <Globe className={styles.resourceIcon} />,
      link: '#',
    },
  ];

  const members = [
    {
      name: 'marcus',
      twitter: 'https://x.com/marcus33l',
      avatar: "marcus.png",
    },
    {
      name: 'ian',
      twitter: 'https://x.com/imxy007',
      avatar: "ian.png",
    },
    {
      name: 'yaco',
      twitter: 'https://x.com/0xyaco',
      avatar: "yaco.png",
    }
  ];

  const duplicatedMembers = [...members];

  return (
    <div className={styles.homepage}>
      {/* Hero Section with Cool Effects */}
      <section className={styles.hero}>
        {/* Animated Background */}
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <div
            className={styles.mouseGradient}
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.15), transparent 40%)`,
            }}
          ></div>
        </div>

        <div className={styles.container}>
          <div
            className={`${styles.heroContent} ${isVisible ? styles.heroVisible : ''}`}
          >
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleSecondary}>Hyperlane中文社区</span>
            </h1>

            {/* 标题装饰 */}
            <div className={styles.titleDecoration}>
              <div className={styles.decorationGradient}></div>
              <div className={styles.decorationLine}></div>
            </div>
            <p className={styles.heroSubtitle}>
              <span className={styles.heroHighlight}>
                探索跨链互操作的未来，构建连接多链的应用
              </span>
            </p>
            {/* 图片画廊 */}
            <div className={styles.heroGallery}>
              <button
                className={`${styles.galleryNavigation} ${styles.galleryNavPrev}`}
                onClick={() => scrollGallery('left')}
                aria-label="Previous images"
              >
                <ChevronLeft className={styles.galleryNavIcon} />
              </button>

              <div className={styles.galleryContainer}>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp1.jpg" 
                    alt="Hyperlane社区活动1" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp2.jpg" 
                    alt="Hyperlane社区活动2" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp3.jpg" 
                    alt="Hyperlane社区活动3" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp4.jpg" 
                    alt="Hyperlane社区活动4" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp5.jpg" 
                    alt="Hyperlane社区活动5" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp6.jpg" 
                    alt="Hyperlane社区活动6" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp7.jpg" 
                    alt="Hyperlane社区活动7" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp8.jpg" 
                    alt="Hyperlane社区活动8" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp9.jpg" 
                    alt="Hyperlane社区活动9" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                </div>
                <div className={styles.galleryImage}>
                  <Image 
                    src="/community/cp10.jpg" 
                    alt="Hyperlane社区活动10" 
                    width={300}
                    height={195}
                    style={{ borderRadius: '14px' }}
                    preview={{
                      mask: false
                    }}
                  />
                  </div>
              </div>
              <button
                className={`${styles.galleryNavigation} ${styles.galleryNavNext}`}
                onClick={() => scrollGallery('right')}
                aria-label="Next images"
              >
                <ChevronRight className={styles.galleryNavIcon} />
              </button>
            </div>

            <div className={styles.heroButtons}>
              <Link href="/hyperlane" className={styles.heroPrimaryButton}>
                <Globe className={styles.buttonIcon} />
                了解 Hyperlane
              </Link>
              <Link href="/events" className={styles.heroSecondaryButton}>
                <Users className={styles.buttonIcon} />
                加入社区
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {[
              {
                label: '贡献者',
                value: stats.members,
                icon: <Users className={styles.statIcon} />,
              },
              {
                label: '技术分享',
                value: stats.activities,
                icon: <Star className={styles.statIcon} />,
              },
              {
                label: '开源项目',
                value: stats.projects,
                icon: <Rocket className={styles.statIcon} />,
              },
              {
                label: '代码提交',
                value: stats.commits,
                icon: <GitBranch className={styles.statIcon} />,
              },
            ].map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statIconWrapper}>
                  <div className={styles.statIconGlow}></div>
                  <div className={styles.statIconContainer}>{stat.icon}</div>
                </div>
                <div className={styles.statValue}>
                  {stat.value.toLocaleString()}+
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Activities Section */}
      <EventSection />

      {/* Milestones Section */}
      <section className={styles.milestones}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hyperlane 里程碑</h2>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timelineLine}></div>
            {milestones.map((milestone, index) => (
              <div
                key={`milestone-${index}`}
                className={`${styles.milestoneItem} ${index % 2 === 0 ? styles.milestoneLeft : styles.milestoneRight}`}
              >
                <div className={styles.milestoneContent}>
                  <div className={styles.milestoneCard}>
                    <div className={styles.milestoneCardGlow}></div>
                    <div className={styles.milestoneDate}>
                      <div className={styles.milestoneDateBadge}>
                        <Calendar className={styles.milestoneDateIcon} />
                        <span>{milestone.date}</span>
                      </div>
                    </div>
                    <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                    <p className={styles.milestoneDescription}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <div className={styles.milestoneIcon}>
                  <div className={styles.milestoneIconContent}>
                    {milestone.icon}
                  </div>
                  <div className={styles.milestoneIconGlow}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>技术特色</h2>
            <p className={styles.sectionDescription}>
              Hyperlane 提供模块化的跨链互操作框架，支持多虚拟机和自定义安全模块
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={`feature-${index}`} className={styles.featureCard}>
                <div className={styles.featureCardGlow}></div>
                <div className={styles.featureCardContent}>
                  <div className={styles.featureIconWrapper}>
                    {feature.icon}
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className={styles.resources}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>开发者资源</h2>
            <p className={styles.sectionDescription}>
              为开发者提供完整的工具链和资源，让你快速上手Hyperlane开发
            </p>
          </div>
          <div className={styles.resourcesGrid}>
            {resources.map((resource, index) => (
              <div key={`resource-${index}`} className={styles.resourceCard}>
                <div className={styles.resourceCardGlow}></div>
                <div className={styles.resourceCardHeader}>
                  <div className={styles.resourceIconWrapper}>
                    {resource.icon}
                  </div>
                  <h3 className={styles.resourceTitle}>{resource.title}</h3>
                  <p className={styles.resourceDescription}>
                    {resource.description}
                  </p>
                </div>
                <div className={styles.resourceCardFooter}>
                  <button className={styles.resourceButton}>立即使用</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className={styles.members}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>贡献者</h2>
            <p className={styles.sectionDescription}>
              感谢每一位贡献者，并期待更多热爱 Hyperlane 的朋友加入我们，一起共建 Hyperlane。
            </p>
          </div>

          <div className={styles.membersContainer}>
            <div className={styles.membersGradientLeft}></div>
            <div className={styles.membersGradientRight}></div>
            <div
              // className={
              //   duplicatedMembers.length <= 6
              //     ? styles.membersScrollStatic
              //     : styles.membersScrollAuto
              // }
              className={styles.membersScrollStatic}
            >
              {duplicatedMembers.map((member, index) => (
                <div key={`member-${index}`} className={styles.memberItem}>
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.avatar}>
                      <Avatar
                        size={60}
                        src={`/avatar/${member.avatar}`}
                        alt={member.name}
                      />
                    </div>

                    {/* <h3 className={styles.memberName}>{member.name}</h3> */}
                    <div className={styles.memberTwitter}>{member.name}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaBackground}>
          <ClientOnly fallback={
            <div className={styles.particleFallback}>
              {/* 静态占位粒子，避免布局偏移 */}
              {[...Array(30)].map((_, i) => (
                <div key={`particle-static-${i}`} className={styles.ctaParticleStatic}></div>
              ))}
            </div>
          }>
            {particleStyles.map((style, i) => (
              <div
                key={`particle-${i}`}
                className={styles.ctaParticle}
                style={style}
              ></div>
            ))}
          </ClientOnly>
        </div>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>准备好加入 Hyperlane 中文社区了吗？</h2>
            <div className={styles.ctaButtons}>
              <Link
                href="https://x.com/hyperlanecc"
                target="_blank"
                className={styles.ctaPrimaryButton}
              >
                <SiX className={styles.buttonIconX}  />
                关注 X
              </Link>
              <Link
                href="https://t.me/hyperlanecc"
                target="_blank"
                className={styles.ctaSecondaryButton}
              >
                <SiTelegram className={styles.buttonIcon} />
                加入 Telegram
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
