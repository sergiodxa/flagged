import * as React from "react";
const FeatureFlagsContext = React.createContext({});
function transformFlags(features) {
	if (!Array.isArray(features)) return features;
	return Object.fromEntries(features.map((feature) => [feature, true]));
}
function mergeFeatures(a, b) {
	return { ...a, ...b };
}
export function FlagsProvider({ features = {}, children }) {
	const currentFeatures = useFeatures();
	return React.createElement(
		FeatureFlagsContext.Provider,
		{
			value: mergeFeatures(
				transformFlags(currentFeatures),
				transformFlags(features),
			),
		},
		children,
	);
}
// Custom Hook API
export function useFeatures() {
	return React.useContext(FeatureFlagsContext);
}
// Custom Hook API
export function useFeature(name) {
	const features = useFeatures();
	if (Array.isArray(features)) return features.includes(name);
	if (typeof features[name] === "boolean") return features[name];
	return (
		name
			.split("/")
			// eslint-disable-next-line unicorn/no-array-reduce
			.reduce((featureGroup, featureName) => {
				if (typeof featureGroup === "boolean") return featureGroup;
				if (featureGroup[featureName] === undefined) return false;
				return featureGroup[featureName];
			}, features)
	);
}
// Render Prop API
export function Feature({ name, children, render = children }) {
	const hasFeature = useFeature(name);
	if (typeof render === "function") return render(hasFeature);
	if (!hasFeature) return null;
	return React.createElement(React.Fragment, null, render);
}
// High Order Component API
export function withFeature(featureName) {
	return (Component) => {
		function WithFeature(props) {
			return React.createElement(
				Feature,
				{ name: featureName },
				React.createElement(Component, { ...props }),
			);
		}
		WithFeature.displayName = `WithFeature(${Component.displayName || Component.name})`;
		return WithFeature;
	};
}
