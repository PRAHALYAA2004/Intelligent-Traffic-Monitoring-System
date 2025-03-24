import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Create a mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body><form id="loginForm"><input id="username" value="testuser"><input id="password" value="testpass"></form></body></html>', {
  url: 'http://localhost',
});

// Assign the mock DOM to global objects
global.document = dom.window.document;
global.window = dom.window;

// Import the login function after setting up the DOM
const { login } = require('../js/login.js'); // Adjust the path as needed

// Mock fetch globally
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, redirectUrl: '/dashboard' }),
  })
);

describe('login function', () => {
  beforeEach(() => {
    // Reset mocks and DOM before each test
    global.fetch.mockClear();
    global.alert = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should redirect to dashboard on successful login', async () => {
    // Trigger the form submission
    document.getElementById('loginForm').dispatchEvent(new dom.window.Event('submit'));

    // Wait for the async code to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assertions
    expect(fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
    });

    expect(window.location.href).toBe('/dashboard');
  });

  it('should show an alert on login failure', async () => {
    // Mock a failed login response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: 'Invalid credentials' }),
      })
    );

    // Trigger the form submission
    document.getElementById('loginForm').dispatchEvent(new dom.window.Event('submit'));

    // Wait for the async code to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assertions
    expect(fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
    });

    expect(alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should handle network errors', async () => {
    // Mock a network error
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    // Trigger the form submission
    document.getElementById('loginForm').dispatchEvent(new dom.window.Event('submit'));

    // Wait for the async code to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assertions
    expect(fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
    });

    expect(console.error).toHaveBeenCalledWith('Login error:', expect.any(Error));
    expect(alert).toHaveBeenCalledWith('An error occurred. Please try again.');
  });
});