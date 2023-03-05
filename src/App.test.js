import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('renders App component', () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    const title = getByText('Image Bek AI');
    const promptInput = getByPlaceholderText(
      'Visualize an extraordinary scene...'
    );
    const generateButton = getByText('Generate');
    expect(title).toBeInTheDocument();
    expect(promptInput).toBeInTheDocument();
    expect(generateButton).toBeInTheDocument();
  });

  test('disables generate button when prompt is empty', () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    const promptInput = getByPlaceholderText(
      'Visualize an extraordinary scene...'
    );
    const generateButton = getByText('Generate');
    fireEvent.change(promptInput, { target: { value: '' } });
    expect(generateButton).toBeDisabled();
  });

  test('displays list of generated images after generating', async () => {
    const mockResponse = {
      status: 200,
      data: {
        data: [
          {
            url: 'https://example.com/image.jpg',
          },
        ],
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    const { getByText, queryAllByText, getByPlaceholderText } = render(<App />);
    const promptInput = getByPlaceholderText(
      'Visualize an extraordinary scene...'
    );
    const generateButton = getByText('Generate');
    fireEvent.change(promptInput, { target: { value: 'test prompt' } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    // Wait for the "List of Images:" text to be rendered
    await waitFor(() => {
      expect(queryAllByText(/List of Images:/i)).toBeTruthy();
    });

    expect(queryAllByText(/test prompt/i)).toBeTruthy();
    expect(localStorage.getItem('generatedImages')).not.toBeNull();
  });
});
