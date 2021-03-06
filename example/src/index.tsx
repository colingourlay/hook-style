declare var React;
declare var ReactDOM;
const { useEffect, useState } = React;
import { ThemeProvider, injectGlobal, useStyle, useTheme, useThemelessStyle } from '../../src/styled-hooks';
import { hsl2hex } from './color';

interface TitleProps {
  children?: any[];
}

function Title({ children }: TitleProps) {
  const className = useStyle`
    margin: #{space.3} 0 #{space.0};
    padding: ${({ space }) => `${space[3]} ${space[0]}`};
    width: 10rem;
    background-color: #{colors.bg};
    color: #{colors.fg};

    @media (min-width: 32rem) {
      width: 15rem;
    }
  `;

  return <h1 className={className}>{children}</h1>;
}

interface ButtonProps {
  primary?: boolean;
  children?: any[];
}

function Button({ primary, children }: ButtonProps) {
  const {
    colors: { bg, fg },
    space
  } = useTheme();
  const className = useThemelessStyle`
    display: inline-block;
    border-radius: 0.125rem;
    padding: 0.5rem 0;
    margin: ${space[3]};
    width: 10rem;
    background-color: ${primary ? fg : 'transparent'};
    color: ${primary ? bg : fg};
    border: 0.125rem solid ${fg};

    @media (min-width: 32rem) {
      padding: 0.75rem 0;
      width: 15rem;
      font-size: 1.5rem;
    }

    &:focus {
      color: #000;
      border-color: #000;
    }
  `;

  return <button className={className}>{children}</button>;
}

interface EmojiProps {
  visible?: boolean;
  children?: any[];
}

function Emoji({ visible, children }: EmojiProps) {
  /* Only opacity should create a custom prop */
  const className = useStyle`
    opacity: ${visible ? 1 : 0};
    ${'padding: 1rem;'}
    margin: ${`1rem;
    font-size: `}5rem;
    ${'transition'}: opacity .125s;
    ${''}`;

  return <div className={className}>{children}</div>;
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  const [theme, setTheme] = useState({
    colors: {
      bg: '#fff',
      fg: '#000'
    },
    space: ['0', '0.25rem', '0.5rem', '1rem', '2rem', '4rem', '8rem', '16rem', '32rem']
  });

  const className = useThemelessStyle`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: ${theme.colors.bg};
    box-sizing: border-box;
    min-height: 100vh;
  `;

  function updateColors(e) {
    const { pageX, pageY } = e.touches ? e.touches[0] : e;

    setTheme(theme => ({
      ...theme,
      colors: {
        bg: hsl2hex(pageX / window.innerWidth, 0.25, 0.9),
        fg: hsl2hex(pageY / window.innerHeight, 0.5, 0.5)
      }
    }));
  }

  useEffect(() => {
    setTimeout(() => {
      setActiveIndex((activeIndex + 1) % 4);
    }, 500);
  }, [activeIndex]);

  return (
    <ThemeProvider theme={theme}>
      <div className={className} onMouseMove={updateColors} onTouchMove={updateColors}>
        <ThemeProvider theme={outerTheme => ({ ...outerTheme, colors: { bg: theme.colors.fg, fg: theme.colors.bg } })}>
          <Title>Styled Hooks</Title>
        </ThemeProvider>
        <Button primary={activeIndex === 0}>First</Button>
        <Button primary={activeIndex === 1}>Second</Button>
        <Button primary={activeIndex === 2}>Third</Button>
        <Emoji visible={activeIndex === 3}>🎉</Emoji>
      </div>
    </ThemeProvider>
  );
}

injectGlobal`
  body {
    margin: 0;
  }
  button {
    font-size: 1rem;
  }
`;

ReactDOM.render(<App />, document.getElementById('app'));
