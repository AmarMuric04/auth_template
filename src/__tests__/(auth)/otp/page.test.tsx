import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OTPPage from "@/app/(auth)/otp/page";
import axios from "axios";

jest.mock("@/store/use-auth-store", () => ({
  useAuthStore: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

const mockUseAuthStore = jest.fn();
jest.mock("@/store/use-auth-store", () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("OTPPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects if no email in authData", async () => {
    mockUseAuthStore.mockReturnValue({
      authData: {
        email: "",
        username: "",
        firstName: "",
        lastName: "",
      },
      setAuthData: () => {},
      clearAuthData: () => {},
      setType: () => {},
      type: "signin",
    });
    render(<OTPPage />);
    screen.debug();
    expect(mockReplace).toHaveBeenCalledWith("/signup");
  });

  it("renders form if email exists in authData", () => {
    mockUseAuthStore.mockReturnValue({
      authData: {
        email: "muricamar2004@gmail.com",
        username: "",
        firstName: "",
        lastName: "",
      },
      setAuthData: () => {},
      clearAuthData: () => {},
      setType: () => {},
      type: "signin",
    });
    render(<OTPPage />);
    expect(screen.getByTestId(/otp-form/i)).toBeInTheDocument();
  });

  it("submits valid code and calls axios", async () => {
    mockUseAuthStore.mockReturnValue({
      authData: {
        email: "muricamar2004@gmail.com",
        username: "",
        firstName: "",
        lastName: "",
      },
      setAuthData: () => {},
      clearAuthData: () => {},
      setType: () => {},
      type: "signin",
    });
    render(<OTPPage />);
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/otp/verify_otp",
        expect.any(Object)
      );
    });
  });
});
