import { GetStaticProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getDocsByCategory, DocGroup, DocItem } from '@/lib/docsConfig';

// 辅助函数：递归查找第一个文档
function findFirstDoc(groups: DocGroup[]): DocItem | null {
  for (const group of groups) {
    for (const child of group.children) {
      // 如果是文档项，直接返回
      if ('slug' in child) {
        return child;
      }
      // 如果是嵌套分组，递归搜索
      if ('type' in child && child.type === 'group') {
        const result = findFirstDoc([child]);
        if (result) return result;
      }
    }
  }
  return null;
}

export default function DocsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // 自动重定向到第一个分类的第一个文档
    const docsCategories = getDocsByCategory();
    
    if (docsCategories.length > 0) {
      const firstCategory = docsCategories[0];
      
      // 先检查直接的 docs
      if (firstCategory.docs && firstCategory.docs.length > 0) {
        const firstDoc = firstCategory.docs[0];
        // 如果 slug 以 'docs/' 开头，去掉这个前缀（避免路径重复）
        const cleanSlug = firstDoc.slug.startsWith('docs/')
          ? firstDoc.slug.substring(5)
          : firstDoc.slug;
        router.replace(`/docs/${cleanSlug}`);
        return;
      }
      
      // 如果没有直接的 docs，在 groups 中递归查找
      if (firstCategory.groups) {
        const firstDoc = findFirstDoc(firstCategory.groups);
        if (firstDoc) {
          // 如果 slug 以 'docs/' 开头，去掉这个前缀（避免路径重复）
          const cleanSlug = firstDoc.slug.startsWith('docs/')
            ? firstDoc.slug.substring(5)
            : firstDoc.slug;
          router.replace(`/docs/${cleanSlug}`);
        }
      }
    }
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      fontSize: '1.2rem',
      color: '#6b7280'
    }}>
      正在跳转到文档...
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  };
};
