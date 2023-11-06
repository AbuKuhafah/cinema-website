import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { findUser, createUser } from '../../data/repo';
import SignUp from './signUp';

// Purpose of this unit test file:
// 1. Test that the SignUp component renders the form fields and labels
// 2. Test that the SignUp component updates state when input values change
// 3. Test that the SignUp component displays error messages with invalid input
// 4. Test that the SignUp component displays error message for weak passwords
// 5. Test that the SignUp component registers and navigates on successful input

// Mocking necessary functions
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../data/repo', () => ({
  findUser: jest.fn(),
  createUser: jest.fn(),
}));

describe('SignUp Component', () => {

  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    findUser.mockResolvedValue(null); // Default to no user found
    createUser.mockResolvedValue({}); // Default mock user object
  });

  test('renders form fields and labels', () => {
    render(<SignUp loginUser={jest.fn()} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    const passwordInput = screen.queryByLabelText((content, element) => {
      return content.includes('Password') && !content.includes('Confirm');
    });
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();
  });

  test('updates state when input values change', () => {
    render(<SignUp loginUser={jest.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });

    expect(screen.getByLabelText(/username/i).value).toBe('testuser');
    expect(screen.getByLabelText(/email/i).value).toBe('test@example.com');
  });

  test('displays error messages with invalid input', async () => {
    render(<SignUp loginUser={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required./i)).toBeInTheDocument();
      expect(screen.getByText(/email is required./i)).toBeInTheDocument();
      expect(screen.getByText(/First name is required./i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required./i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required./i)).toBeInTheDocument();
    });
  });

  test('displays error message for weak passwords', async () => {
    render(<SignUp loginUser={jest.fn()} />);
    
    // Provide input for all fields, but with a weak password
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    
    // Setting a weak password (missing uppercase letter and symbol)
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'password123' } });
    
    // Trigger form submission
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
        expect(screen.getByText(/Password must contain at least one uppercase letter and one symbol./i)).toBeInTheDocument();
    });
  });

  test('registers and navigates on successful input', async () => {
    // Mock user not found and successful registration
    findUser.mockResolvedValueOnce(null);
    createUser.mockResolvedValueOnce({ username: 'testuser' });

    render(<SignUp loginUser={jest.fn()} />);

    // Provide valid input for all fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'Password123!' } });

    // Trigger form submission
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    });
});
