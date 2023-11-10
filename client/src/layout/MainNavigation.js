import React from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
//import classes from "./MainNavigation.module.css";
import { useContext } from "react";

export const MainNavigation = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  let history = useHistory();

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    // window.location = "/login";
    history.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <img src="e-learning.png" height="50" width="50" className="mx-2" />
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-2">
            {!authState.status ? (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/login"
                    //activeClassName="active"
                    activeStyle={{
                      fontWeight: "bold",
                    }}
                    className="navbar-brand"
                  >
                    {" "}
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/registration"
                    //activeClassName="active"
                    activeStyle={{ fontWeight: "bold" }}
                    className="navbar-brand"
                  >
                    {" "}
                    Registration
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/"
                    //activeClassName="active"
                    activeStyle={{
                      fontWeight: "bold",
                    }}
                    className="navbar-brand"
                  >
                    Home Page
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/createQuestion"
                    //activeClassName="active"
                    activeStyle={{ fontWeight: "bold" }}
                    className="navbar-brand"
                  >
                    Create A Question
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <ul className="d-flex my-2" style={{ marginRight: "80px" }}>
            {authState.status && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {authState.username}
                  <i className="fas fa-user mx-2"></i>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" onClick={(e) => logout(e)}>
                      Logout
                    </a>
                  </li>
                  <li>
                    <Link to="/" className="dropdown-item">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link to="/" className="dropdown-item">
                      Something else here
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

//style={{ marginRight: "80px" }}
