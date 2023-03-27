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
import Tenants from ".";
import { Provider } from "react-redux";
import { store } from "../../../../redux/store";
import { BrowserRouter } from "react-router-dom";

  afterEach(() => {
    cleanup();
  });
  
  describe("Tenant Component", () => {
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
    test("home image is present", () => {
        render(<BrowserRouter><Provider store={store}> <Tenants /> </Provider></BrowserRouter>)
        const image = screen.getByAltText("icon");
        expect(image).toBeInTheDocument();
    })
    test("to have heading Tenants", () => {
      render(<BrowserRouter><Provider store={store}> <Tenants /> </Provider></BrowserRouter>)
      const heading = screen.getByText("Tenants");
      expect(heading).toBeInTheDocument();
    })
    test("to have search button", () => {
              render(<BrowserRouter><Provider store={store}> <Tenants /> </Provider></BrowserRouter>)
      const search = screen.getByAltText("searchBar");
      expect(search).toBeInTheDocument();
    })
    test("to have add tenant button and add tenant modal", () => {
              render(<BrowserRouter><Provider store={store}> <Tenants /> </Provider></BrowserRouter>)
      const addtenant = screen.getByText("ADD TENANT");
      expect(addtenant).toBeInTheDocument();
      userEvent.click(addtenant);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
      const image = within(modal).getByRole("img");
      expect(image).toBeInTheDocument();
      const inputName = within(modal).getByText("Name");
      expect(inputName).toBeInTheDocument();
      const inputBox = within(modal).getByLabelText("Description");
      expect(inputBox).toBeInTheDocument();
      const buttonSave = within(modal).getByText("SAVE");
      expect(buttonSave).toBeInTheDocument();
      const buttonCancel = within(modal).getByText("CANCEL");
      expect(buttonCancel).toBeInTheDocument();
    })
    test("tenant table list view", () => {
              render(<BrowserRouter><Provider store={store}> <Tenants /> </Provider></BrowserRouter>)
      const table = document.getElementsByTagName("table")[0];
      expect(table).toBeInTheDocument();
      const column = screen.getByText("Name");
      expect(column).toBeInTheDocument();
    })
});