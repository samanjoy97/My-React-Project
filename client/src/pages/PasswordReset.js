import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from "react-router-dom";


const PasswordReset = props => {
  const [username, setUsername] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [nameTrigger, setNameTrigger] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordTrigger, setNewPasswordTrigger] = useState(0);
  const [newConfirmPasswordTrigger, setNewConfirmPasswordTrigger] = useState(0);
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [newConfirmPasswordErr, setNewConfirmPasswordErr] = useState("");
  const [alertSuccess, setAlertSuccess] = useState("");
  const [alertDanger, setAlertDanger] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(0);

  let history = useHistory();

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

  const newPasswordHandler = (newPassword = "") => {
    if (newPasswordTrigger == 0) {
      setNewPasswordTrigger(1);
    }
    if (newPassword.trim() === "") {
      setNewPasswordErr("*Please Enter the Password");
      return false;
    } else {
      if (newPassword.trim().length < 6) {
        setNewPasswordErr("*Please enter a password with 6 or more characters");
        return false;
      } else {
        setNewPasswordErr("");
      }
      return true;
    }
  };

  const newConfirmPasswordHandler = (confirmNewPassword = "") => {
    if (newConfirmPasswordTrigger == 0) {
      setNewConfirmPasswordTrigger(1);
    }
    if (confirmNewPassword.trim() === "") {
      setNewConfirmPasswordErr("*Please Enter the Password");
      return false;
    } 
    if (confirmNewPassword.trim().length < 6) {
      setNewConfirmPasswordErr("*Please enter a password with 6 or more characters");
      return false;
    }
    if(confirmNewPassword.trim() !== newPassword.trim() ){
      setNewConfirmPasswordErr("*Confirm Password do not match!!");
      return false;
    }
      setNewConfirmPasswordErr("");
      return true;
    };
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const resetPassword = (e) => {
    e.preventDefault();
    const isNameValid = nameHandler(e.target[0].value);
    const isNewPasswordValid = newPasswordHandler(e.target[1].value);
    const isNewConfirmPassword = newConfirmPasswordHandler(e.target[2].value);

    if(isNameValid && isNewPasswordValid && isNewConfirmPassword){
      setButtonClicked(1);
      const data = {username: username,newPassword: newPassword};
      axios.post("http://localhost:3001/auth/resetpassword", data).then((response) => {
        if (response.data.error) {
          setAlertDanger(response.data.error);
          setTimeout(() => setAlertDanger(""), 2000);
          setButtonClicked(0);
        } else {
          setAlertSuccess(response.data.msg);
          setTimeout(() => setAlertSuccess(""), 2000);
          setTimeout(() => history.push("/login"), 2000);
        }
      }).catch((error)=>{
        console.log(error);
        setButtonClicked(0);
      });
    }
  }

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
          <h3 className="mb-3">Reset Password</h3>
          <div className="bg-white shadow rounded">
            <div className="row">
              <div className="col-md-7 pe-0">
                <div className="form-left h-100 py-5 px-5">
                  <form action="" onSubmit={resetPassword} className="row g-4">
                  <div className="col-12">
                        <label>
                          Username<span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <div className="input-group-text">
                            <i className="fas fa-user"></i>
                          </div>

                          <input
                            type= "text"
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
                        Enter New Password<span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <div className="input-group-text">
                          <i className="fas fa-lock"></i>
                        </div>

                        <input
                          type={passwordShown ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter Username"
                          onChange={(event) => {
                            // console.log(nameTrigger);
                            if (newPasswordTrigger == 1) {
                              newPasswordHandler(event.target.value);
                            }
                            setNewPassword(event.target.value);
                          }}
                          onBlur={(event) => {
                            newPasswordHandler(event.target.value);
                          }}
                        />
                      </div>
                      <span className="float-end text-danger" style={{height:"0px"}}>{newPasswordErr}</span>
                    </div>

                    <div className="col-12">
                      <label>
                       Confirm New Password<span className="text-danger">*</span>
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
                            if (newConfirmPasswordTrigger == 1) {
                              newConfirmPasswordHandler(event.target.value);
                            }
                            setConfirmNewPassword(event.target.value);
                          }}
                          onBlur={(event) => {
                            newConfirmPasswordHandler(event.target.value);
                          }}
                        />
                      </div>
                      <span className="float-end text-danger" style={{height:"0px"}}>{newConfirmPasswordErr}</span>
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

                    <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary px-4 float-end mt-4"
                          disabled = {buttonClicked ? true : false}
                        >
                          {buttonClicked ? <div class="d-flex"><i class="spinner-border spinner-border-sm mt-1" role="status" aria-hidden="true"></i><span>Processing...</span></div> : "Reset Password"}
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
  )
}

export default PasswordReset