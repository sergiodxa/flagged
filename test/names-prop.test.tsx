import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { FlagsProvider, Feature } from '../src';

describe(Feature, () => {
  describe('array', () => {
    test('names - prop - works', () => {
      render(
        <FlagsProvider features={['featured','v2']}>
          <Feature names={['featured','v2']}>
            <h1>It works</h1>
          </Feature>
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).toBeInTheDocument();
    });

    test("names - prop - doesn't work", () => {
      render(
        <FlagsProvider features={['featured','v2']}>
          <Feature names={['featured','random']}>
            <h1>It works</h1>
          </Feature>
        </FlagsProvider>
      );

      expect(screen.queryByText(/It works/i)).not.toBeInTheDocument();
    });
  });
});
