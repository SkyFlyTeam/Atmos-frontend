import '@testing-library/jest-dom';
import 'whatwg-fetch'; // so fetch is available in tests

// App Router helpers:
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({ push: jest.fn(), back: jest.fn(), prefetch: jest.fn() }),
    useSearchParams: () => new Map(), // tweak as you like
  };
});

// Pages Router
const pagesRouterMock = {
  push: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => pagesRouterMock,
  __esModule: true,
}));
