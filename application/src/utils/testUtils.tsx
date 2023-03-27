import { render as RTL } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { store } from "../redux/store";


const CustomRouter = ({ basename, children, history }: any) => {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

const renderWithRouter = (component: any, option = {}) => {
  const history = createBrowserHistory();

  return RTL(
    <Provider store={store}>
      <CustomRouter history={history}>{component}</CustomRouter>
    </Provider>,
    option
  );
};

const render = (component: any, option = {}) => {
  return RTL(
    <Provider store={store}>
      {component}
    </Provider>,
    option
  );
};

export {render, renderWithRouter}