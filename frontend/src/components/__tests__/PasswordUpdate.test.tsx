import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PasswordUpdate from '../PasswordUpdate';
import { useChangePassword } from '../../hooks/useChangePassword';
import { vi, expect, beforeEach, describe, it } from 'vitest';
import '@testing-library/jest-dom';

// Mock the SettingsInput and Loading components
vi.mock('../ui/SettingsInput', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ label, value, onChange, error, type }: any) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        data-testid={label.toLowerCase().replace(/\s+/g, '-')}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

vi.mock('../ui/Loading', () => ({
  default: () => <span>Loading...</span>,
}));

// Mock the custom hook
vi.mock('../../hooks/useChangePassword', () => ({
  useChangePassword: vi.fn(),
}));

describe('PasswordUpdate Component', () => {
  const mockSubmit = vi.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
    vi.mocked(useChangePassword).mockReturnValue({
      submit: mockSubmit,
      loading: false,
      error: '',
      success: false,
    });
  });

  it('renders input fields and button', () => {
    render(<PasswordUpdate />);
    expect(screen.getByLabelText(/Old Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('button is disabled when fields are empty', () => {
    render(<PasswordUpdate />);
    const updateButton = screen.getByRole('button', { name: /update/i });
    expect(updateButton).toBeDisabled();
  });

  it('shows validation errors for empty fields when trying to submit', async () => {
    render(<PasswordUpdate />);
    
    // Fill in some fields to enable the button
    fireEvent.change(screen.getByLabelText(/Old Password/i), { target: { value: 'old' } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'new' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'different' } });

    const updateButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/New password must be at least 6 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    // Submit should not be called due to validation errors
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('button remains disabled when old password is empty', async () => {
    render(<PasswordUpdate />);
    
    // Fill in new password fields but leave old password empty
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'newpass123' } });

    const updateButton = screen.getByRole('button', { name: /update/i });
    
    // Button should remain disabled when old password is empty
    expect(updateButton).toBeDisabled();
    
    // Now fill old password to enable button
    fireEvent.change(screen.getByLabelText(/Old Password/i), { target: { value: 'oldpass' } });
    expect(updateButton).not.toBeDisabled();
    
    // Clear old password again
    fireEvent.change(screen.getByLabelText(/Old Password/i), { target: { value: '' } });
    expect(updateButton).toBeDisabled();
  });

  it('calls submit with valid input', async () => {
    render(<PasswordUpdate />);

    fireEvent.change(screen.getByLabelText(/Old Password/i), { target: { value: 'old1234' } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'newpass123' } });

    const updateButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('old1234', 'newpass123');
    });
  });

  it('shows loading state when submitting', () => {
    vi.mocked(useChangePassword).mockReturnValue({
      submit: mockSubmit,
      loading: true,
      error: '',
      success: false,
    });

    render(<PasswordUpdate />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error from hook', () => {
    const errorMessage = 'Invalid old password';
    vi.mocked(useChangePassword).mockReturnValue({
      submit: mockSubmit,
      loading: false,
      error: errorMessage,
      success: false,
    });

    render(<PasswordUpdate />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('clears validation errors when typing', async () => {
    render(<PasswordUpdate />);
    
    // First trigger validation errors
    fireEvent.change(screen.getByLabelText(/Old Password/i), { target: { value: 'old' } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'new' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'different' } });

    const updateButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/New password must be at least 6 characters/i)).toBeInTheDocument();
    });

    // Now clear the error by typing
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newpass123' } });

    await waitFor(() => {
      expect(screen.queryByText(/New password must be at least 6 characters/i)).not.toBeInTheDocument();
    });
  });
});