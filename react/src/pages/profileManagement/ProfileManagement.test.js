import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ProfileManagement from './ProfileManagement';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { deleteUser, getAllReviewsByEmail } from '../../data/repo';

// Purpose of this unit test file:
// 1. Test that the ProfileManagement component displays the user's details
// 2. Test that the ProfileManagement component opens the delete dialog when delete icon is clicked
// 3. Test that the ProfileManagement component calls deleteUser and logoutUser when confirm is clicked

jest.mock('../../data/repo', () => ({
    deleteUser: jest.fn(),
    getAllReviewsByEmail: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

describe('ProfileManagement Component', () => {
    const mockLogoutUser = jest.fn();
    const mockUser = {
        username: 'testUser',
        email: 'test@example.com',
        joined_in: '2023-10-01T12:00:00'
    };

    const mockReviews = {
        1: { post_id: 1, email: 'test@example.com', title: 'Test Review', review: 'Good', rating: 4 }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getAllReviewsByEmail.mockResolvedValue(mockReviews);
    });

    test('should display the user\'s details', async () => {
        const { findByText } = render(
            <MemoryRouter>
                <ProfileManagement user={mockUser} logoutUser={mockLogoutUser} />
            </MemoryRouter>
        );
    
        const usernameElement = await findByText(/testUser/i);
        const emailElement = await findByText(/test@example.com/i);
        const dateElement = await findByText(/2023-10-01/i);
    
        expect(usernameElement).toBeInTheDocument();
        expect(emailElement).toBeInTheDocument();
        expect(dateElement).toBeInTheDocument();
    });

    test('should open the delete dialog when delete icon is clicked', async () => {
        render(
            <MemoryRouter>
                <ProfileManagement user={mockUser} logoutUser={mockLogoutUser} />
            </MemoryRouter>
        );
    
        const deleteIcon = await screen.findByAltText('delete-icon');
        fireEvent.click(deleteIcon);
    
        await waitFor(() => {
            expect(screen.getByText('Delete Account')).toBeInTheDocument();
        });
    });

    test('should call deleteUser and logoutUser when confirm is clicked', async () => {
        render(
            <MemoryRouter>
                <ProfileManagement user={mockUser} logoutUser={mockLogoutUser} />
            </MemoryRouter>
        );
    
        // Use screen.debug() to print out the current DOM state
        screen.debug();
    
        // Use async/await with findByAltText to handle potential async rendering
        const deleteIcon = await screen.findByAltText('delete-icon');
        fireEvent.click(deleteIcon);
    
        // Ensure the dialog is open before interacting with it
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
    
        // Click confirm and check if deleteUser and logoutUser have been called
        fireEvent.click(screen.getByText('Confirm'));
        
        await waitFor(() => {
            expect(deleteUser).toHaveBeenCalledWith(mockUser.email);
            expect(mockLogoutUser).toHaveBeenCalled();
        });
    });
});
