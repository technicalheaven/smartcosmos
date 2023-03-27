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
  import { RolePermission } from "./rolePermission";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import { BrowserRouter } from "react-router-dom";


  afterEach(() => {
    cleanup();
  });
  describe("Roles Table",()=>{
  
    test("checkbox available", async()=>{
      render(<BrowserRouter><Provider store={store}><RolePermission/></Provider></BrowserRouter>)
     const Checkbox= screen.getAllByRole('checkbox')[0];
     expect(Checkbox).toBeInTheDocument();
      const Checkbox2= screen.getAllByRole('checkbox')[1];
      expect(Checkbox2).toBeInTheDocument();
       })
    })
   
  