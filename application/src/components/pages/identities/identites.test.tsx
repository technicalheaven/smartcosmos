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
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import Identities from ".";
import { BrowserRouter } from "react-router-dom";
import Operation from "antd/lib/transfer/operation";

afterEach(() => {
    cleanup();
});


describe("identities components", () => {
    test("identities test are available", async () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <Identities />
                </Provider>
            </BrowserRouter>
        );
        const tabs = screen.getByTestId("tab-id")
        expect(tabs).toBeInTheDocument();
        const Card = screen.getByTestId("card-id")
        expect(Card).toBeInTheDocument();
        const card1 = screen.getByTestId("cardd-id")
        expect(card1).toBeInTheDocument()
        const button = screen.getByTestId("export-id")
        expect(button).toBeInTheDocument()
    });
});
