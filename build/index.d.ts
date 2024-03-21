import * as React from "react";
type FeatureGroup = {
	[featureName: string]: boolean | FeatureGroup;
};
export type FeatureFlags = string[] | FeatureGroup;
export declare function FlagsProvider({
	features,
	children,
}: {
	features?: FeatureFlags;
	children: React.ReactNode;
}): React.JSX.Element;
export declare function useFeatures(): FeatureGroup;
export declare function useFeature(name: string): boolean | FeatureGroup;
export declare function Feature({
	name,
	children,
	render,
}: {
	name: string;
	children?:
		| React.ReactNode
		| ((hasFeature: boolean | FeatureGroup) => JSX.Element);
	render?:
		| React.ReactNode
		| ((hasFeature: boolean | FeatureGroup) => JSX.Element);
}): React.JSX.Element | null;
export declare function withFeature<Props extends object>(
	featureName: string,
): (Component: React.ComponentType<Props>) => {
	(props: Props): React.JSX.Element;
	displayName: string;
};
export {};
