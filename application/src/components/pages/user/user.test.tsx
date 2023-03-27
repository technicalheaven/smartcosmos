import { screen } from "@testing-library/react";
import React from "react";
import { UserForm } from "./form";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { baseURL } from "../../../config/api";
import { render } from "../../../utils/testUtils";

const server = setupServer(
  rest.get(`${baseURL}/posts`, (req, res, ctx)=>{
    return res(ctx.json({name: "hello"}));
  })
)

describe("Testing user form component", ()=>{

    beforeAll(()=>{
      // jest.spyOn();
      server.listen();
    });

    beforeEach(()=>{
      server.resetHandlers();
    })

    afterAll(()=>{
      server.close();
    })

    it("checking user form input fields", ()=>{
        render(<UserForm
          formValues={{name: ""}}
        />)
    })
});