import * as React from 'react';

type FeatureGroup = {
  [featureName: string]: boolean | FeatureGroup;
};

export type FeatureFlags = string[] | FeatureGroup;

const FeatureFlagsContext = React.createContext<FeatureFlags | null>(null);

export function FlagsProvider({
  features,
  children,
}: {
  features?: FeatureFlags;
  children: React.ReactChild;
}) {
  if (!features || features === null || typeof features !== 'object') {
    throw new TypeError('The features prop must be an object or an array.');
  }
  return (
    <FeatureFlagsContext.Provider value={features}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Custom Hook API
export function useFeatures(): FeatureFlags {
  const features = React.useContext(FeatureFlagsContext);
  if (features === null) {
    throw new Error('You must wrap your components in a FlagsProvider.');
  }
  return features;
}

// Custom Hook API
export function useFeature(name: string): boolean | FeatureFlags {
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

// High Order Component API
export function withFeature(featureName: string) {
  return (Component: Function) => (props: React.ComponentProps<any>) => {
    const hasFeature = useFeature(featureName);
    if (!hasFeature) return null;
    return <Component {...props} />;
  };
}

// Render Prop API
export function Feature({
  name,
  children,
  render = children,
}: {
  name: string;
  children?: React.ReactChild | Function;
  render?: React.ReactChild | Function;
}) {
  const hasFeature = useFeature(name);
  if (typeof render === 'function') return render(hasFeature);
  if (!hasFeature) return null;
  return render;
}
