import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import HomePage from "@/app/page";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: true,
  }),
}));

describe("Renders correct UI for Home Page", () => {
  it("renders a heading", () => {
    render(<HomePage />);
  });
});
