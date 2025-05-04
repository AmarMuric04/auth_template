import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInForm from "@/app/(auth)/signin/page";
import axios from "axios";

const mockPush = jest.fn();
const mockSetAuthData = jest.fn();
const mockSetType = jest.fn();

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
jest.mock("@/store/use-auth-store", () => ({
  useAuthStore: jest.fn(),
}));

import { useAuthStore } from "@/store/use-auth-store";

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockedAxiosPost = axios.post as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

describe("SignInForm", () => {
  beforeEach(() => {
    mockedUseAuthStore.mockReturnValue({
      authData: {},
      setAuthData: mockSetAuthData,
      setType: mockSetType,
      type: "signin",
    });
  });

  it("renders the form", () => {
    render(<SignInForm />);
    expect(screen.getByText(/sign into an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    render(<SignInForm />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(
      await screen.findByText(/please enter a valid email/i)
    ).toBeInTheDocument();
  });

  it("submits valid email and redirects to /otp", async () => {
    mockedAxiosPost.mockResolvedValueOnce({ data: { success: true } });

    render(<SignInForm />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockedAxiosPost).toHaveBeenCalledWith(
        "/api/otp/send_otp",
        JSON.stringify({ email: "test@example.com", type: "signin" })
      );
      expect(mockSetAuthData).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockPush).toHaveBeenCalledWith("/otp");
    });
  });
});
