import '@testing-library/jest-dom';

// Mock window.matchMedia which is not implemented in JSDOM but used by MUI
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock ResizeObserver
window.ResizeObserver = window.ResizeObserver || function() {
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
};
