// [MODIFIED]
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CTAForm from '@/components/CTAForm';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

// Mock useGoogleReCaptcha
jest.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: jest.fn().mockResolvedValue('mock-recaptcha-token'),
  }),
}));

// Mock global.fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('CTAForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('вызывает fetch с правильными данными, включая токен reCAPTCHA', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true, id: 'mock-id' }),
    });

    render(<CTAForm preset="default" />);
    const emailInput = screen.getByLabelText(/Email/i);
    const consentCheckbox = screen.getByLabelText(/я согласен/i);
    const submitButton = screen.getByRole('button', { name: /Запросить демо/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(consentCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(fetchBody.email).toBe('test@example.com');
      expect(fetchBody.recaptchaToken).toBe('mock-recaptcha-token');
    });

    expect(toast.success).toHaveBeenCalledWith('Спасибо! Мы скоро свяжемся с вами.', expect.any(Object));
  });

  it('показывает ошибку, если reCAPTCHA не загрузилась', async () => {
    jest.requireMock('react-google-recaptcha-v3').useGoogleReCaptcha.mockReturnValueOnce({
      executeRecaptcha: undefined,
    });
    
    const user = userEvent.setup();
    render(<CTAForm />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const consentCheckbox = screen.getByLabelText(/я согласен/i);
    const submitButton = screen.getByRole('button', { name: /Запросить демо/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(consentCheckbox);
    await user.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("reCAPTCHA не загрузилась. Попробуйте обновить страницу.");
    expect(mockFetch).not.toHaveBeenCalled();
  });
});