import {
  render,
  screen,
  cleanup,
  fireEvent,
  within,
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/user-event";
import Login from ".";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { UIbutton } from "../../common/button";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";


afterEach(() => {
  cleanup();
});

describe("Login Component", () => {
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: function () {},
          removeListener: function () {},
        };
      };
  });
  test("button available", async () => {
    render(<Provider store={store}> <Login /> </Provider>)
    const UIbutton = screen.getByRole("button");
    expect(UIbutton).toBeInTheDocument();
    expect(UIbutton).toHaveTextContent('SIGN IN');
  });
  test("input username available", async () => {
    render(<Provider store={store}> <Login /> </Provider>)
    const UIInputPassword = screen.getByLabelText("Username");
    expect(UIInputPassword).toBeInTheDocument();
})
  test("input password available", async () => {
    render(<Provider store={store}> <Login /> </Provider>)
      const UIInputPassword = screen.getByLabelText("Password");
      expect(UIInputPassword).toBeInTheDocument();
  })
  test("heading available", async () => {
    render(<Provider store={store}> <Login /> </Provider>)
      const text = screen.getByTestId("text");
      expect(text).toHaveTextContent('Sign in to the portal');
  })
  test("logo available", async () => {
    render(<Provider store={store}> <Login /> </Provider>)
      const img = screen.getByTestId("mainLogo");
      expect(img).toBeInTheDocument();
  })
  test("env tag image available", async () => {
    render(<Provider store={store}> <Login /> </Provider>)
      const img = screen.getByTestId("envTag");
      expect(img).toBeInTheDocument();
  })
  test("checkbox available", async () => {
    render(<Provider store={store}> <Login /> </Provider>)
    const Checkbox = screen.getByRole("checkbox");
    expect(Checkbox).toBeInTheDocument();
    userEvent.click(screen.getByText('Remember me'))
    expect(Checkbox).toBeChecked();
  });
  test("forgot password button available and forgot modal elements", async () => {
    render(<Provider store={store}> <Login /> </Provider>)
      const anchortag = screen.getByTestId("forgotPassword");
      expect(anchortag).toBeInTheDocument();
      fireEvent.click(anchortag);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
      const UIbutton = within(modal).getByText("SUBMIT");
      expect(UIbutton).toBeInTheDocument();
      const button = within(modal).getByText("CANCEL");
      expect(button).toBeInTheDocument();
      const UIresetButton = within(modal).getByText("RESET");
      expect(UIresetButton).toBeInTheDocument();
      const input = within(modal).getByLabelText("Email");
      expect(input).toBeInTheDocument();
  })
});

