import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Import Views
import { Template } from "./View/Template";
import { Signup } from "./View/Signup";
import AdminUserMng from "./View/AdminUserMng";
import AdminTaskView from "./View/AdminTaskView";
import AdminTaskEdit from "./View/AdminTaskEdit";
import AdminAddTask from "./View/AdminAddTask";
import { Submitter1 } from "./View/Submitter1";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Template} />
          <Route path="/signup" component={Signup} />
          <Route path="/user" component={AdminUserMng} />
          <Route path="/TaskEdit/:taskId" component={AdminTaskEdit} />
          <Route path="/TaskView/:taskId" component={AdminTaskView} />
          <Route paht="/NewTask" component={AdminAddTask} />
          <Route path="/submitter1" component={Submitter1} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
