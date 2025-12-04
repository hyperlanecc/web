import { FC, CSSProperties } from 'react';
import styles from './GlitchText.module.css';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

interface CustomCSSProperties extends CSSProperties {
  '--after-duration': string;
  '--before-duration': string;
  '--after-shadow': string;
  '--before-shadow': string;
}

const GlitchText: FC<GlitchTextProps> = ({
  children,
  speed = 1.5,
  enableShadows = true,
  enableOnHover = false,
  className = ''
}) => {
  const inlineStyles: CustomCSSProperties = {
    '--after-duration': `${speed * 2.5}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-3px 0 rgba(99, 102, 241, 0.7)' : 'none',
    '--before-shadow': enableShadows ? '3px 0 rgba(147, 51, 234, 0.7)' : 'none'
  };

  const hoverClass = enableOnHover ? styles.enableOnHover : '';

  return (
    <div 
      className={`${styles.glitch} ${hoverClass} ${className}`} 
      style={inlineStyles} 
      data-text={children}
    >
      {children}
    </div>
  );
};

export default GlitchText;