declare var React;
declare var ReactDOM;
const { useEffect, useState } = React;
import { ThemeProvider, useStyle, useTheme } from '../../src/hook-style';
import { hsl2hex } from './color';

interface ButtonProps {
  primary?: boolean;
  children?: any[];
}

function Button({ primary, children }: ButtonProps) {
  const { bg, fg } = useTheme();
  const className = useStyle`
    display: inline-block;
    border-radius: 0.125rem;
    padding: 0.5rem 0;
    margin: 1rem;
    width: 10rem;
    background-color: ${primary ? fg : 'transparent'};
    color: ${primary ? bg : fg};
    border: 0.125rem solid ${fg};
    transition: background-color .25s, color .25s;
  `;

  return <button className={className}>{children}</button>;
}

interface EmojiProps {
  visible?: boolean;
  children?: any[];
}

function Emoji({ visible, children }: EmojiProps) {
  const className = useStyle`
    opacity: ${visible ? 1 : 0};
    margin: 1rem;
    font-size: 5rem;
    transition: opacity .125s;
  `;

  return <div className={className}>{children}</div>;
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setActiveIndex((activeIndex + 1) % 4);
    }, 500);
  }, [activeIndex]);

  const [fg, setFG] = useState('#000000');
  const [bg, setBG] = useState('#ffffff');

  const className = useStyle`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: ${bg};
    box-sizing: border-box;
    min-height: 100vh;
    transition: background-color .25s;
  `;

  function updateTheme(e) {
    const { pageX, pageY } = e.touches ? e.touches[0] : e;

    setFG(hsl2hex(pageX / window.innerWidth, 0.5, 0.5));
    setBG(hsl2hex(pageY / window.innerHeight, 0.25, 0.9));
  }

  return (
    <ThemeProvider theme={{ bg, fg }}>
      <div className={className} onMouseMove={updateTheme} onTouchMove={updateTheme}>
        <Button primary={activeIndex === 0}>First</Button>
        <Button primary={activeIndex === 1}>Second</Button>
        <Button primary={activeIndex === 2}>Third</Button>
        <Emoji visible={activeIndex === 3}>🎉</Emoji>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
