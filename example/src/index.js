import React from 'react';
import ReactDOM from 'react-dom';
import { FlagsProvider, withFeature, Feature, useFeature } from 'flagged'; //#TODO: change to represent local version.

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

function V3Component(props) {
  const version = `v3 | from ${props.from}`;
  return <VersionComponent version={version} />;
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

      {/* Render Prop */}
      <Feature name="v2" render={<V2Component />}/>

      {/* Render Prop */}
      <Feature name="v2" render={(isEnabled) =>
          isEnabled ? <V2Component/> : <h3>You are not in V2</h3>
      }/>


      {/* Render and RenderFallback Prop */}
      <Feature name="v3" render={<V3Component from="render prop"/>} renderFallback={<h3>You are not in V3| fallback from render prop.</h3>} />

      {/* Children and RenderFallback Prop */}
      <Feature name="v3" renderFallback={<h3>You are not in V3| fallback from children prop.</h3>}>
        <V3Component from="children prop"/>
      </Feature>

      {/*Only Fallback Prop */}
      <Feature name="v3" renderFallback={<h3>You are not in V3| only fallback.</h3>}>
      </Feature>

      {/* Function as Children */}
      <Feature name="v4">
        {hasV4 => (hasV4 ? <V4Component /> : <h3>You are not in v4.</h3>)}
      </Feature>

    </FlagsProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
