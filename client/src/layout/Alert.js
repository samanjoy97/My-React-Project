import React from "react";
import PropTypes from "prop-types";

const Alert = ({ alertSuccess, alertDanger }) => {
  return (
    <div>
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
    </div>
  );
};

Alert.propTypes = {
  alertSuccess: PropTypes.string.isRequired,
  alertDanger: PropTypes.string.isRequired,
};

export default Alert;
