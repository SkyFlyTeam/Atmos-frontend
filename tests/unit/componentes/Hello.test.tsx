import { render, screen } from '@testing-library/react';
import React from 'react';

function Hello({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

test('renders greeting', () => {
  render(<Hello name="Next" />);
  expect(screen.getByText('Hello, Next')).toBeInTheDocument();
});
