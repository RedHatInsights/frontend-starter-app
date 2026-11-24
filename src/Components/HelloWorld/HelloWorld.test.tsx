import { render, screen } from '@testing-library/react';
import HelloWorld from './HelloWorld';

test('renders the default greeting', () => {
  render(<HelloWorld />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('renders the supplied text', () => {
  render(<HelloWorld text="Hello from the starter app" />);
  expect(screen.getByText('Hello from the starter app')).toBeInTheDocument();
});
