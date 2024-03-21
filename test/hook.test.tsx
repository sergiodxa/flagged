import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { FlagsProvider, useFeature } from '../src';

function Tester({ name }: { name: string }) {
  const hasFeature = useFeature(name);
  if (hasFeature) return <h1>It works</h1>;
  return <h1>It doesn't work</h1>;
}

describe(useFeature, () => {
  describe('array', () => {
    test('exists', () => {
      render(
        <FlagsProvider features={['featured']}>
          <Tester name="featured" />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).toBeInTheDocument();
      expect(screen.queryByText(/It doesn't work/i)).not.toBeInTheDocument();
    });

    test("doesn't exists", () => {
      render(
        <FlagsProvider features={['featured']}>
          <Tester name="random" />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/It doesn't work/i)).toBeInTheDocument();
    });
  });

  describe('object', () => {
    test('exists', () => {
      render(
        <FlagsProvider features={{ featured: true }}>
          <Tester name="featured" />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).toBeInTheDocument();
      expect(screen.queryByText(/It doesn't work/i)).not.toBeInTheDocument();
    });

    test("doesn't exists", () => {
      render(
        <FlagsProvider features={{ featured: true }}>
          <Tester name="random" />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/It doesn't work/i)).toBeInTheDocument();
    });
  });

  describe('group', () => {
    test('exists', () => {
      render(
        <FlagsProvider
          features={{ featured: { subFeature: { subSubFeature: true } } }}
        >
          <Tester name="featured/subFeature/subSubFeature" />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).toBeInTheDocument();
      expect(screen.queryByText(/It doesn't work/i)).not.toBeInTheDocument();
    });

    test("doesn't exists", () => {
      render(
        <FlagsProvider
          features={{ featured: { subFeature: { subSubFeature: true } } }}
        >
          <Tester name="super/random/feature" />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/It doesn't work/i)).toBeInTheDocument();
    });
  });
});
