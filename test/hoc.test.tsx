import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { render } from '@testing-library/react';
import { FlagsProvider, withFeature } from '../src';

const Tester = withFeature('featured')(() => <h1>It works</h1>);

describe(withFeature, () => {
  describe('array', () => {
    test('exists', () => {
      const { queryByText } = render(
        <FlagsProvider features={['featured']}>
          <Tester />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).toBeInTheDocument();
    });

    test("doesn't exists", () => {
      const { queryByText } = render(
        <FlagsProvider features={[]}>
          <Tester />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).not.toBeInTheDocument();
    });
  });

  describe('object', () => {
    test('exists', () => {
      const { queryByText } = render(
        <FlagsProvider features={{ featured: true }}>
          <Tester />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).toBeInTheDocument();
    });

    test("doesn't exists", () => {
      const { queryByText } = render(
        <FlagsProvider features={{ featured: false }}>
          <Tester />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).not.toBeInTheDocument();
    });
  });
});
