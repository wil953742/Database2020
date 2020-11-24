import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Import Views
import { Login } from "./View/Login";
import { Template } from "./View/Template";
import { Submitter1 } from "./View/Submitter1";

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
          <Route path="/submitter1">
            <Submitter1 />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
