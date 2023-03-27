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
import UserRoles from ".";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import { BrowserRouter } from "react-router-dom";


  afterEach(() => {
    cleanup();
  });
  describe("Roles Table",()=>{
  
    test("table available", async()=>{
      render(<BrowserRouter><Provider store={store}><UserRoles/></Provider></BrowserRouter>)
      const table = document.getElementsByTagName('table') [0];
      expect(table).toBeInTheDocument();
      const text1 = within (table).getByText('Role')
      expect(text1).toBeInTheDocument();
      const text2= within(table).getByText('Permission Description')
      expect (text2).toBeInTheDocument();
    })
   
  })
