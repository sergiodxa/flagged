import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { render } from '@testing-library/react';
import { FlagsProvider, useFeature, FeatureFlags } from '../src';

function Tester({ name }: { name: string }) {
  const hasFeature = useFeature(name);
  if (hasFeature) return <h1>It works</h1>;
  return <h1>It doesn't work</h1>;
}

describe(useFeature, () => {
  describe('array', () => {
    test('exists', () => {
      const { queryByText } = render(
        <FlagsProvider features={['featured']}>
          <Tester name="featured" />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).toBeInTheDocument();
      expect(queryByText(/It doesn't work/i)).not.toBeInTheDocument();
    });

    test("doesn't exists", () => {
      const { queryByText } = render(
        <FlagsProvider features={['featured']}>
          <Tester name="random" />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).not.toBeInTheDocument();
      expect(queryByText(/It doesn't work/i)).toBeInTheDocument();
    });
  });

  describe('object', () => {
    test('exists', () => {
      const { queryByText } = render(
        <FlagsProvider features={{ featured: true }}>
          <Tester name="featured" />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).toBeInTheDocument();
      expect(queryByText(/It doesn't work/i)).not.toBeInTheDocument();
    });

    test("doesn't exists", () => {
      const { queryByText } = render(
        <FlagsProvider features={{ featured: true }}>
          <Tester name="random" />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).not.toBeInTheDocument();
      expect(queryByText(/It doesn't work/i)).toBeInTheDocument();
    });
  });

  describe('group', () => {
    test('exists', () => {
      const { queryByText } = render(
        <FlagsProvider
          features={{ featured: { subFeature: { subSubFeature: true } } }}
        >
          <Tester name="featured/subFeature/subSubFeature" />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).toBeInTheDocument();
      expect(queryByText(/It doesn't work/i)).not.toBeInTheDocument();
    });

    test("doesn't exists", () => {
      const { queryByText } = render(
        <FlagsProvider
          features={{ featured: { subFeature: { subSubFeature: true } } }}
        >
          <Tester name="super/random/feature" />
        </FlagsProvider>
      );

      expect(queryByText(/It works/i)).not.toBeInTheDocument();
      expect(queryByText(/It doesn't work/i)).toBeInTheDocument();
    });
  });

  describe('errors', () => {
    test('Missing Provider', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        render(<Tester name="random" />);
      }).toThrowError(/You must wrap your components in a FlagsProvider/);
      spy.mockReset();
    });

    test('Invalid features - null', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        render(
          <FlagsProvider features={(null as unknown) as FeatureFlags}>
            <Tester name="random" />
          </FlagsProvider>
        );
      }).toThrowError(/The features prop must be an object or an array/);
      spy.mockReset();
    });

    test('Invalid features - undefined', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        render(
          <FlagsProvider features={(undefined as unknown) as FeatureFlags}>
            <Tester name="random" />
          </FlagsProvider>
        );
      }).toThrowError(/The features prop must be an object or an array/);
      spy.mockReset();
    });

    test('Invalid features - string', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        render(
          <FlagsProvider features={('throw' as unknown) as FeatureFlags}>
            <Tester name="random" />
          </FlagsProvider>
        );
      }).toThrowError(/The features prop must be an object or an array/);
      spy.mockReset();
    });

    test('Invalid features - number', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        render(
          <FlagsProvider features={(123 as unknown) as FeatureFlags}>
            <Tester name="random" />
          </FlagsProvider>
        );
      }).toThrowError(/The features prop must be an object or an array/);
      spy.mockReset();
    });

    test('Invalid features - symbol', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        render(
          <FlagsProvider features={(Symbol() as unknown) as FeatureFlags}>
            <Tester name="random" />
          </FlagsProvider>
        );
      }).toThrowError(/The features prop must be an object or an array/);
      spy.mockReset();
    });

    test('Invalid features - function', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        render(
          <FlagsProvider features={((() => {}) as unknown) as FeatureFlags}>
            <Tester name="random" />
          </FlagsProvider>
        );
      }).toThrowError(/The features prop must be an object or an array/);
      spy.mockReset();
    });
  });
});
