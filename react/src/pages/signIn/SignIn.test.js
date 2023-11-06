import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../../data/repo';
import SignIn from './SignIn';

// Purpose of this unit test file:
// 1. Test that the SignIn component renders the form fields and labels
// 2. Test that the SignIn component updates state when input values change
// 3. Test that the SignIn component displays error message on failed login
// 4. Test that the SignIn component navigates to home on successful login

// Mocking necessary functions
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../data/repo', () => ({
  verifyUser: jest.fn(),
}));

describe('SignIn Component', () => {

  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders form fields and labels', () => {
    render(<SignIn />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('updates state when input values change', () => {
    render(<SignIn />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/email/i).value).toBe('test@example.com');
    expect(screen.getByLabelText(/password/i).value).toBe('password123');
  });

  test('displays error message on failed login', async () => {
    verifyUser.mockRejectedValueOnce(new Error()); // Mocking a failed login attempt
  
    render(<SignIn />);
  
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
    await waitFor(() => {
      // Expecting any error message to be in the document
      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    });
  });
  
  test('navigates to home on successful login', async () => {
    const mockUser = { email: 'test@example.com' };
    verifyUser.mockResolvedValueOnce(mockUser); // Mock successful login

    render(<SignIn change={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

});
