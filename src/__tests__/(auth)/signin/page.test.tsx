import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInForm from "@/app/(auth)/signin/page";
import axios from "axios";

const mockPush = jest.fn();

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { name: "Murga" } },
    status: "authenticated",
  }),
}));

jest.mock("@/store/use-auth-store", () => ({
  useAuthStore: () => ({
    authData: {
      email: "muricamar2004@gmail.com",
      username: "",
      firstName: "",
      lastName: "",
    },
    setAuthData: () => {},
    setType: () => {},
    type: "signin",
  }),
}));

const mockedAxiosPost = axios.post as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

describe("SignInForm", () => {
  beforeEach(() => {
    render(<SignInForm />);
  });

  it("renders the form", () => {
    expect(screen.getByText(/sign into an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(
      await screen.findByText(/please enter a valid email/i)
    ).toBeInTheDocument();
  });

  it("submits valid email and redirects to /otp", async () => {
    mockedAxiosPost.mockResolvedValueOnce({ data: { success: true } });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockedAxiosPost).toHaveBeenCalledWith(
        "/api/otp/send_otp",
        JSON.stringify({ email: "test@example.com", type: "signin" })
      );
      expect(mockPush).toHaveBeenCalledWith("/otp");
    });
  });
});
