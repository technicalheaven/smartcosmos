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
  import { Provider } from "react-redux";
  import { store } from "../../../../../redux/store";
import { SiteList } from ".";
  
  afterEach(() => {
    cleanup();
  });
  
  describe("site list", () => {
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
    test('site screen contain a table', ()=>{
        render(
        <Provider store={store}>
             <SiteList />
         </Provider>
        )
        const table = document.getElementsByTagName('table')[0]
        expect(table).toBeInTheDocument()
    });

     test('site screen contain a table', ()=>{
        render(
        <Provider store={store}>
             <SiteList />
         </Provider>
        )

        const column1 = screen.getByText("SITE");
        expect(column1).toBeInTheDocument();
        const column2 = screen.getByText("SITE IDENTIFIER");
        expect(column2).toBeInTheDocument();
        const column3 = screen.getByText("NO. ZONES");
        expect(column3).toBeInTheDocument();
        const column4 = screen.getByText("NO. DEVICES");
        expect(column4).toBeInTheDocument();
        const column5 = screen.getByText("LATITUDE");
        expect(column5).toBeInTheDocument();
        const column6 = screen.getByText("LONGITUDE");
        expect(column6).toBeInTheDocument();
     })
});