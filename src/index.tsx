import * as React from 'react';

export type FeatureFlags =
  | string[]
  | {
      [featureName: string]: boolean;
    };

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
export function useFeature(name: string): boolean {
  const features = useFeatures();
  return Array.isArray(features) ? features.includes(name) : features[name];
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
