import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { HashRouter } from "react-router-dom"
import { Provider } from "react-redux"

import store from "./store"

const app = (
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById("root"))
serviceWorker.unregister()
