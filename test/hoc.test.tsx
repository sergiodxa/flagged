import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Feature, FlagsProvider, withFeature } from '../src';

const Tester = withFeature('featured')(() => <h1>It works</h1>);
const Default = () => <h1>It works</h1>;

describe(withFeature, () => {
  describe('array', () => {
    test('exists', () => {
      render(
        <FlagsProvider features={['featured']}>
          <Tester />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).toBeInTheDocument();
    });

    test("doesn't exists", () => {
      render(
        <FlagsProvider features={[]}>
          <Tester />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).not.toBeInTheDocument();
    });
  });

  describe('object', () => {
    test('exists', () => {
      render(
        <FlagsProvider features={{ featured: true }}>
          <Tester />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).toBeInTheDocument();
    });

    test("doesn't exists", () => {
      render(
        <FlagsProvider features={{ featured: false }}>
          <Tester />
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).not.toBeInTheDocument();
    });
  });

  describe('fallback', () => {
    test('exists', () => {
      render(
        <FlagsProvider features={{ featured: false }}>
          <Feature name="featured" render={<React.Fragment/>} renderFallback={<Default/>}/>
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).toBeInTheDocument();
    });

    test("doesn't exists", () => {
      render(
        <FlagsProvider features={{ featured: true }}>
          <Feature name="featured" render={<React.Fragment/>} renderFallback={<Default/>}/>
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).not.toBeInTheDocument();
    });
  });
});
