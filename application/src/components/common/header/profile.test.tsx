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
import { ProfileForm } from "./profileForm";


afterEach(() => {
    cleanup();
});


describe("ProfileForm Component", () => {
    test("edit profile are available", async () => {
        render(
            <Provider store={store}>
                <ProfileForm />
            </Provider>
        )
        const form = screen.getByTestId("form-id");
        expect(form).toBeInTheDocument()
        const img = screen.getByAltText("profile")
        expect(img).toBeInTheDocument()
        const input = screen.getByTestId("input-id");
        expect(input).toBeInTheDocument()
    })
})

