import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./fonts.css";
import App from "./App.tsx";
import { Toaster } from 'react-hot-toast';

// import { store } from "./redux/store.ts"
import { Provider } from 'react-redux'
import store from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
    ,
  </StrictMode>
);
