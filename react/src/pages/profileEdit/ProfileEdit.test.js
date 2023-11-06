import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileEdit from './ProfileEdit';
import { getByEmail, updateUser } from '../../data/repo';

// Purpose of this unit test file:
// 1. Test that the ProfileEdit component fetches and sets user data on mount
// 2. Test that the ProfileEdit component updates state on input change
// 3. Test that the ProfileEdit component displays validation errors
// 4. Test that the ProfileEdit component handles form submission
// 5. Test that the ProfileEdit component navigates to profile page on successful update

// Mock the necessary functions from repo.js
jest.mock('../../data/repo', () => ({
  getByEmail: jest.fn(),
  updateUser: jest.fn()
}));

describe('ProfileEdit', () => {

    test('renders without crashing', () => {
        render(<MemoryRouter><ProfileEdit /></MemoryRouter>);
    });

    test('fetches and sets user data on mount', async () => {
        const mockUser = { email: 'test@test.com', username: 'testUser', first_name: 'John', last_name: 'Doe' };
        getByEmail.mockResolvedValueOnce(mockUser);
        render(<MemoryRouter><ProfileEdit /></MemoryRouter>);
        await waitFor(() => expect(getByEmail).toHaveBeenCalled());
        // Use waitFor to ensure the component has re-rendered with the new state before checking for values
        await waitFor(() => {
            expect(screen.getByDisplayValue('testUser')).toBeInTheDocument();
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
        });
    });

    test('updates state on input change', async () => {
        getByEmail.mockResolvedValue({
        email: 'test@test.com',
        username: 'testUser',
        first_name: 'John',
        last_name: 'Doe'
        });
    
        render(<MemoryRouter><ProfileEdit /></MemoryRouter>);
        // Wait for the component's main content to render
        await waitFor(() => screen.getByText('Edit User'));
        // Use findByRole to wait for the element to appear in the DOM
        const usernameInput = await screen.findByRole('textbox', { name: /username/i });
        fireEvent.change(usernameInput, { target: { value: 'newUsername' } });
        expect(usernameInput.value).toBe('newUsername');
    });

    test('displays validation errors', async () => {
        getByEmail.mockResolvedValue({
        email: 'test@test.com',
        username: 'testUser',
        first_name: 'John',
        last_name: 'Doe'
        });
    
        const { container } = render(<MemoryRouter><ProfileEdit /></MemoryRouter>);
        // Wait for the component's main content to render
        await waitFor(() => screen.getByText('Edit User'));
        // Use findByRole to wait for the input element to appear in the DOM
        const usernameInput = await screen.findByRole('textbox', { name: /username/i });
        fireEvent.change(usernameInput, { target: { value: 'a'.repeat(33) } });  // more than 32 characters
        // Use container.querySelector to directly get the form element
        const form = container.querySelector('form');
        fireEvent.submit(form);
        await waitFor(() => expect(screen.getByText(/Username length cannot be greater than 32./i)).toBeInTheDocument());
    });
  

    test('handles form submission', async () => {
        const mockUser = { email: 'test@test.com', username: 'testUser', first_name: 'John', last_name: 'Doe' };
        getByEmail.mockResolvedValueOnce(mockUser);
        const { container } = render(<MemoryRouter><ProfileEdit /></MemoryRouter>);
        // Wait for the component's main content to render
        await waitFor(() => screen.getByText('Edit User'));
        // Use container.querySelector to directly get the form element
        const form = container.querySelector('form');
        fireEvent.submit(form);
        await waitFor(() => expect(updateUser).toHaveBeenCalled());
    });
  
});
