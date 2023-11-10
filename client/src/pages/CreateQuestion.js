import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Progress from "../layout/Progress";
import Alert from "../layout/Alert";
import { Link } from "react-router-dom";
import axios from "axios";

const CreateQuestion = () => {
  const history = useHistory();
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [options, setOptions] = useState("");
  const [answer, setAnswer] = useState("");
  const [marks, setMarks] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState([]);
  const [questionTextErr, setQuestionTextErr] = useState("");
  const [questionTypeErr, setQuestionTypeErr] = useState("");
  const [optionsErr, setOptionsErr] = useState("");
  const [answerErr, setAnswerErr] = useState("");
  const [marksErr, setMarksErr] = useState("");
  const [statusErr, setStatusErr] = useState("");
  const [alertSuccess, setAlertSuccess] = useState("");
  const [alertDanger, setAlertDanger] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  //const [disable, setDisable] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);

  const onChange = (e) => {
    console.log(e.target.files);
    setFile(e.target.files);
  };

  const validateForm = () => {
    if (questionText.trim() === "") {
      setQuestionTextErr("*Please Enter the questionText");
    } else {
      setQuestionTextErr("");
    }
    if (questionType.trim() === "") {
      setQuestionTypeErr("*Please Enter the questionType");
    } else {
      setQuestionTypeErr("");
    }
    if (options.trim() === "") {
      setOptionsErr("*Please Enter the options");
    } else {
      setOptionsErr("");
    }
    if (answer.trim() === "") {
      setAnswerErr("*Please Enter the answer");
    } else {
      setAnswerErr("");
    }
    if (marks === "") {
      setMarksErr("*Please Enter the marks");
    } else {
      setMarksErr("");
    }
    if (status === "") {
      setStatusErr("*Please Enter the status");
    } else {
      if (status != 0 && status != 1) {
        setStatusErr("*Please Enter 0 or 1 as status");
      } else {
        setStatusErr("");
      }
    }
    if (
      questionText.trim() === "" ||
      questionType.trim() === "" ||
      options.trim() === "" ||
      answer.trim() === "" ||
      marks === "" ||
      status === "" ||
      (status != 0 && status != 1)
    ) {
      return false;
    }
    return true;
  };

  const questionDetails = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      if (file) {
        for (var x = 0; x < file.length; x++) {
          formData.append("file", file[x]);
        }
      }
      formData.append("ClassroomId", 1);
      formData.append("questionText", questionText);
      formData.append("questionType", questionType);
      formData.append("options", options);
      formData.append("answer", answer);
      formData.append("marks", marks);
      formData.append("status", status);

      try {
        const res = await axios.post(
          "http://localhost:3001/questions",
          formData,
          {
            headers: {
              "content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              setUploadPercentage(
                parseInt(
                  Math.round((progressEvent.loaded * 100) / progressEvent.total)
                )
              );
            },
          }
        );
        setButtonClicked(true);
        setTimeout(() => setUploadPercentage(0), 2000);
        console.log(res.data.msg);
        setAlertSuccess(res.data.msg);
        setTimeout(() => setAlertSuccess(""), 2000);
        setTimeout(() => history.push("/"), 2000);
        console.log(res.data);
      } catch (err) {
        if (err.response.status === 500) {
          console.log("There was a problem with the server");
          setAlertDanger("There was a problem with the server");
          setTimeout(() => setAlertDanger(""), 2000);
        } else {
          console.log(err.response.data.msg);
        }
        setUploadPercentage(0);
        setButtonClicked(false);
      }
      setQuestionText("");
      setQuestionType("");
      setOptions("");
      setAnswer("");
      setMarks("");
      setStatus("");
      setFile([]);
    }
  };

  return (
    <div className="signup-page">
      <form onSubmit={questionDetails}>
        <h3>Create A Question</h3>
        <div className="mb-3">
          <label for="questionText" className="form-label">
            Question Text<span className="required-field">*</span>
          </label>
          <textarea
          className="form-control"
          placeholder="QuestionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          >
          </textarea>
          <span className="text-danger">{questionTextErr}</span>
        </div>
        <div className="row">
        <div className="col-sm mb-3">
          <label for="questionType" className="form-label">
            Question Type<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="QuestionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          />
          <span className="text-danger">{questionTypeErr}</span>
        </div>
        <div className="col-sm mb-3">
          <label for="options" className="form-label">
            Options<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Options"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
          />
          <span className="text-danger">{optionsErr}</span>
        </div>
        </div>
        <div className="row">
        <div className="col-sm mb-3">
          <label for="answer" className="form-label">
            Answer<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <span className="text-danger">{answerErr}</span>
        </div>
        <div className="col-sm mb-3">
          <label for="marks" className="form-label">
            Marks<span className="required-field">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="1"
            className="form-control"
            placeholder="Marks"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
          <span className="text-danger">{marksErr}</span>
        </div>
        </div>
        <div className="mb-3">
        <label for="status" className="form-label">
            Status<span className="required-field">*</span>
          </label>
        <div className="form-check">
        <input className="form-check-input" type="radio" name="status" id="flexRadioDefault1" value="1" onChange={(e) => setStatus(e.target.value)}/>
        <label className="form-check-label" for="status1">
          Active
        </label>
        </div>
       <div className="form-check">
        <input className="form-check-input" type="radio" name="status" id="flexRadioDefault2" value="0" onChange={(e) => setStatus(e.target.value)}/>
        <label className="form-check-label" for="status2">
          Inactive
        </label>
       </div>
       <span className="text-danger">{statusErr}</span>
        </div>
        <div className="mb-3">
          <label for="formFileMultiple" className="form-label">
            Upload Files
          </label>
          <input
            className="form-control"
            type="file"
            id="formFileMultiple"
            multiple
            onChange={onChange}
          />
          <label for="formFileMultiple" className="choose-icon">
            <i className="fas fa-file-upload" aria-hidden="true"></i>
          </label>
        </div>
        <Progress percentage={uploadPercentage} />
        <button
          className="btn btn-success"
          onClick={() => {
            history.push("/");
          }}
        >
          {"  "}
          Back
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled = {buttonClicked ? true : false}
        >
          {buttonClicked ? <div><i class="spinner-border spinner-border-sm mt-1" role="status" aria-hidden="true"></i><span>Processing...</span></div> : "Create Question"}
        </button>
        <Alert alertSuccess={alertSuccess} alertDanger={alertDanger} />
      </form>
    </div>
  );
};

export default CreateQuestion;
