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

export function useExactFeatures(names: Array<string>): boolean | FeatureGroup {
  const features = useFeatures();
  let matchCount = 0;
  if (Array.isArray(features)) {
    return names.every(r=> features.indexOf(r) >= 0)
  };
  names.forEach(name=>{
    if(features[name] === undefined) return;
    if (typeof features[name] === 'boolean' && features[name] == true) { matchCount++; return }

    return name
    .split('/')
    .reduce<FeatureGroup | boolean>((featureGroup, featureName: string) => {
      if (typeof featureGroup === 'boolean' && featureGroup == true){ matchCount++; return featureGroup}
      if (typeof featureGroup === 'object' && featureGroup[featureName] === undefined) return false;
      if (typeof featureGroup === 'object' && typeof featureGroup[featureName] === 'boolean' 
        && featureGroup[featureName] == true){ matchCount++; return featureGroup[featureName]}
        return false;
    }, features);
  })  
  return matchCount === names.length;
}

// Render Prop API
export function Feature({
  name,
  children,
  render = children,
  renderFallback = null,
  names = null
}: {
  name?: string;
  names?: string[] | null;
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
  const hasFeature = names == null ? useFeature(name??'') : useExactFeatures(names);
  if (!hasFeature && typeof renderFallback === 'function') return renderFallback();
  if (typeof render === 'function') return render(hasFeature);
  if (!hasFeature) return renderFallback;
  return render ?? null;
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
