import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [alertSuccess, setAlertSuccess] = useState("");
  const [alertDanger, setAlertDanger] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [nameTrigger, setNameTrigger] = useState(0);
  const [passwordTrigger, setPasswordTrigger] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(0);

  let history = useHistory();
  const validateForm = () => {
    if (username.trim() === "") {
      setUsernameErr("*Please Enter the Username");
    } else {
      if (/\s/g.test(username)) {
        setUsernameErr("*Space is not allowed in Username");
      } else {
        setUsernameErr("");
      }
    }
    if (password.trim() === "") {
      setPasswordErr("*Please Enter the Password");
    } else {
      if (password.trim().length < 6) {
        setPasswordErr("*Please enter a password with 6 or more characters");
      } else {
        setPasswordErr("");
      }
    }

    if (
      username.trim() === "" ||
      password.trim() === "" ||
      password.trim().length < 6
    ) {
      return false;
    }
    return true;
  };

  const registration = (e) => {
    e.preventDefault();
    const isNameValid = nameHandler(e.target[0].value);
    const isPasswordValid = passwordHandler(e.target[1].value);
    if (isNameValid && isPasswordValid) {
      setButtonClicked(1);
      const data = { username: username, password: password };
      axios.post("http://localhost:3001/auth", data).then((response) => {
        console.log(response.data);
        if (response.data.msg) {
          console.log(response.data.msg);
          setAlertDanger(response.data.msg);
          setTimeout(() => setAlertDanger(""), 2000);
          setButtonClicked(0);
        } else {
          setAlertSuccess(response.data);
          setTimeout(() => setAlertSuccess(""), 2000);
          setTimeout(() => history.push("/login"), 2000);
        }
      }).catch((error)=>{
        setButtonClicked(0);
        console.log(error);
      });
    }
  };
  const nameHandler = (username = "") => {
    if (nameTrigger == 0) {
      setNameTrigger(1);
    }
    console.log(nameTrigger);
    console.log(username);
    if (username.trim() === "") {
      setUsernameErr("*Please Enter the Username");
      return false;
    } else {
      if (/\s/g.test(username)) {
        setUsernameErr("*Space is not allowed in Username");
        return false;
      } else {
        setUsernameErr("");
      }
      return true;
    }
  };
  const passwordHandler = (password = "") => {
    if (passwordTrigger == 0) {
      setPasswordTrigger(1);
    }
    if (password.trim() === "") {
      setPasswordErr("*Please Enter the Password");
      return false;
    } else {
      if (password.trim().length < 6) {
        setPasswordErr("*Please enter a password with 6 or more characters");
        return false;
      } else {
        setPasswordErr("");
      }
      return true;
    }
  };
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  return (
    <div className="login-page bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            {alertSuccess ? (
              <p className="alert alert-success" role="alert">
                {alertSuccess}
              </p>
            ) : null}
            {alertDanger ? (
              <p className="alert alert-danger" role="alert">
                {alertDanger}
              </p>
            ) : null}
            <h3 className="mb-3">Register Now</h3>
            <div className="bg-white shadow rounded">
              <div className="row">
                <div className="col-md-7 pe-0">
                  <div className="form-left h-100 py-5 px-5">
                    <form action="" onSubmit={registration} className="row g-4">
                      <div className="col-12">
                        <label>
                          Username<span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <i className="fas fa-user"></i>
                          </div>

                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Username"
                            onChange={(event) => {
                              // console.log(nameTrigger);
                              if (nameTrigger == 1) {
                                nameHandler(event.target.value);
                              }
                              setUsername(event.target.value);
                            }}
                            onBlur={(event) => {
                              nameHandler(event.target.value);
                            }}
                          />
                        </div>
                        <span className="float-end text-danger" style={{height:"0px"}}>{usernameErr}</span>
                      </div>

                      <div className="col-12">
                        <label>
                          Password<span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <i className="fas fa-lock"></i>
                          </div>
                          <input
                            type={passwordShown ? "text" : "password"}
                            className="form-control"
                            placeholder="Enter Password"
                            onChange={(event) => {
                              if (passwordTrigger == 1) {
                                passwordHandler(event.target.value);
                              }
                              setPassword(event.target.value);
                            }}
                            onBlur={(event) => {
                              passwordHandler(event.target.value);
                            }}
                          />
                        </div>
                        <span className="float-end text-danger" style={{height:"0px"}}>{passwordErr}</span>
                      </div>

                      <div className="col-sm-6">
                        <div className="form-check mt-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineFormCheck"
                            onClick={togglePassword}
                          />
                          <label
                            className="form-check-label"
                            for="inlineFormCheck"
                          >
                            Show Password
                          </label>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <p className="text-centre m-2">
                          Already have an account?{" "}
                          <Link to="/login">Sign In</Link>
                        </p>
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary px-4 float-end mt-4"
                          disabled = {buttonClicked ? true : false}
                        >
                          {buttonClicked ? <div class="d-flex"><i class="spinner-border spinner-border-sm mt-1" role="status" aria-hidden="true"></i><span>Processing...</span></div> : "Register"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-5 ps-0 d-none d-md-block">
                  <div className="form-right d-flex h-100 bg-primary text-white text-center">
                    <div className="row justify-content-center align-self-center">
                      <i className="fab fa-bootstrap"></i>
                      <h2 className="fs-1">Welcome Back!!!</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-end text-secondary mt-3">
              Bootstrap 5 Login Page Design
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
