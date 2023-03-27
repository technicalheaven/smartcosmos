import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { BrowserRouter} from "react-router-dom";
import './index.css';
import { store } from './redux/store';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import 'antd/dist/antd.min.css';
import './index.css';
import UIRoutes from './routes';

let persistor = persistStore(store)
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate persistor={persistor}>
     <BrowserRouter>
      <UIRoutes/>
    </BrowserRouter>
    </PersistGate>
    </Provider>
  </React.StrictMode>
);



