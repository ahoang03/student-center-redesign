import { render, screen } from '@testing-library/react';
import App from './App';

test('renders student center welcome heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/welcome back, francisco/i);
  expect(headingElement).toBeInTheDocument();
});
