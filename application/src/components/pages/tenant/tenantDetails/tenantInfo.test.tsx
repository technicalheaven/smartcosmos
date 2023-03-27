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
import userEvent from "@testing-library/user-event";
import "@testing-library/user-event";
import { TenantDetail } from ".";
import { Provider } from "react-redux";
import { store } from "../../../../redux/store";

afterEach(() => {
  cleanup();
});

describe("tenant info Component", () => {
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
  test("tenant tabs screen", () => {
    render(
      <Provider store={store}>
        <TenantDetail />
      </Provider>
    );
    const tabs = screen.getByText("Users");
    expect(tabs).toBeInTheDocument();
    const tabs1 = screen.getByText("Devices");
    expect(tabs1).toBeInTheDocument();
    const tabs2 = screen.getByText("Features");
    expect(tabs2).toBeInTheDocument();
    const tabs3 = screen.getByText("Sites");
    expect(tabs3).toBeInTheDocument();
    const tabs4 = screen.getByText("Zones");
    expect(tabs4).toBeInTheDocument();
  });

  test("contain table", () => {
    render(
      <Provider store={store}>
        <TenantDetail />
      </Provider>
    );
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    const text = within(table).getByText("USERNAME")
    expect(text).toBeInTheDocument()
    const addUserBtn = screen.getByText("ADD USER");
    expect(addUserBtn).toBeInTheDocument();
    fireEvent.click(addUserBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
    const image = within(modal).getByRole("img");
    expect(image).toBeInTheDocument();
    const inputName = within(modal).getByPlaceholderText("name");
    expect(inputName).toBeInTheDocument();
    const inputBox = within(modal).getByLabelText("Email");
    expect(inputBox).toBeInTheDocument();
    const inputUsername = within(modal).getByLabelText("Username");
    expect(inputUsername).toBeInTheDocument();
    const selectRole = within(modal).getByLabelText("Role");
    expect(inputUsername).toBeInTheDocument();
    const selectSite = within(modal).getByLabelText("Sites");
    expect(inputUsername).toBeInTheDocument();
    const buttonSave = within(modal).getByText("SAVE");
    expect(buttonSave).toBeInTheDocument();
    const buttonCancel = within(modal).getByText("CANCEL");
    expect(buttonCancel).toBeInTheDocument();
  });

  test("different tabs present", ()=>{
    render(
        <Provider store={store}>
          <TenantDetail />
        </Provider>
      );
    const tab = screen.getByRole("tab", { name: 'Devices' })
    expect(tab).toHaveTextContent("Devices");
    const tab2 = screen.getByRole("tab", { name: 'Sites' })
    expect(tab2).toHaveTextContent("Sites");
    const tab3 = screen.getByRole("tab", { name: 'Zones' })
    expect(tab3).toHaveTextContent("Zones");
    const tab4 = screen.getByRole("tab", { name: 'Device Manager' })
    expect(tab4).toHaveTextContent("Device Manager");
    const tab5 = screen.getByRole("tab", { name: 'Features' })
    expect(tab5).toHaveTextContent("Features");
  })
});
