import * as React from 'react';

type FeatureGroup = {
  [featureName: string]: boolean | FeatureGroup;
};

export type FeatureFlags = string[] | FeatureGroup;

const FeatureFlagsContext = React.createContext<FeatureGroup>({});

function transformFlags(features: FeatureFlags) {
  if (!Array.isArray(features)) return features;
  return Object.fromEntries(features.map(feature => [feature, true]));
}

function mergeFeatures(a: FeatureGroup, b: FeatureGroup): FeatureGroup {
  return { ...a, ...b };
}

export function FlagsProvider({
  features = {},
  children,
}: {
  features?: FeatureFlags;
  children: React.ReactNode;
}) {
  const currentFeatures = useFeatures();
  return (
    <FeatureFlagsContext.Provider
      value={mergeFeatures(
        transformFlags(currentFeatures),
        transformFlags(features)
      )}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Custom Hook API
export function useFeatures(): FeatureGroup {
  return React.useContext(FeatureFlagsContext);
}

// Custom Hook API
export function useFeature(name: string): boolean | FeatureGroup {
  const features = useFeatures();
  if (Array.isArray(features)) return features.includes(name);
  if (typeof features[name] === 'boolean') return features[name];
  return name
    .split('/')
    .reduce<FeatureGroup | boolean>((featureGroup, featureName: string) => {
      if (typeof featureGroup === 'boolean') return featureGroup;
      if (featureGroup[featureName] === undefined) return false;
      return featureGroup[featureName];
    }, features);
}

// Render Prop API
export function Feature({
  name,
  children,
  render = children,
  renderFallback = null
}: {
  name: string;
  children?:
    | React.ReactNode
    | ((hasFeature: boolean | FeatureGroup) => JSX.Element);
  render?:
    | React.ReactNode
    | ((hasFeature: boolean | FeatureGroup) => JSX.Element);
  renderFallback?:
    | React.ReactNode
    | (() => JSX.Element);
}) {
  const hasFeature = useFeature(name);
  if (!hasFeature && typeof renderFallback === 'function') return renderFallback();
  if (typeof render === 'function') return render(hasFeature);
  if (!hasFeature) return renderFallback;
  return render;
}

// High Order Component API
export function withFeature(featureName: string) {
  return (Component: Function) => (props: React.ComponentProps<any>) => {
    return (
      <Feature name={featureName}>
        <Component {...props} />
      </Feature>
    );
  };
}
