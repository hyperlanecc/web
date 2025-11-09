import { NextPage } from 'next';
import Head from 'next/head';
import styles from './index.module.css';
import { Github } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    description: string;
    url: string;
    git: string;
    category: string;
}

const Community: NextPage = () => {
    const projects: Project[] = [
        // 待添加 Hyperlane 社区项目
        // 示例格式：
        // {
        //     id: 1,
        //     title: '项目名称',
        //     description: '项目描述',
        //     url: 'https://project-url.com/',
        //     git: 'https://github.com/username/repo',
        //     category: '分类'
        // },
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
