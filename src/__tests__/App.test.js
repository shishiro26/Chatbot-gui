import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';

jest.mock('axios');

describe('App', () => {
  it('renders initial messages', () => {
    render(<App />);
    expect(screen.getByText('Hello, I am chatgpt')).toBeInTheDocument();
  });

  it('sends a message and receives a response', async () => {
    axios.post.mockResolvedValueOnce({
      data: { response: 'Hello from Gemini' },
    });

    render(<App />);

    const input = screen.getByPlaceholderText('Type Message here');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hello from Gemini')).toBeInTheDocument();
    });
  });

  it('displays error message on failed request', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    const input = screen.getByPlaceholderText('Type Message here');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Error: Could not send message. Please try again later.',
        ),
      ).toBeInTheDocument();
    });
  });
});
