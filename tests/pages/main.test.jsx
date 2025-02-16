import React from 'react';
import { render, screen } from '@testing-library/react';
import Main from '../../src/main';

describe('Main Page', () => {
  test('renders main component', () => {
    render(<Main />);
    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  test('renders a specific element', () => {
    render(<Main />);
    expect(screen.getByTestId('specific-element')).toBeInTheDocument();
  });

  // Add more tests as needed
});
