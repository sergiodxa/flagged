import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { FlagsProvider, withFeature } from "../src";

const Tester = withFeature("featured")(() => <h1>It works</h1>);

describe(withFeature, () => {
	describe("array", () => {
		test("exists", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Tester />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
		});

		test("does not exists", () => {
			render(
				<FlagsProvider features={[]}>
					<Tester />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
		});
	});

	describe("object", () => {
		test("exists", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Tester />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
		});

		test("does not exists", () => {
			render(
				<FlagsProvider features={{ featured: false }}>
					<Tester />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
		});
	});
});
