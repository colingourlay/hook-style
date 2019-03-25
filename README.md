# styled-hooks

Style your React components with Hooks

## Table of contents

- [Getting started](#getting-started)
- [API](#api)
  - [Generating `className`s with the `useStyle` hook](#usestyle)
  - [Theming with `<ThemeProvider/>` and the `useTheme` hook](#usetheme)
- [About the project](#about-the-project)

## Getting started

```sh
npm install styled-hooks
```

```jsx
import { useStyle } from 'styled-hooks';
import React from 'react';
import ReactDOM from 'react-dom';

function Paragraph({ color, ...props }) {
  const cn = useStyle`
    padding: 1rem;
    background-color: yellow;
    color: ${color};
  `;

  return <p className={cn} {...props} />;
}

ReactDOM.render(
  <div>
    <Paragraph color="magenta">I'm magenta</Paragraph>
    <Paragraph color="blue">I'm blue</Paragraph>
  </div>,
  document.getElementById('root')
);
```

<p>
  <a href="https://glitch.com/edit/#!/remix/styled-hooks-getting-started">
    <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33">
  </a>&ensp;or have a look at what got rendered 👇
</p>

```html
<!-- In <head /> -->
<style>
  .gtXozB {
    padding: 1rem;
    background-color: yellow;
    color: var(--gtXozB-0);
  }
</style>
<style>
  .gqAIHm {
    --gtXozB-0: blue;
  }
</style>
<style>
  .eKigJM {
    --gtxozb-0: magenta;
  }
</style>

<!-- In <div id="root" /> -->
<div>
  <p class="gtXozB gqAIHm">I'm blue</p>
  <p class="gtXozB eKigJM">I'm magenta</p>
</div>
```

![Image of blue and magenta paragraphs with yellow backgrounds](https://raw.githubusercontent.com/colingourlay/styled-hooks/master/static/getting-started-output.svg?sanitize=true)

<details>
  <summary>“Wait. Those are <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/--*">CSS Custom Properties</a>. I thought they didn't work everywhere?”</summary><br>
  
Don't worry! `styled-hooks` will render the following in browsers that aren't up to scratch:

```html
<!-- In <head /> -->
<style>
  .efNhRD {
    padding: 1rem;
    background-color: yellow;
    color: blue;
  }
</style>
<style>
  .kGJulO {
    padding: 1rem;
    background-color: yellow;
    color: magenta;
  }
</style>

<!-- In <div id="root" /> -->
<div>
  <p class="efNhRD">I'm blue</p>
  <p class="kGJulO">I'm magenta</p>
</div>
```

The amount of CSS generated is larger, but it acheives the same effect.

If you want to use this output in _all_ browsers, use the `useStyleWithoutCustomProps` hook.

On the other hand, if you can guarantee your app wont be run in older browsers, you can skip the support check by using the `useStyleWithCustomProps` hook directly.

</details>

## API

### `useStyle`

The `useStyle` hook is a [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that expects CSS & dynamic values, and returns a `className` you can use in your component.

The hook will memoise the CSS each unique style variant, and inject it into your document's `<head>`, taking advantage of CSS Custom Properties (if your browser suports them) to reduce style replication.

Style injection happens during the browser's layout phase, so your components will always be painted fully-styled.

Thanks to [`stylis`](https://github.com/thysultan/stylis.js), you can use some basic nesting and media queries:

```jsx
import { useStyle } from 'styled-hooks';
import React from 'react';
import ReactDOM from 'react-dom';

function Button({ primary, ...props }) {
  const cn = useStyle`
    display: inline-block;
    padding: 0.5rem 0;
    width: 10rem;
    background-color: ${primary ? 'magenta' : 'yellow'};
    color: ${primary ? 'yellow' : 'magenta'};
    border: 0.125rem solid ${'magenta'};

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

  return <button className={cn} {...props} />;
}

ReactDOM.render(
  <div>
    <Button>Standard</Button>
    <Button primary>Primary</Button>
  </div>,
  document.getElementById('root')
);
```

<p>
  <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usestyle">
    <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33">
  </a>
</p>

### `useTheme`

The `useTheme` hook allows you to read the theme context from the nearest `<ThemeProvider />` ancestor:

```jsx
import { useStyle, useTheme, ThemeProvider } from 'styled-hooks';
import React from 'react';
import ReactDOM from 'react-dom';

function Paragraph({ ...props }) {
  const { fg, bg } = useTheme();

  const cn = useStyle`
    padding: 1rem;
    background-color: ${bg};
    color: ${fg};
  `;

  return <p className={cn} {...props} />;
}

ReactDOM.render(
  <ThemeProvider theme={{ fg: 'magenta', bg: 'yellow' }}>
    <Paragraph>I'm magenta on yellow</Paragraph>
  </ThemeProvider>,
  document.getElementById('root')
);
```

<p>
  <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usetheme-1">
    <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33">
  </a>
</p>

Combine this with React's `useState` hook, and you'll be able to modify the theme on the fly:

```jsx
import { useStyle, useTheme, ThemeProvider } from 'styled-hooks';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Button({ primary, ...props }) {
  const { fg, bg } = useTheme();

  const cn = useStyle`
    padding: 0.5rem;
    background-color: ${primary ? fg : bg};
    color: ${primary ? bg : fg};
    border: 0.125rem solid ${fg};
  `;

  return <button className={cn} {...props} />;
}

function App() {
  const [theme, setTheme] = useState({
    fg: 'magenta',
    bg: 'yellow'
  });

  const invertTheme = () =>
    setTheme({
      bg: theme.fg,
      fg: theme.bg
    });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Button onClick={invertTheme}>Invert Theme</Button>
        <Button onClick={invertTheme} primary>
          Invert Theme
        </Button>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

<p>
  <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usetheme-2">
    <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33">
  </a>
</p>

## About the project

- `styled-hooks` is currently maintained by [Colin Gourlay](https://colin-gourlay.com)
- It is currently licensed under [The Unlicense](LICENSE)
- If you'd like to help out, please submit ideas & bugs to the project's [issue tracker](https://github.com/colingourlay/styled-hooks/issues)
- To contribute code and documentation, please see the [contribution guide](CONTRIBUTING.md)
- All contributions and project activity are subject to the project's [Code of Conduct](CODE_OF_CONDUCT.md)
