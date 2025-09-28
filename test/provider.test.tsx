import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "bun:test";
import { FlagsProvider, useFeature } from "../src/index.js";

function Tester({ name }: { name: string }) {
	const hasFeature = useFeature(name);
	if (hasFeature) return <h1>It works</h1>;
	return <h1>It does not work</h1>;
}

describe(FlagsProvider, () => {
	describe("nest array with", () => {
		test("object", () => {
			render(
				<FlagsProvider features={["random"]}>
					<FlagsProvider features={{ featured: { subFeature: true } }}>
						<Tester name="random" />
						<Tester name="featured/subFeature" />
					</FlagsProvider>
				</FlagsProvider>,
			);
			expect(screen.queryAllByText(/it works/i)[0]).toBeInTheDocument();
			expect(screen.queryAllByText(/it works/i)[1]).toBeInTheDocument();
		});

		test("array", () => {
			render(
				<FlagsProvider features={["random"]}>
					<FlagsProvider features={["featured"]}>
						<Tester name="random" />
						<Tester name="featured" />
					</FlagsProvider>
				</FlagsProvider>,
			);
			expect(screen.queryAllByText(/it works/i)[0]).toBeInTheDocument();
			expect(screen.queryAllByText(/it works/i)[1]).toBeInTheDocument();
		});

		test("nothing", () => {
			render(
				<FlagsProvider features={["random"]}>
					<FlagsProvider>
						<Tester name="random" />
						<Tester name="featured/subFeature" />
					</FlagsProvider>
				</FlagsProvider>,
			);
			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});
	});

	describe("nest object with", () => {
		test("array", () => {
			render(
				<FlagsProvider features={{ random: true }}>
					<FlagsProvider features={["featured"]}>
						<Tester name="random" />
						<Tester name="featured" />
					</FlagsProvider>
				</FlagsProvider>,
			);
			expect(screen.queryAllByText(/it works/i)[0]).toBeInTheDocument();
			expect(screen.queryAllByText(/it works/i)[1]).toBeInTheDocument();
		});

		test("object", () => {
			render(
				<FlagsProvider features={{ random: false }}>
					<FlagsProvider features={{ featured: { subFeature: true } }}>
						<Tester name="random" />
						<Tester name="featured/subFeature" />
					</FlagsProvider>
				</FlagsProvider>,
			);
			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});

		test("nothing", () => {
			render(
				<FlagsProvider features={{ random: true }}>
					<FlagsProvider>
						<Tester name="random" />
						<Tester name="featured/subFeature" />
					</FlagsProvider>
				</FlagsProvider>,
			);
			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});
	});

	describe("nest nothing with", () => {
		test("array", () => {
			render(
				<FlagsProvider>
					<FlagsProvider features={["featured"]}>
						<Tester name="random" />
						<Tester name="featured" />
					</FlagsProvider>
				</FlagsProvider>,
			);
			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});

		test("object", () => {
			render(
				<FlagsProvider>
					<FlagsProvider features={{ featured: { subFeature: true } }}>
						<Tester name="random" />
						<Tester name="featured/subFeature" />
					</FlagsProvider>
				</FlagsProvider>,
			);
			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});
	});
});
