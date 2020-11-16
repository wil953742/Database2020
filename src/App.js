import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Import Views
import { Login } from "./View/Login";
import { Template } from "./View/Template";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/main">
            <Template />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
