import { useState, useEffect } from "react"
import {
  Play,
  ArrowRight,
  Zap,
  Shield,
  Cpu,
  Users,
  MessageCircle,
  ChevronDown,
  Star,
  Globe,
  Code,
  BookOpen,
  Settings,
  Award,
  TrendingUp,
  Clock,
  Rocket,
  Database,
} from "lucide-react"
import styles from "./index.module.css"
import Link from "next/link"

export default function HyperlaneIntro() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const [scrollY, setScrollY] = useState(0)

  const handlePlay = () => {
    setIsVideoPlaying(true);
  };


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const founders = [
    {
      name: "Jon Kol",
      role: "联合创始人",
      background: "Hyperlane 联合创始人，曾在 Celo 担任关键职位，专注于区块链互操作性和基础设施建设",
      avatar: "/placeholder.svg",
      x: "https://twitter.com/jon_kol",
    },
    {
      name: "Asa Oines",
      role: "联合创始人 & CTO",
      background: "Hyperlane 联合创始人兼首席技术官，在分布式系统和跨链技术方面具有深厚的技术背景",
      avatar: "/placeholder.svg",
      x: "https://twitter.com/asaoines",
    },
    {
      name: "Nam Chu Hoai",
      role: "联合创始人",
      background: "Hyperlane 联合创始人，专注于协议设计和生态系统发展",
      avatar: "/placeholder.svg",
      x: "https://twitter.com/Hyperlane",
    },
  ]

  const fundingRounds = [
    {
      date: "2022年8月",
      round: "种子轮融资",
      amount: "$18.5M",
      lead: "Variant",
      description: "Hyperlane（原 Abacus）完成 1850 万美元种子轮融资，由 Variant 领投，Circle Ventures、Cosmos、1kx、Figment Capital 等知名投资机构参投。",
    },
  ]

  const techFeatures = [
    {
      icon: <Settings className={styles.techIcon} />,
      title: "模块化和可扩展架构",
      description: "可自定义的互操作安全模块（ISM）和灵活的 Post-Dispatch Hooks",
    },
    {
      icon: <Code className={styles.techIcon} />,
      title: "多虚拟机支持",
      description: "支持 EVM、Solana VM、Cosmos SDK 等 7+ 种虚拟机",
    },
    {
      icon: <Shield className={styles.techIcon} />,
      title: "免费且无需许可",
      description: "零集成费用，开源协议，任何人可部署",
    },
    {
      icon: <Globe className={styles.techIcon} />,
      title: "通用消息传递",
      description: "支持任意数据的跨链传输，实现复杂跨链应用",
    },
  ]

  const performanceMetrics = [
    { metric: "支持链数量", value: "130+", comparison: "覆盖主流区块链生态" },
    { metric: "已桥接资产", value: "$10B+", comparison: "处理大量跨链资产" },
    { metric: "虚拟机支持", value: "7+", comparison: "多种执行环境" },
    { metric: "每日消息量", value: "10,000+", comparison: "活跃的跨链通信" },
  ]

  const whyChooseReasons = [
    {
      icon: <TrendingUp className={styles.reasonIcon} />,
      title: "跨链互操作",
      description: "连接 130+ 条链，实现真正的多链生态",
    },
    {
      icon: <Code className={styles.reasonIcon} />,
      title: "开发者友好",
      description: "简单的 API 和 SDK，快速集成跨链功能",
    },
    {
      icon: <Rocket className={styles.reasonIcon} />,
      title: "开源且无需许可",
      description: "完全开源，任何人都可以部署和使用",
    },
    {
      icon: <Users className={styles.reasonIcon} />,
      title: "模块化设计",
      description: "可自定义安全模块，满足不同应用需求",
    },
  ]

  const getStartedSteps = [
    {
      icon: <BookOpen className={styles.stepIcon} />,
      title: "了解 Hyperlane",
      description: "快速入门 Hyperlane",
      href: "/hyperlane"
    },
    {
      icon: <Code className={styles.stepIcon} />,
      title: "阅读文档",
      description: "查看开发文档",
      href: "https://docs.hyperlane.xyz"
    },
    {
      icon: <MessageCircle className={styles.stepIcon} />,
      title: "加入社群",
      description: "X/中文社群",
      href: "/events"
    },
    {
      icon: <Award className={styles.stepIcon} />,
      title: "参加活动",
      description: "社区活动 & 黑客松 & AMA",
      href: "/events"
    },
  ]

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroParticles}></div>
          <div className={styles.heroGradient}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleGradient}>Hyperlane</span>
              <br />
              跨链互操作的开放协议
            </h1>
            <p className={styles.heroDescription}>
              开源的区块链互操作性框架，连接 130+ 条链，支持多种虚拟机之间的跨链消息传递。构建真正的多链未来。
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>130+</div>
                <div className={styles.statLabel}>链支持</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>$10B+</div>
                <div className={styles.statLabel}>桥接资产</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>7+</div>
                <div className={styles.statLabel}>虚拟机</div>
              </div>
            </div>
            <div className={styles.heroActions}>
              <Link href="https://docs.hyperlane.xyz" target="_blank" className={styles.primaryButton}>
                开始使用
                <ArrowRight className={styles.buttonIcon} />
              </Link>
              <Link href="https://www.hyperlane.xyz/" target="_blank" className={styles.secondaryButton}>访问官网</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.centerContainer}>
              <div className={styles.centerLogo}>
                <div className={styles.svgContainer}>
                  <svg
                    width="600"
                    height="600"
                    viewBox="0 0 500 400"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.logoSvg}
                  >
                    <defs>
                      {/* 阴影滤镜 */}
                      <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="8" stdDeviation="15" floodColor="#6E54FF" floodOpacity="0.3" />
                      </filter>
                    </defs>

                    {/* 中间精细 SVG 菱形 - 调整到新的中心位置 */}
                    <path
                      d="M250 50C204.024 50 90.79 163.792 90.79 209.999C90.79 256.206 204.024 370 250 370C295.976 370 409.212 256.204 409.212 209.999C409.212 163.794 295.978 50 250 50ZM225.19 301.492C205.802 296.183 153.676 204.55 158.96 185.066C164.244 165.581 255.424 113.198 274.811 118.508C294.2 123.817 346.325 215.449 341.042 234.934C335.758 254.418 244.577 306.802 225.19 301.492Z"
                      fill="#836EF9"
                      filter="url(#dropShadow)"
                      className={styles.mainDiamond}
                    />

                    {/* 四个轨道 */}
                    <circle className={styles.orbit} cx="250" cy="210" r="100" />
                    <circle className={styles.orbit} cx="250" cy="210" r="140" />
                    <circle className={styles.orbit} cx="250" cy="210" r="180" />
                    <circle className={styles.orbit} cx="250" cy="210" r="220" />

                    {/* 第一个轨道上的小点 */}
                    <g className={styles.group1}>
                      <circle className={styles.dot} cx="350" cy="210" fill="#ff4ecd" />
                    </g>

                    {/* 第二个轨道上的小点 */}
                    <g className={styles.group2}>
                      <circle className={styles.dot} cx="390" cy="210" fill="#00d084" />
                    </g>

                    {/* 第三个轨道上的小点 */}
                    <g className={styles.group3}>
                      <circle className={styles.dot} cx="430" cy="210" fill="#f5a623" />
                    </g>

                    {/* 第四个轨道上的小点 */}
                    <g className={styles.group4}>
                      <circle className={styles.dot} cx="470" cy="210" fill="#6366F1" />
                    </g>

                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styles.scrollIndicator}>
          <ChevronDown className={styles.scrollIcon} />
        </div> */}
      </section>

      {/* 视频介绍 Section - 暂时移除，等待 Hyperlane 相关视频 */}
      {/* <section className={styles.videoSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionvideoTitle}>观看视频，快速了解 Hyperlane</h2>
          </div>
        </div>
      </section> */}

      {/* 团队与创始人 */}
      <section className={styles.founders}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>团队与创始人</h2>
            <p className={styles.sectionDescription}>Abacus Works 团队致力于构建开放的跨链互操作协议</p>
          </div>
          <div className={styles.foundersGrid}>
            {founders.map((founder, index) => (
              <div key={index} className={styles.founderCard}>
                <Link href={founder.x} target="_blank">
                  <div className={styles.founderAvatar}>
                    <img src={founder.avatar || "/placeholder.svg"} alt={founder.name} />
                  </div>
                </Link>
                <div className={styles.founderInfo}>
                  <h3 className={styles.founderName}>{founder.name}</h3>
                  <div className={styles.founderRole}>{founder.role}</div>
                  <p className={styles.founderBackground}>{founder.background}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 融资历程 */}
      <section className={styles.funding}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>融资历程</h2>
            <p className={styles.sectionDescription}>融资信息待官方公布后更新</p>
          </div>
          <div className={styles.fundingTimeline}>
            {fundingRounds.map((round, index) => (
              <div key={index} className={styles.fundingRound}>
                <div className={styles.fundingDate}>{round.date}</div>
                <div className={styles.fundingContent}>
                  <div className={styles.fundingHeader}>
                    <h3 className={styles.fundingRoundTitle}>{round.round}</h3>
                    <div className={styles.fundingAmount}>{round.amount}</div>
                  </div>
                  <div className={styles.fundingLead}>主投：{round.lead}</div>
                  <p className={styles.fundingDescription}>{round.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心技术亮点 */}
      <section className={styles.technology}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>核心技术亮点</h2>
            <p className={styles.sectionDescription}>模块化的跨链互操作框架，支持多虚拟机和自定义安全模块</p>
          </div>
          <div className={styles.techGrid}>
            {techFeatures.map((feature, index) => (
              <div key={index} className={styles.techCard}>
                <div className={styles.techCardHeader}>
                  {feature.icon}
                  <h3 className={styles.techCardTitle}>{feature.title}</h3>
                </div>
                <p className={styles.techCardDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 性能指标速览 */}
      {/* <section className={styles.performance}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>性能指标速览</h2>
            <p className={styles.sectionDescription}>卓越的性能表现，重新定义区块链标准</p>
          </div>
          <div className={styles.performanceTable}>
            {performanceMetrics.map((metric, index) => (
              <div key={index} className={styles.performanceRow}>
                <div className={styles.performanceMetric}>{metric.metric}</div>
                <div className={styles.performanceValue}>{metric.value}</div>
                <div className={styles.performanceComparison}>{metric.comparison}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Hyperlane 的生态与应用场景 */}
      <section className={styles.ecosystem}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hyperlane 的生态与应用</h2>
            <p className={styles.sectionDescription}>构建连接多链的跨链应用生态</p>
          </div>
          <div className={styles.ecosystemContent}>
            <div className={styles.ecosystemGrid}>
              <div className={styles.ecosystemCard}>
                <div className={styles.ecosystemIcon}>
                  <Rocket className={styles.cardIcon} />
                </div>
                <h3>跨链桥接</h3>
                <p>已处理超过 $10B 的跨链资产，支持 130+ 条区块链之间的安全桥接</p>
              </div>
              <div className={styles.ecosystemCard}>
                <div className={styles.ecosystemIcon}>
                  <Award className={styles.cardIcon} />
                </div>
                <h3>多链应用</h3>
                <p>支持开发者构建真正的多链 DApp，实现跨链 DeFi、NFT 和游戏应用</p>
              </div>
              <div className={styles.ecosystemCard}>
                <div className={styles.ecosystemIcon}>
                  <Users className={styles.cardIcon} />
                </div>
                <h3>开发者生态</h3>
                <p>活跃的开发者社区，提供完善的文档、SDK 和技术支持</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 为什么选择 Hyperlane */}
      {/* <section className={styles.whyChoose}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>为什么选择 Hyperlane？</h2>
            <p className={styles.sectionDescription}>四大核心优势，引领区块链技术革新</p>
          </div>
          <div className={styles.reasonsGrid}>
            {whyChooseReasons.map((reason, index) => (
              <div key={index} className={styles.reasonCard}>
                <div className={styles.reasonIcon}>{reason.icon}</div>
                <h3 className={styles.reasonTitle}>{reason.title}</h3>
                <p className={styles.reasonDescription}>{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className={styles.community}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hyperlane 社区</h2>
            <p className={styles.sectionDescription}>全球开发者、构建者和用户共同参与，活跃且充满活力的社区</p>
          </div>
          <div className={styles.communityImageWrapper}>
            <img
              src="/community.png"
              alt="Hyperlane Community"
              className={styles.communityImage}
            />
          </div>
        </div>
      </section>

      {/* 如何开始 */}
      <section className={styles.getStarted}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>如何开始</h2>
            <p className={styles.sectionDescription}>四个简单步骤，开启您的 Hyperlane 之旅</p>
          </div>
          <div className={styles.stepsGrid}>
            {getStartedSteps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <Link href={step.href || '/'}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>准备好开始构建跨链应用了吗？</h2>
            <p className={styles.ctaDescription}>立即开始使用 Hyperlane，连接多链生态</p>
            <div className={styles.ctaActions}>
              <Link href="https://docs.hyperlane.xyz" target="_blank" className={styles.ctaPrimary}>
                查看文档
                <ArrowRight className={styles.buttonIcon} />
              </Link>
              <Link href="/events" className={styles.ctaSecondary}>加入中文社区</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
