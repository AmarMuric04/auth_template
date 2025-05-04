import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignupPage from "@/app/(auth)/signup/page";

const mockPush = jest.fn();

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

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock("axios", () => ({
  post: jest.fn((url: string) => {
    if (url === "/api/signup") {
      return Promise.resolve({ data: { success: true } });
    }

    if (url === "/api/otp/send_otp") {
      return Promise.resolve({ data: {} });
    }

    return Promise.reject(new Error("Unexpected URL"));
  }),
}));

import { toast } from "sonner";
import axios from "axios";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Signup Page", () => {
  it("renders without crashing", () => {
    render(<SignupPage />);
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });

  describe("Form UI elements", () => {
    beforeEach(() => {
      render(<SignupPage />);
    });

    it("renders all input fields and headings", () => {
      expect(screen.getByText(/create an account/i)).toBeInTheDocument();
      expect(screen.getByText(/please fill out the form/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form validation", () => {
    beforeEach(() => {
      render(<SignupPage />);
    });

    it("shows error message when submitting invalid input", async () => {
      const form = screen.getByTestId("signup-form");
      fireEvent.submit(form);

      const usernameError = await screen.findByText(
        /username must be at least 2 characters/i
      );
      let emailError = await screen.findByText(/please enter a valid email./i);
      const firstNameError = await screen.findByText(
        /first name is required./i
      );
      const lastNameError = await screen.findByText(/last name is required./i);

      expect(usernameError).toBeInTheDocument();
      expect(emailError).toBeInTheDocument();
      expect(firstNameError).toBeInTheDocument();
      expect(lastNameError).toBeInTheDocument();
      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      emailError = await screen.findByText(/please enter a valid email./i);

      expect(emailError).toBeInTheDocument();
    });

    it("correctly performs signup and sends an email to the user on valid input", async () => {
      const form = screen.getByTestId("signup-form");
      const usernameInput = screen.getByLabelText(/username/i);
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, {
        target: { value: "muricamar2004@gmail.com" },
      });
      fireEvent.change(usernameInput, { target: { value: "murgaman" } });
      fireEvent.change(firstNameInput, { target: { value: "Amar" } });
      fireEvent.change(lastNameInput, { target: { value: "Muric" } });

      fireEvent.submit(form);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(2);
        expect(toast.success).toHaveBeenCalledWith(
          "We sent a code to your email"
        );
        expect(mockPush).toHaveBeenCalledWith("/otp");
      });
    });
  });
});
