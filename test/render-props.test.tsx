import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "bun:test";
import { Feature, FlagsProvider } from "../src/index.js";

describe(Feature, () => {
	describe("array", () => {
		test("children - element - works", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Feature name="featured">
						<h1>It works</h1>
					</Feature>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
		});

		test("children - element - does not works", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Feature name="random">
						<h1>It works</h1>
					</Feature>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
		});

		test("children - function - works", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Feature name="featured">
						{(isFeatured) =>
							isFeatured ? <h1>It works</h1> : <h1>It does not work</h1>
						}
					</Feature>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).not.toBeInTheDocument();
		});

		test("children - function - does not work", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Feature name="random">
						{(isRandom) =>
							isRandom ? <h1>It works</h1> : <h1>It does not work</h1>
						}
					</Feature>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});

		test("render - element", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Feature name="featured" render={<h1>It works</h1>} />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
		});

		test("render - function - works", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Feature
						name="featured"
						render={(isFeatured) =>
							isFeatured ? <h1>It works</h1> : <h1>It does not work</h1>
						}
					/>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).not.toBeInTheDocument();
		});

		test("render - function - does not work", () => {
			render(
				<FlagsProvider features={["featured"]}>
					<Feature
						name="random"
						render={(isRandom) =>
							isRandom ? <h1>It works</h1> : <h1>It does not work</h1>
						}
					/>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});
	});

	describe("object", () => {
		test("children - element", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Feature name="featured">
						<h1>It works</h1>
					</Feature>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
		});

		test("children - function - works", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Feature name="featured">
						{(isFeatured) =>
							isFeatured ? <h1>It works</h1> : <h1>It does not work</h1>
						}
					</Feature>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).not.toBeInTheDocument();
		});

		test("children - function - does not work", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Feature name="random">
						{(isRandom) =>
							isRandom ? <h1>It works</h1> : <h1>It does not work</h1>
						}
					</Feature>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});

		test("render - element", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Feature name="featured" render={<h1>It works</h1>} />
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
		});

		test("render - function - works", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Feature
						name="featured"
						render={(isFeatured) =>
							isFeatured ? <h1>It works</h1> : <h1>It does not work</h1>
						}
					/>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).not.toBeInTheDocument();
		});

		test("render - function - does not work", () => {
			render(
				<FlagsProvider features={{ featured: true }}>
					<Feature
						name="random"
						render={(isRandom) =>
							isRandom ? <h1>It works</h1> : <h1>It does not work</h1>
						}
					/>
				</FlagsProvider>,
			);

			expect(screen.queryByText(/it works/i)).not.toBeInTheDocument();
			expect(screen.queryByText(/it does not work/i)).toBeInTheDocument();
		});
	});
});
