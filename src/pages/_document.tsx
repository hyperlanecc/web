import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts - 科幻感字体 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="Hyperlane" />
        <meta
          property="og:description"
          content="加入我们，和 Hyperlane CN 一起了解、参与、构建 Hyperlane。"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hyperlane.cc" />
        <meta property="og:image" content="https://hyperlane.cc/cover.png" />
        <meta property="og:site_name" content="Hyperlane" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hyperlane" />
        <meta
          name="twitter:description"
          content="加入我们，和 Hyperlane CN 一起了解、参与、构建 Hyperlane。"
        />
        <meta name="twitter:image" content="https://hyperlane.cc/cover.png" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
