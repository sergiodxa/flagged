import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { FlagsProvider, useFeature } from "../src";

function Tester({ name }: { name: string }) {
	const hasFeature = useFeature(name);
	if (hasFeature) return <h1>It works</h1>;
	return <h1>It does not work</h1>;
}

describe(useFeature, () => {
	describe("array", () => {
		test("exists", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Tester name="featured" />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).not.toBeInTheDocument();
		});

		test("does not exists", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Tester name="random" />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});
	});

	describe("object", () => {
		test("exists", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Tester name="featured" />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).not.toBeInTheDocument();
		});

		test("does not exists", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Tester name="random" />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});
	});

	describe("group", () => {
		test("exists", () => {
			render(
				<FlagsProvider
					features={{ featured: { subFeature: { subSubFeature: true } } }}
				>
					<Tester name="featured/subFeature/subSubFeature" />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).not.toBeInTheDocument();
		});

		test("does not exists", () => {
			render(
				<FlagsProvider
					features={{ featured: { subFeature: { subSubFeature: true } } }}
				>
					<Tester name="super/random/feature" />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		test("undefined feature with console warning", () => {
			const originalConsole = console.warn;
			const warnings: string[] = [];
			console.warn = (message: string) => warnings.push(message);

			render(
				<FlagsProvider features={{ v3: true, moderate: false }}>
					<Tester name="v2" />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
			expect(warnings).toContain("Feature flag 'v2' is not defined. Defaulting to false.");

			console.warn = originalConsole;
		});
	});
});
