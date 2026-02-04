/**
 * Jest Test Setup for Dashboard
 * Configures test environment, mocks, and global utilities
 */

import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS = 'price_1SwtCbBfSldKMuDjM3p0kyG4';
process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO = 'price_1SwtCbBfSldKMuDjDmRHqErh';
process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM = 'price_1SwtCcBfSldKMuDjEKBqQ6lH';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockReset();
});

// Global test utilities
declare global {
  var testUtils: {
    mockSuccessfulFetch: (data: any) => void;
    mockFailedFetch: (status: number, message: string) => void;
    createMockRequest: (options?: Partial<Request>) => Request;
  };
}

global.testUtils = {
  mockSuccessfulFetch: (data: any) => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    });
  },

  mockFailedFetch: (status: number, message: string) => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status,
      json: () => Promise.resolve({ error: message }),
      text: () => Promise.resolve(message),
    });
  },

  createMockRequest: (options?: Partial<Request>): Request => {
    return {
      method: 'GET',
      url: 'http://localhost:3000/test',
      headers: new Headers(),
      ip: '127.0.0.1',
      ...options,
    } as unknown as Request;
  },
};
