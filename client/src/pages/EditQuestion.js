import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Progress from "../layout/Progress";
import axios from "axios";
import { Link } from "react-router-dom";

const EditQuestion = () => {
  const history = useHistory();
  let { id } = useParams();
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
  const [files, setFiles] = useState([]);
  const [disable, setDisable] = useState(false);
  const [questionText1, setQuestionText1] = useState("");
  const [questionType1, setQuestionType1] = useState("");
  const [options1, setOptions1] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [marks1, setMarks1] = useState("");
  const [status1, setStatus1] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    axios.get(`http://localhost:3001/questions/byId/${id}`).then((response) => {
      var question = response.data;
      setQuestionText(question.questionText);
      setQuestionType(question.questionType);
      setOptions(question.options);
      setAnswer(question.answer);
      setMarks(question.marks);
      setStatus(question.status);

      setQuestionText1(question.questionText);
      setQuestionType1(question.questionType);
      setOptions1(question.options);
      setAnswer1(question.answer);
      setMarks1(question.marks);
      setStatus1(question.status);
      setDisable(true);
    });
    axios
      .get(`http://localhost:3001/questions/files/${id}`)
      .then((response) => {
        setFiles(response.data);
      });
  }, []);

  //console.log(files);

  const onChange = (e) => {
    //console.log(e.target.files);
    setFile(e.target.files);
    setDisable(false);
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
        const res = await axios.put(
          `http://localhost:3001/questions/byId/${id}`,
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
        console.log(res.data);
        setFiles(res.data.files);
        setDisable(true);
        setTimeout(() => setUploadPercentage(0), 2000);
        console.log(res.data.msg);
        setAlertSuccess(res.data.msg);
        setTimeout(() => setAlertSuccess(""), 2000);
        setTimeout(() => history.push("/"), 2000);
      } catch (err) {
        if (err.response.status === 500) {
          console.log("There was a problem with the server");
          setAlertDanger("There was a problem with the server");
          setTimeout(() => setAlertDanger(""), 2000);
        } else {
          console.log(err.response.data.msg);
        }
        setUploadPercentage(0);
        //setDisable(false);
      }
      /*setQuestionText("");
      setQuestionType("");
      setOptions("");
      setAnswer("");
      setMarks("");
      setStatus("");
      */
      setFile([]);
    }
  };

  const deleteFile = (id) => {
    if (window.confirm("Are You Sure You Want to delete this File")) {
      axios
        .delete(`http://localhost:3001/questions/files/${id}`)
        .then((response) => {
          setFiles(
            files.filter((val) => {
              return val.id !== id;
            })
          );
          setAlertDanger(response.data);
          setTimeout(() => setAlertDanger(""), 5000);
        });
    }
  };
  useEffect(() => {
    // console.log("In UseEffect");
    //console.log(typeof marks);
    if (
      questionText !== questionText1 ||
      questionType !== questionType1 ||
      options !== options1 ||
      answer !== answer1 ||
      marks != marks1 ||
      status != status1 ||
      file.length
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [questionText, questionType, options, answer, marks, status, file]);

  return (
    <div className="signup-page">
      <form onSubmit={questionDetails}>
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
        <h3>Update A Question</h3>
        <div className="mb-3">
          <label for="questionText" className="form-label">
            Question Text<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="QuestionText"
            value={questionText}
            onChange={(e) => {
              setQuestionText(e.target.value);
            }}
          />
          <span className="text-danger">{questionTextErr}</span>
        </div>
        <div className="mb-3">
          <label for="questionType" className="form-label">
            Question Type<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="QuestionType"
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value);
            }}
          />
          <span className="text-danger">{questionTypeErr}</span>
        </div>
        <div className="mb-3">
          <label for="options" className="form-label">
            Options<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Options"
            value={options}
            onChange={(e) => {
              setOptions(e.target.value);
            }}
          />
          <span className="text-danger">{optionsErr}</span>
        </div>
        <div className="mb-3">
          <label for="answer" className="form-label">
            Answer<span className="required-field">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          />
          <span className="text-danger">{answerErr}</span>
        </div>
        <div className="mb-3">
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
            onChange={(e) => {
              setMarks(e.target.value);
            }}
          />
          <span className="text-danger">{marksErr}</span>
        </div>
        <div className="mb-3">
        <label for="status" className="form-label">
            Status<span className="required-field">*</span>
          </label>
        <div class="form-check">
        <input class="form-check-input" type="radio" name="status" id="flexRadioDefault1" value="1" onChange={(e) => setStatus(e.target.value)} checked={status=="1"?true:false}/>
        <label class="form-check-label" for="status1">
          Active
        </label>
        </div>
       <div class="form-check">
        <input class="form-check-input" type="radio" name="status" id="flexRadioDefault2" value="0" onChange={(e) => setStatus(e.target.value)} checked={status=="0"?true:false}/>
        <label class="form-check-label" for="status2">
          Inactive
        </label>
       </div>
       <span className="text-danger">{statusErr}</span>
      </div>
        <div className="mb-3">
          <label className="form-label">Files:</label>
          <div className="form-control">
            {files.map((value, key) => {
              return (
                <div key={key}>
                  <a href={`/uploads/${value.FileName}`}>{value.FileName}</a>{" "}
                  <i
                    className="fas fa-trash-alt"
                    style={{ color: "red ", cursor: "pointer" }}
                    onClick={() => deleteFile(value.id)}
                  ></i>
                </div>
              );
            })}
          </div>
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
        <button disabled={disable} type="submit" className="btn btn-success">
          Update Question
        </button>
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
      </form>
    </div>
  );
};

export default EditQuestion;

//className="btn btn-outline-danger m-2 btn-sm"
