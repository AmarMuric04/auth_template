import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OTPForm from "@/features/otp/form";
import axios from "axios";
import { useAuthStore as originalUseAuthStore } from "@/store/use-auth-store";

jest.mock("@/store/use-auth-store", () => ({
  useAuthStore: jest.fn(),
}));

import { useAuthStore } from "@/store/use-auth-store";

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof originalUseAuthStore
>;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock("@/store/use-auth-store", () => ({
  useAuthStore: jest.fn(),
}));

describe("OTPForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects if no email in authData", () => {
    mockedUseAuthStore.mockReturnValue({
      authData: {},
      type: "signup",
      clearAuthData: jest.fn(),
    });

    render(<OTPForm />);
    expect(screen.getByRole("status")).toBeInTheDocument(); // the spinner
  });

  it("renders form if email exists in authData", () => {
    mockedUseAuthStore.mockReturnValue({
      authData: { email: "test@example.com" },
      type: "signup",
      clearAuthData: jest.fn(),
    });

    render(<OTPForm />);
    expect(screen.getByText(/enter the code/i)).toBeInTheDocument();
  });

  it("submits valid code and calls axios", async () => {
    const mockClear = jest.fn();
    mockedUseAuthStore.mockReturnValue({
      authData: { email: "test@example.com" },
      type: "signup",
      clearAuthData: mockClear,
    });

    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    render(<OTPForm />);
    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < inputs.length; i++) {
      fireEvent.change(inputs[i], { target: { value: String(i) } });
    }

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/otp/verify_otp",
        expect.any(Object)
      );
    });
    expect(mockClear).toHaveBeenCalled();
  });
});
