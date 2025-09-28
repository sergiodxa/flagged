import {
	createContext,
	Fragment,
	useContext,
	type ReactNode,
	type ReactElement,
	type ComponentType,
} from "react";

type FeatureGroup = { [featureName: string]: boolean | FeatureGroup };

export type FeatureFlags = string[] | FeatureGroup;

let FeatureFlagsContext = createContext<FeatureGroup>({});

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
	children: ReactNode;
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
	return useContext(FeatureFlagsContext);
}

// Custom Hook API
export function useFeature(name: string): boolean | FeatureGroup {
	let features = useFeatures();
	if (Array.isArray(features)) return features.includes(name);
	if (typeof features[name] === "boolean") return features[name];

	let featureGroup: FeatureGroup | boolean = structuredClone(features);
	for (let featureName of name.split("/")) {
		if (typeof featureGroup === "boolean") return featureGroup;
		if (featureGroup[featureName] === undefined) return false;
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
	children?: ReactNode | ((hasFeature: boolean | FeatureGroup) => ReactElement);
	render?: ReactNode | ((hasFeature: boolean | FeatureGroup) => ReactElement);
}) {
	let hasFeature = useFeature(name);
	if (typeof render === "function") return render(hasFeature);
	if (!hasFeature) return null;
	return <Fragment>{render}</Fragment>;
}

// High Order Component API
export function withFeature<Props extends object>(featureName: string) {
	return (Component: ComponentType<Props>) => {
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
