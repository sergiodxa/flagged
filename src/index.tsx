import * as React from "react";

type FeatureGroup = {
	[featureName: string]: boolean | FeatureGroup;
};

export type FeatureFlags = string[] | FeatureGroup;

let FeatureFlagsContext = React.createContext<FeatureGroup>({});

function transformFlags(features: FeatureFlags) {
	if (!Array.isArray(features)) return features;
	return Object.fromEntries(features.map((feature) => [feature, true]));
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
	let currentFeatures = useFeatures();
	return (
		<FeatureFlagsContext.Provider
			value={mergeFeatures(
				transformFlags(currentFeatures),
				transformFlags(features),
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
	let features = useFeatures();
	if (Array.isArray(features)) {
		const hasFeature = features.includes(name);
		if (!hasFeature) {
			console.warn(
				`Feature flag '${name}' is not defined. Defaulting to false.`,
			);
		}
		return hasFeature;
	}
	if (typeof features[name] === "boolean") return features[name];
	if (features[name] === undefined && !name.includes("/")) {
		console.warn(`Feature flag '${name}' is not defined. Defaulting to false.`);
		return false;
	}

	let featureGroup: FeatureGroup | boolean = structuredClone(features);
	for (let featureName of name.split("/")) {
		if (typeof featureGroup === "boolean") return featureGroup;
		if (featureGroup[featureName] === undefined) {
			console.warn(
				`Feature flag '${name}' is not defined. Defaulting to false.`,
			);
			return false;
		}
		featureGroup = featureGroup[featureName];
	}

	return featureGroup;
}

// Render Prop API
export function Feature({
	name,
	children,
	render = children,
}: {
	name: string;
	children?:
		| React.ReactNode
		| ((hasFeature: boolean | FeatureGroup) => JSX.Element);
	render?:
		| React.ReactNode
		| ((hasFeature: boolean | FeatureGroup) => JSX.Element);
}) {
	let hasFeature = useFeature(name);
	if (typeof render === "function") return render(hasFeature);
	if (!hasFeature) return null;
	return <React.Fragment>{render}</React.Fragment>;
}

// High Order Component API
export function withFeature<Props extends object>(featureName: string) {
	return (Component: React.ComponentType<Props>) => {
		function WithFeature(props: Props) {
			return (
				<Feature name={featureName}>
					<Component {...props} />
				</Feature>
			);
		}

		WithFeature.displayName = `WithFeature(${Component.displayName || Component.name})`;

		return WithFeature;
	};
}
