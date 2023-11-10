import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import { useHistory, Link } from "react-router-dom";

function Home() {
  const [listofQuestions, setListofQuestions] = useState([]);
  let history = useHistory();
  /* const [users, setUsers] = useState(
    listofQuestions.slice(0, listofQuestions.length)
  );*/
  const [pageNumber, setPageNumber] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [search, setSearch] = useState("");
  const [searchquestionText, setSearchquestionText] = useState("");
  const [searchquestionType, setSearchquestionType] = useState("");
  const [searchoptions, setSearchoptions] = useState("");
  const [searchanswer, setSearchanswer] = useState("");
  const [searchmarks, setSearchmarks] = useState("");
  const [searchstatus, setSearchstatus] = useState("");
  const [searchfileName, setSearchfilename] = useState("");

  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const searchFilter = (searchquestionText || searchquestionType || searchoptions || searchanswer || searchmarks || searchstatus) ? true : false;
  const searchPages = (searchFilter === true ) ? 0 : pagesVisited;

  console.log(listofQuestions.length);
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios.get("http://localhost:3001/questions").then((response) => {
        setListofQuestions(response.data);
      }).catch((error)=>{
        console.log(error);
      });
    }
  }, []);

  console.log(listofQuestions);
  const deleteQuestion = (id) => {
    if (window.confirm("Are You Sure You Want to delete")) {
      axios.delete(`http://localhost:3001/questions/byId/${id}`).then(() => {
        setListofQuestions(
          listofQuestions.filter((val) => {
            return val.id !== id;
          })
        );
      });
    }
  };

  const toggleStatus = (id) => {
    axios
      .put(`http://localhost:3001/questions/status/${id}`)
      .then((response) => {
        console.log(response.data);
        setListofQuestions(
          listofQuestions.map((question) => {
            if (question.id === id) {
              return { ...question, status: response.data.status };
            } else {
              return question;
            }
          })
        );
      }).catch((error)=>{
        console.log(error);
      });
  };

  const pageCount = Math.ceil(listofQuestions.length / usersPerPage);
  console.log(pageCount);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    console.log(selected);
  };

  return (
    <div className="container">
      <div className="row">
        <div class="col-md-9">
          <Link to="/createQuestion" class="btn btn-block btn-primary my-3">
            Create A Question
          </Link>
        </div>
        <div class="col-md-3 my-3">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                disabled
              />
            </th>
            <th scope="col">
              <input
                class="form-control me-2"
                type="search"
                placeholder="QText"
                aria-label="Search"
                onChange={(event) => {
                  setSearchquestionText(event.target.value);
                }}
              />
            </th>
            <th scope="col">
              <input
                class="form-control me-2"
                type="search"
                placeholder="QType"
                aria-label="Search"
                onChange={(event) => {
                  setSearchquestionType(event.target.value);
                }}
              />
            </th>
            <th scope="col">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Options"
                aria-label="Search"
                onChange={(event) => {
                  setSearchoptions(event.target.value);
                }}
              />
            </th>
            <th scope="col">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Answer"
                aria-label="Search"
                onChange={(event) => {
                  setSearchanswer(event.target.value);
                }}
              />
            </th>
            <th scope="col">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Filename"
                aria-label="Search"
                onChange={(event) => {
                  setSearchfilename(event.target.value);
                }}
                disabled
              />
            </th>
            <th scope="col">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Marks"
                aria-label="Search"
                onChange={(event) => {
                  setSearchmarks(event.target.value);
                }}
              />
            </th>
            <th scope="col">
            <select onChange={(event) => {setSearchstatus(event.target.value)}} class="form-control me-2" aria-label="Default select example">
            <option value="" selected>Search a status...</option>
            <option  value="1">Active</option>
            <option  value="0">Inactive</option>
            </select>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">QuestionText</th>
            <th scope="col">QuestionType</th>
            <th scope="col">Options</th>
            <th scope="col">Answer</th>
            <th scope="col">Files</th>
            <th scope="col">Marks</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        {listofQuestions
          .filter((val) => {
            //console.log(val.questionText);
            //console.log(searchquestionText);
            //console.log(val);
            //console.log(searchstatus);
          if (
              val.questionText
                .toString()
                .trim()
                .toLowerCase()
                .includes(searchquestionText.toLowerCase()) &&  val.questionType
                .toString()
                .trim()
                .toLowerCase()
                .includes(searchquestionType.toLowerCase()) &&  val.options
                .toString()
                .trim()
                .toLowerCase()
                .includes(searchoptions.toLowerCase()) &&  val.answer
                .toString()
                .trim()
                .toLowerCase()
                .includes(searchanswer.toLowerCase())   &&  val.marks
                .toString()
                .trim()
                .toLowerCase()
                .includes(searchmarks.toLowerCase()) &&  val.status
                .toString()
                .trim()
                .includes(searchstatus.toLowerCase())
             ) {
              //console.log("cc");
              console.log(val);
              return val;
            }
          })
          .slice(searchPages, searchPages + usersPerPage)
          //.slice(0, 10)
          .map((value, key) => {
           // console.log("HH");
            console.log(key,value);
            return (
              <tbody key={key}>
                <tr>
                  <th scope="row">{searchPages + key + 1}</th>
                  <td>{value.questionText}</td>
                  <td>{value.questionType}</td>
                  <td>{value.options}</td>
                  <td>{value.answer}</td>
                  <td>
                    {value.Files.map((value, key) => {
                      return (
                        <div key={key}>
                          <a href={`/uploads/${value.FileName}`}>
                            {value.FileName}
                          </a>
                        </div>
                      );
                    })}
                  </td>
                  <td>{value.marks}</td>

                  <td>
                    <button
                      className={
                        value.status
                          ? "btn btn-outline-danger m-2 btn-sm"
                          : "btn btn-outline-success m-2 btn-sm"
                      }
                      onClick={() => toggleStatus(value.id, value.status)}
                    >
                      {value.status ? "Inactive" : "Acitve"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary m-2 btn-sm"
                      onClick={() => {
                        history.push(`/editQuestion/${value.id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger m-2 btn-sm"
                      onClick={() => deleteQuestion(value.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </div>
  );
}
export default Home;

/*{displayUsers}    scope="row"
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
      */
//{listofQuestions.map((value, key) => {})}
