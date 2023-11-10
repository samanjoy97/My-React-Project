import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import CreateQuestion from "./pages/CreateQuestion";
import EditQuestion from "./pages/EditQuestion";
import Registration from "./pages/Registration";
import PasswordReset from "./pages/PasswordReset";
import Login from "./pages/Login";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useHistory } from "react-router-dom";
import { MainNavigation } from "./layout/MainNavigation";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });
  let history = useHistory();
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <MainNavigation />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/createQuestion" exact component={CreateQuestion} />
          <Route path="/editQuestion/:id" exact component={EditQuestion} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/passwordReset" exact component={PasswordReset} />
          <Route path="/login" exact component={Login} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
