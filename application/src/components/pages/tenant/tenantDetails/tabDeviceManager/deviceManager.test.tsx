import { render, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../../../../redux/store";
import { DeviceManager } from ".";
import { BrowserRouter } from "react-router-dom";

afterEach(() => {
  cleanup();
});
describe("device manager table", () => {
  test("table available", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <DeviceManager />
        </Provider>
      </BrowserRouter>
    );
    const table = document.getElementsByTagName("table")[0];
    expect(table).toBeInTheDocument();
    const text1 = within(table).getByText("NAME");
    expect(text1).toBeInTheDocument();
    const text2 = within(table).getByText("URL");
    expect(text2).toBeInTheDocument();
    const text3 = within(table).getByText("CREATE DATE");
    expect(text3).toBeInTheDocument();
    const text4 = within(table).getByText("LAST ACTIVATE DATE");
    expect(text4).toBeInTheDocument();
    const text5 = within(table).getByText("DESCRIPTION");
    expect(text5).toBeInTheDocument();
    const text6 = within(table).getByText("ACTIVE SESSIONS");
    expect(text6).toBeInTheDocument();
  });
});
