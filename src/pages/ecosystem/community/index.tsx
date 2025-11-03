import { NextPage } from 'next';
import Head from 'next/head';
import styles from './index.module.css';
import { Github } from 'lucide-react';

const Community: NextPage = () => {
    const projects = [
        {
            id: 1,
            title: '俄罗斯方块',
            description: '在 Monad 上玩俄罗斯方块多人对战游戏',
            url: 'https://tetrisx.vercel.app/',
            git: 'https://github.com/lispking/tetris',
            category: '链游'
        },
        {
            id: 2,
            title: '像素贪吃蛇',
            description: 'Monad 上的像素贪吃蛇游戏',
            url: 'https://pixel-snake-dx.vercel.app/',
            git: 'https://github.com/lispking/pixel-snake',
            category: '链游'
        },
        // 可以根据需要添加更多项目
    ];

    return (
         <div className={`${styles.container} nav-t-top`}>
            <Head>
                <title>社区项目 | Hyperlane</title>
                <meta name="description" content="探索 Hyperlane 生态系统中的社区项目" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>社区项目</h1>
                <p className={styles.description}>
                    探索 Hyperlane 社区打造的精彩项目
                </p>

                <div className={styles.grid}>
                    {projects.map((project) => (
                        <div className={styles.card}>
                            <a
                                key={project.id}
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <h2>{project.title} &rarr;</h2>
                                <p>{project.description}</p>
                                <span className={styles.category}>{project.category}</span>
                            </a>
                            <a href={project.git} target="_blank" rel="noopener noreferrer">
                                <Github className={styles.githubIcon} />
                            </a>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Community;
