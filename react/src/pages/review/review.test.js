import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ReviewMovie from './review';
import { MemoryRouter } from 'react-router-dom';
import { createPost } from '../../data/repo';

// Purpose of this unit test file:
// 1. Test that the ReviewMovie component renders the movie title
// 2. Test that the ReviewMovie component displays error message on empty review

jest.mock('../../data/repo', () => ({
    createPost: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: { movie: { title: 'Inception' } } })
}));

describe('ReviewMovie Component', () => {
    const mockUser = {
        email: 'test@example.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should display the movie title', async () => {
        const { findByText } = render(
            <MemoryRouter>
                <ReviewMovie user={mockUser} />
            </MemoryRouter>
        );
    
        expect(await findByText(/Inception/i)).toBeInTheDocument();
    });

    test('should display error message when trying to submit empty review', async () => {
        render(
            <MemoryRouter>
                <ReviewMovie user={mockUser} />
            </MemoryRouter>
        );
    
        // Ensure the rating is not 0 to bypass the first validation check
        fireEvent.click(screen.getByLabelText('4 Stars'));
        
        // Click Post without entering a review to trigger the empty review validation
        fireEvent.click(await screen.findByRole('button', { name: /Post/i }));
    
        // Wait for the error message to appear
        expect(await screen.findByText("A review cannot be empty.")).toBeInTheDocument();
    });

});
