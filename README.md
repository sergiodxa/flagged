# Flagged

> Feature flags for React made easy with hooks, HOC and Render Props

- React-based
- Hooks API
- High Order Component API
- Render Props API
- TypeScript Support

## How to Use It

Install it from npm.

```bash
yarn add flagged
# npm i flagged
```

Import the `FlagsProvider` in your code and wrap your application around it.

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FlagsProvider } from 'flagged';

import App from './components/app';

ReactDOM.render(
  <FlagsProvider features={{ v2: true }}>
    <App />
  </FlagsProvider>,
  document.querySelector('root')
);
```

Now use `useFeature`, `withFeature` or `Feature` to check if the feature is enabled in your application:

### `useFeature` Custom Hook

The `useFeature` custom hook is the base for the HOC and Render Prop implementation, it lets you check if a single feature is enabled and get a boolean, then you can do anything you want with that value, uesful to use it in combination with other hooks like useEffect or to show two different UIs based on a feature being enabled or not.

```tsx
import * as React from 'react';
import { useFeature } from 'flagged';

function Header() {
  const hasV2 = useFeature('v2');

  return <header>{hasV2 ? <h1>My App v2</h1> : <h1>My App v1</h1>}</header>;
}

export default Header;
```

### `withFeature` High Order Component

This `withFeature` high order component let's you wrap a component behind a feature flag, this way the parent component using your wrapped component doesn't need to know anything about the feature flag. This is useful when you don't need to provide a fallback if the feature is disabled, e.g. for admin pieces of UI or new features you want to hide completely.

```tsx
import * as React from "react";
import { withFeature } from "flagged":

function Heading() {
  return <h1>My App v2</h1>
}

export default withFeature("v2")(Heading);
```

### `Feature` Render Prop

The `Feature` component works using the render prop pattern and as a wrapper. This component is useful if you want to hide an specific part of a component behind a feature flag but don't want to wrap the whole component.

Pass the name of the feature you want to check for and a children value and it will not render the children if the feature is enabled.

```tsx
import * as React from 'react';
import { Feature } from 'flagged';

function Header() {
  return (
    <header>
      <Feature name="v2">
        <h1>My App v2</h1>
      </Feature>
    </header>
  );
}

export default Header;
```

Another option is to pass a function as children and get a boolean if the feature is enabled, this way you can render two different pieces of UI based on the feature being enabled or not.

```tsx
import * as React from 'react';
import { Feature } from 'flagged';

function Header() {
  return (
    <header>
      <Feature name="v2">
        {(isEnabled: boolean) =>
          isEnabled ? <h1>My App v2</h1> : <h1>My App v1</h1>
        }
      </Feature>
    </header>
  );
}

export default Header;
```

In both cases you could also send a `render` prop instead of `children`.

```tsx
import * as React from 'react';
import { Feature } from 'flagged';

function Header() {
  return (
    <header>
      <Feature name="v2" render={<h1>My App v2</h1>} />
    </header>
  );
}

export default Header;
```

```tsx
import * as React from 'react';
import { Feature } from 'flagged';

function Header() {
  return (
    <header>
      <Feature
        name="v2"
        render={(isEnabled: boolean) =>
          isEnabled ? <h1>My App v2</h1> : <h1>My App v1</h1>
        }
      />
    </header>
  );
}

export default Header;
```
