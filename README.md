# Flagged

### Feature flags for React made easy with hooks, HOC and Render Props

![CI Status](https://github.com/sergiodxa/flagged/workflows/CI/badge.svg)
![Publish Status](https://github.com/sergiodxa/flagged/workflows/Publish/badge.svg)
![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=sergiodxa/flagged)
[![Maintainability](https://api.codeclimate.com/v1/badges/816ce0bddd76bafba932/maintainability)](https://codeclimate.com/github/sergiodxa/flagged/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/816ce0bddd76bafba932/test_coverage)](https://codeclimate.com/github/sergiodxa/flagged/test_coverage)
![license](https://badgen.net/github/license/sergiodxa/flagged)
![releases](https://badgen.net/github/releases/sergiodxa/flagged)
![npm version](https://badgen.net/npm/v/sergiodxa/flagged)
![dependencies](https://badgen.net/david/dep/sergiodxa/flagged)

## Features

- Hooks API
- High Order Component API
- Render Props API
- TypeScript Support
- Zero Dependencies
- Nested Flags

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

### Features Valid Values

The features prop you pass to `FlagsProvider` could be an array of strings or an object, if you decide to use an object you could also pass nested objects to group feature flags together.

**Using an Array**
```tsx
ReactDOM.render(
  <FlagsProvider features={['v2', 'moderate']}>
    <App />
  </FlagsProvider>,
  document.querySelector('root')
);
```

**Using an Object**
```tsx
ReactDOM.render(
  <FlagsProvider features={{ v2: true, moderate: false }}>
    <App />
  </FlagsProvider>,
  document.querySelector('root')
);
```

**Using Nested Objects**
```tsx
ReactDOM.render(
  <FlagsProvider
    features={{ v2: true, content: { moderate: true, admin: false } }}
  >
    <App />
  </FlagsProvider>,
  document.querySelector('root')
);
```

If you use nested objects you will need to either use the `useFeatures` hook or pass a string separated by `/`, e.g. `content/moderate` to read nested flags, if you don't pass the whole path you will get an object so `content` will return `{ moderate: false }` when reading it.

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

### `useFeatures` Custom Hook

The `useFeatures` custom hook is the base for the `useFeature` custom hook, it gives you the entire feature flags object or array you sent to `FlagsProvider` so you could use it however you want.

```tsx
import * as React from 'react';
import { useFeature } from 'flagged';

function Header() {
  const features = useFeatures();

  return (
    <header>{features.v2 ? <h1>My App v2</h1> : <h1>My App v1</h1>}</header>
  );
}

export default Header;
```
