/**
 * 文档项接口定义
 * 表示单个文档页面的配置信息
 */
export interface DocItem {
  slug: string;        // 文档的唯一标识符，对应文件路径（不含扩展名）
  title: string;       // 文档显示标题
  hasArrow?: boolean;  // 是否显示外链箭头图标（可选）
}

/**
 * 文档分组接口定义
 * 用于将相关文档组织在一起，支持嵌套结构
 */
export interface DocGroup {
  id: string;                     // 分组的唯一标识符
  title: string;                  // 分组显示标题
  collapsed?: boolean;            // 是否默认折叠状态（可选）
  type: 'group';                  // 类型标识符，用于区分分组和文档项
  children: (DocItem | DocGroup)[]; // 子项数组，可以包含文档项或嵌套分组
}

/**
 * 文档分类接口定义
 * 顶级分类，用于组织整个文档结构
 */
export interface DocCategory {
  id: string;           // 分类的唯一标识符
  title: string;        // 分类显示标题
  collapsed?: boolean;  // 是否默认折叠状态（可选）
  docs?: DocItem[];     // 直属于该分类的文档列表（可选）
  groups?: DocGroup[];  // 该分类下的分组列表（可选）
}

/**
 * 文档分类配置数据
 * 定义了整个文档站点的结构和组织方式
 *
 * 配置说明：
 * - 每个分类可以包含直接的文档（docs）和分组（groups）
 * - 分组支持嵌套，可以创建多层级的文档结构
 * - collapsed 属性控制初始展开/折叠状态
 */
export const docsCategories: DocCategory[] = [
  {
    id: 'overview',
    title: '概述',
    collapsed: false,
    groups: [
      {
        id: 'overview-intro',
        title: '概述',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'index', title: '文档首页' },
          { slug: 'intro', title: '介绍' },
          {
            id: 'deployment',
            title: '部署',
            collapsed: false,
            type: 'group',
            children: [
              {
                id: 'contract-addresses',
                title: '合约地址',
                collapsed: false,
                type: 'group',
                children: [
                  { slug: 'reference/addresses/deployments/mailbox', title: 'Mailbox 部署' },
                  { slug: 'reference/addresses/deployments/interchainGasPaymaster', title: '跨链 Gas 支付管理器' },
                  { slug: 'reference/addresses/deployments/storageGasOracle', title: '存储 Gas 预言机' },
                  { slug: 'reference/addresses/deployments/merkleTreeHook', title: 'Merkle 树钩子' },
                  { slug: 'reference/addresses/deployments/validatorAnnounce', title: '验证器公告' },
                  { slug: 'reference/addresses/deployments/proxyAdmin', title: '代理管理员' },
                  { slug: 'reference/addresses/deployments/testRecipient', title: '测试接收者' },
                  { slug: 'reference/addresses/deployments/interchainAccountRouter', title: '跨链账户路由器' },
                ]
              },
              {
                id: 'default-ism-validators',
                title: '默认 ISM 验证器',
                collapsed: false,
                type: 'group',
                children: [
                  { slug: 'reference/addresses/validators/mainnet-default-ism-validators', title: '主网默认 ISM 验证器' },
                  { slug: 'reference/addresses/validators/testnet-default-ism-validators', title: '测试网默认 ISM 验证器' },
                ]
              },
              { slug: 'reference/domains', title: '域名' },
              { slug: 'reference/registries', title: '注册表' },
            ]
          }
        ]
      },
      {
        id: 'quick-start',
        title: '快速开始',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'get-started-building', title: '开始构建' },
          { slug: 'guides/quickstart/deploy-warp-route', title: '部署 Warp 路由' },
          { slug: 'guides/quickstart/local-testnet-setup', title: '本地测试网设置' },
        ]
      },
      {
        id: 'applications',
        title: '应用',
        collapsed: false,
        type: 'group',
        children: [
          {
            id: 'hyperlane-warp-routes',
            title: 'Hyperlane Warp 路由',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'applications/warp-routes/overview', title: '概述' },
              { slug: 'applications/warp-routes/interface', title: '接口' },
              { slug: 'applications/warp-routes/types', title: '类型' },
              { slug: 'applications/warp-routes/example-usage', title: '使用示例' },
              { slug: 'applications/warp-routes/multi-collateral-warp-routes', title: '多抵押 Warp 路由' },
              { slug: 'guides/warp-routes/evm/multi-collateral-warp-routes-rebalancing', title: '多抵押 Warp 路由重新平衡' },
            ]
          },
          {
            id: 'interchain-account',
            title: '跨链账户',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'applications/interchain-account/overview', title: '概述' },
              { slug: 'applications/interchain-account/example-usage', title: '使用示例' },
              { slug: 'applications/interchain-account/overrides', title: '覆盖' },
            ]
          },
          {
            id: 'use-cases',
            title: '用例',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'applications/use-cases/cross-chain-swaps', title: '跨链交换' },
              { slug: 'applications/use-cases/cross-chain-swaps-with-recovery', title: '带恢复的跨链交换' },
            ]
          }
        ]
      },
      {
        id: 'guides',
        title: '指南',
        collapsed: false,
        type: 'group',
        children: [
          {
            id: 'setup-hyperlane-on-your-chain',
            title: '在您的链上设置 Hyperlane',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'guides/chains/deploy-hyperlane', title: '部署 Hyperlane' },
              { slug: 'guides/chains/deploy-hyperlane-with-local-agents', title: '使用本地代理部署 Hyperlane' },
            ]
          },
          {
            id: 'hyperlane-warp-routes-hwr',
            title: 'Hyperlane Warp 路由 (HWR)',
            collapsed: false,
            type: 'group',
            children: [
              {
                id: 'evm-hwr',
                title: 'EVM HWR',
                collapsed: false,
                type: 'group',
                children: [
                  { slug: 'guides/warp-routes/evm/deploy-yield-routes', title: '部署收益路由' },
                  { slug: 'guides/warp-routes/evm/fast-native-transfer-via-gas-token', title: '通过 Gas 代币快速原生转账' },
                  { slug: 'guides/warp-routes/evm/extending-warp-routes', title: '扩展 Warp 路由' },
                  { slug: 'guides/warp-routes/evm/xerc20-warp-route', title: 'xERC20 Warp 路由' },
                  { slug: 'guides/warp-routes/evm/managing-warp-route-limits', title: '管理 Warp 路由限制' },
                  { slug: 'guides/warp-routes/evm/deploy-multi-collateral-warp-routes', title: '部署多抵押 Warp 路由' },
                  { slug: 'guides/warp-routes/evm/transfer-and-call-pattern', title: '转账和调用模式' },
                ]
              },
              {
                id: 'svm-hwr',
                title: 'SVM HWR',
                collapsed: false,
                type: 'group',
                children: [
                  { slug: 'guides/warp-routes/svm/svm-warp-route-guide', title: 'SVM Warp 路由指南' },
                  {
                    id: 'using-squads',
                    title: '使用 Squads',
                    collapsed: false,
                    type: 'group',
                    children: [
                      { slug: 'guides/production/using-squads/alt-svm-using-sqauds', title: '备用 SVM 使用 Squads' },
                      { slug: 'guides/production/using-squads/using-squads-solana', title: '在 Solana 上使用 Squads' },
                    ]
                  }
                ]
              },
              { slug: 'guides/warp-routes/evm-svm-warp-route-guide', title: 'EVM-SVM Warp 路由指南' },
              { slug: 'guides/warp-routes/bridge-ui-guide', title: '桥接 UI 指南' },
            ]
          },
          {
            id: 'going-to-production',
            title: '进入生产环境',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'guides/production/prod-overview', title: '生产环境概述' },
              {
                id: 'core-deployment',
                title: '核心部署',
                collapsed: false,
                type: 'group',
                children: [
                  { slug: 'guides/production/core-deployment/update-mailbox-default-ism', title: '更新 Mailbox 默认 ISM' },
                  { slug: 'guides/production/core-deployment/transfer-mailbox-ownership', title: '转移 Mailbox 所有权' },
                ]
              },
              {
                id: 'hwr-deployment',
                title: 'HWR 部署',
                collapsed: false,
                type: 'group',
                children: [
                  { slug: 'guides/production/warp-route-deployment/remove-trusted-relayer', title: '移除可信中继器' },
                  { slug: 'guides/production/warp-route-deployment/transfer-warp-route-ownership', title: '转移 Warp 路由所有权' },
                ]
              }
            ]
          },
          { slug: 'guides/create-custom-hook-and-ism', title: '创建自定义钩子和 ISM' },
          { slug: 'guides/deploy-hyperlane-troubleshooting', title: '部署 Hyperlane 故障排除' },
        ]
      },
      {
        id: 'developer-tools',
        title: '开发工具',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'reference/developer-tools/cli', title: '命令行界面' },
          {
            id: 'libraries',
            title: '库',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'reference/developer-tools/libraries/mailbox-client', title: 'Mailbox 客户端' },
              { slug: 'reference/developer-tools/libraries/router', title: '路由器' },
              { slug: 'reference/developer-tools/libraries/typecasts', title: '类型转换' },
              { slug: 'reference/developer-tools/libraries/message', title: '消息' },
              { slug: 'reference/developer-tools/libraries/hookmetadata', title: '钩子元数据' },
            ]
          },
          {
            id: 'typescript-sdk',
            title: 'TypeScript SDK',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'reference/developer-tools/typescript-sdk/overview', title: '概述' },
              { slug: 'reference/developer-tools/typescript-sdk/transfer-fee-calculation', title: '转账费用计算' },
            ]
          },
          {
            id: 'developer-tips',
            title: '开发者提示',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'reference/developer-tips/unit-testing', title: '单元测试' },
            ]
          }
        ]
      },
      {
        id: 'resources',
        title: '资源',
        collapsed: false,
        type: 'group',
        children: [
          {
            id: 'hyperlane-explorer',
            title: 'Hyperlane 浏览器',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'reference/explorer/overview', title: '概述' },
              { slug: 'reference/explorer/configuring-pi-chains', title: '配置 PI 链' },
              { slug: 'reference/explorer/graphql-api', title: 'GraphQL API' },
              { slug: 'reference/explorer/explorer-debugging', title: '浏览器调试' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'learn',
    title: '学习',
    collapsed: false,
    groups: [
      {
        id: 'introduction',
        title: '介绍',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'protocol/protocol-overview', title: '协议概述' },
        ]
      },
      {
        id: 'protocol',
        title: '协议',
        collapsed: false,
        type: 'group',
        children: [
          {
            id: 'general-messaging',
            title: '通用消息传递',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'protocol/core/mailbox', title: 'Mailbox' },
              { slug: 'protocol/core/fees', title: '费用' },
              { slug: 'protocol/core/interchain-gas-payment', title: '跨链 Gas 支付' },
            ]
          },
          {
            id: 'modular-security',
            title: '模块化安全',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'protocol/ISM/modular-security', title: '模块化安全' },
              { slug: 'protocol/ISM/sequence-diagram', title: '序列图' },
              { slug: 'protocol/ISM/ism-marketplace', title: 'ISM 市场' },
              { slug: 'protocol/ISM/custom-ISM', title: '自定义 ISM' },
              {
                id: 'standard-ism',
                title: '标准 ISM',
                collapsed: false,
                type: 'group',
                children: [
                  {
                    id: 'multisig-ism',
                    title: '多重签名 ISM',
                    collapsed: false,
                    type: 'group',
                    children: [
                      { slug: 'protocol/ISM/standard-ISMs/multisig-ISM', title: '多重签名 ISM' },
                      { slug: 'reference/addresses/validators/latencies', title: '延迟' },
                    ]
                  },
                  { slug: 'protocol/ISM/standard-ISMs/routing-ISM', title: '路由 ISM' },
                  { slug: 'protocol/ISM/standard-ISMs/aggregation-ISM', title: '聚合 ISM' },
                  { slug: 'protocol/ISM/standard-ISMs/offchain-lookup-ISM', title: '链下查找 ISM' },
                ]
              },
              {
                id: 'economic-security',
                title: '经济安全',
                collapsed: false,
                type: 'group',
                children: [
                  { slug: 'protocol/ISM/economic-security/overview', title: '概述' },
                  { slug: 'protocol/ISM/economic-security/hyperlane-avs', title: 'Hyperlane AVS' },
                ]
              }
            ]
          },
          {
            id: 'hyperlane-agents',
            title: 'Hyperlane 代理',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'protocol/agents/overview', title: '概述' },
              { slug: 'protocol/agents/validators', title: '验证器' },
              { slug: 'protocol/agents/relayer', title: '中继器' },
            ]
          }
        ]
      },
      {
        id: 'hyper-and-protocol-economics',
        title: 'HYPER 和协议经济学',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'protocol-economics/intro', title: '介绍' },
        ]
      },
      {
        id: 'reference',
        title: '参考',
        collapsed: false,
        type: 'group',
        children: [
          {
            id: 'send-and-receive',
            title: '发送和接收',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'reference/messaging/send', title: '发送' },
              { slug: 'reference/messaging/receive', title: '接收' },
            ]
          },
          {
            id: 'post-dispatch-hooks',
            title: '调度后钩子',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'protocol/core/post-dispatch-hooks-overview', title: '调度后钩子概述' },
              { slug: 'reference/hooks/interchain-gas', title: '跨链 Gas' },
              { slug: 'reference/hooks/op-stack', title: 'OP Stack' },
              { slug: 'reference/hooks/arbitrum-L2-to-L1', title: 'Arbitrum L2 到 L1' },
              { slug: 'reference/hooks/polygon-pos', title: 'Polygon PoS' },
            ]
          }
        ]
      },
      {
        id: 'alternative-vm-implementations-and-guides',
        title: '替代虚拟机实现和指南',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'alt-vm-implementations/overview', title: '概述' },
          { slug: 'alt-vm-implementations/implementation-guide', title: '实现指南' },
          { slug: 'alt-vm-implementations/cosmos-sdk', title: 'Cosmos SDK' },
        ]
      },
      {
        id: 'resources-learn',
        title: '资源',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'resources/message-debugging', title: '消息调试' },
          { slug: 'resources/glossary', title: '术语表' },
          { slug: 'resources/faq', title: '常见问题' },
          { slug: 'resources/audits', title: '审计' },
        ]
      }
    ]
  },
  {
    id: 'agents',
    title: '代理',
    collapsed: false,
    groups: [
      {
        id: 'introduction-agents',
        title: '介绍',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'operate/overview-agents', title: '代理概述' },
        ]
      },
      {
        id: 'key-management',
        title: '密钥管理',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'operate/set-up-agent-keys', title: '设置代理密钥' },
        ]
      },
      {
        id: 'validators',
        title: '验证器',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'operate/validators/run-validators', title: '运行验证器' },
          { slug: 'operate/validators/validator-signatures-aws', title: '验证器签名 AWS' },
          { slug: 'operate/validators/monitoring-alerting', title: '监控和告警' },
        ]
      },
      {
        id: 'relayers',
        title: '中继器',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'operate/relayer/run-relayer', title: '运行中继器' },
          {
            id: 'http-api',
            title: 'HTTP API',
            collapsed: false,
            type: 'group',
            children: [
              { slug: 'operate/relayer/api', title: 'API' },
              { slug: 'operate/relayer/api/operations/get-operations', title: '获取操作' },
              { slug: 'operate/relayer/api/operations/post-message-retry', title: '重试消息' },
              { slug: 'operate/relayer/api/operations/post-reprocess-message', title: '重新处理消息' },
              { slug: 'operate/relayer/api/messages/get-messages', title: '获取消息' },
              { slug: 'operate/relayer/api/messages/post-messages', title: '发送消息' },
              { slug: 'operate/relayer/api/merkle-tree-insertions/get-merkle-tree-insertions', title: '获取 Merkle 树插入' },
              { slug: 'operate/relayer/api/merkle-tree-insertions/post-merkle-tree-insertions', title: '发送 Merkle 树插入' },
              { slug: 'operate/relayer/api/igp/get-igp-rules', title: '获取 IGP 规则' },
              { slug: 'operate/relayer/api/igp/post-igp-rules', title: '发送 IGP 规则' },
              { slug: 'operate/relayer/api/igp/delete-igp-rules', title: '删除 IGP 规则' },
            ]
          },
          { slug: 'operate/relayer/message-filtering', title: '消息过滤' },
          { slug: 'operate/relayer/monitoring-alerting', title: '监控和告警' },
        ]
      },
      {
        id: 'agent-configuration',
        title: '代理配置',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'operate/config/agent-config', title: '代理配置' },
          { slug: 'operate/config/config-reference', title: '配置参考' },
        ]
      },
      {
        id: 'guides-agents',
        title: '指南',
        collapsed: false,
        type: 'group',
        children: [
          { slug: 'operate/guides/docker-quickstart', title: 'Docker 快速入门' },
          { slug: 'operate/guides/deploy-with-terraform', title: '使用 Terraform 部署' },
          { slug: 'operate/guides/avs-operator-guide', title: 'AVS 操作员指南' },
        ]
      }
    ]
  }
];

/**
 * 获取所有文档分类配置
 * @returns 文档分类配置数组
 */
export function getDocsByCategory(): DocCategory[] {
  return docsCategories;
}

/**
 * 根据文档 slug 查找对应的分类和文档信息
 * 支持在所有分类和嵌套分组中递归搜索
 *
 * @param slug 文档的唯一标识符
 * @returns 包含分类和文档信息的对象，如果未找到则返回 null
 */
export function findDocCategory(
  slug: string
): { category: DocCategory; doc: DocItem } | null {
  for (const category of docsCategories) {
    // 首先搜索分类下直接的文档
    if (category.docs) {
      const doc = category.docs.find((d) => d.slug === slug);
      if (doc) {
        return { category, doc };
      }
    }

    // 然后递归搜索分类下的分组中的文档
    if (category.groups) {
      const result = searchInGroups(category.groups, slug);
      if (result) {
        return { category, doc: result };
      }
    }
  }
  return null;
}

/**
 * 在分组中递归搜索指定 slug 的文档
 * 支持多层嵌套的分组结构
 *
 * @param groups 要搜索的分组数组
 * @param slug 要查找的文档 slug
 * @returns 找到的文档项，如果未找到则返回 null
 */
function searchInGroups(groups: DocGroup[], slug: string): DocItem | null {
  for (const group of groups) {
    for (const child of group.children) {
      // 如果子项是文档项且 slug 匹配
      if ('slug' in child && child.slug === slug) {
        return child;
      }
      // 如果子项是嵌套分组，递归搜索
      if ('type' in child && child.type === 'group') {
        const result = searchInGroups([child], slug);
        if (result) return result;
      }
    }
  }
  return null;
}
