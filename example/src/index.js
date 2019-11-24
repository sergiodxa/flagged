import React from 'react';
import ReactDOM from 'react-dom';
import { FlagsProvider, withFeature, Feature, useFeature } from 'flagged';

function VersionComponent({ version }) {
  return <h1>You are currently in {version}.</h1>;
}

// Custom Hook
function V1Component() {
  const hasV1 = useFeature('v1');
  if (!hasV1) return null;
  return <VersionComponent version="v1" />;
}

// High Order Component
const V2Component = withFeature('v2')(function V2Component() {
  return <VersionComponent version="v2" />;
});

function V3Component() {
  return <VersionComponent version="v3" />;
}

function V4Component() {
  return <VersionComponent version="v4" />;
}

function App() {
  const [version, setVersion] = React.useState(1);

  return (
    <FlagsProvider
      features={{
        v1: version === 1,
        v2: version === 2,
        v3: version === 3,
        v4: version === 4,
      }}
    >
      <label>
        Version{' '}
        <input
          type="number"
          value={version}
          onChange={e => setVersion(Number(e.target.value))}
        />
      </label>

      <V1Component />

      <V2Component />

      {/* Render Prop */}
      <Feature name="v3" render={<V3Component />} />

      {/* Function as Children */}
      <Feature name="v4">
        {hasV4 => (hasV4 ? <V4Component /> : <h3>You are not in v4.</h3>)}
      </Feature>
    </FlagsProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
