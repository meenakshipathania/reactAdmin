import React, { useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { isEmpty, map, size } from "lodash";
import { Link, withRouter } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { decode } from 'base64-arraybuffer'

// import {
//   MDBBadge,
//   MDBBtn,
//   MDBTable,
//   MDBTableHead,
//   MDBTableBody,
//   MDBCheckbox,
// } from "mdb-react-ui-kit";
// import classNames from "classnames";
import {
  Row,
  Col,
  CardBody,
  Modal,
} from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getTasks } from "../../store/tasks/actions";
import formData from 'form-data';
// import ReactApexChart from "react-apexcharts";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CheckList = (props) => {
  const [modal_standard, setmodal_standard] = useState(false);
  const [modal, setmodal] = useState(false);
  // const { tasks, onGetTasks } = props;
  const [text, Settext] = useState([]);
  const [text1, Settext1] = useState([]);
  const [EditId, setId] = useState(0);
  const [getImage, setImage] = useState(0);
  const [Category, setCategory] = useState([]);
  const [dynamic_description, setdynamic_description] = useState("")
  const [upData, setUpData] = useState([]);
  const [basic, setbasic] = useState(false);
  const [basic1, setbasic1] = useState(false);
  const [basic2, setbasic2] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("")
  const [guidlines, setguidlines] = useState("");
  const [implementation, setimplementation] = useState("");
  const [impact, setimpact] = useState("");
  const [image, setimage] = useState("");
  const [description, setdescription] = useState("");


  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  function tog_standard() {
    setmodal_standard(!modal_standard);
    removeBodyCss();
    setguidlines("");
    setimplementation("");
    setimpact("");
    setdescription("");
    setimage("")
  }

  function tog() {
    setmodal(!modal);
    removeBodyCss();
  }

  async function myApiCall() {
    let { data, error } = await supabase.from("Checklist").select("*");
    Settext(data);
    $(document).ready(function () {
      $("#example").DataTable();
    });
  }
  useEffect(async () => {
    myApiCall();
  }, []);

  async function myApiCall1() {
    let { data, error } = await supabase.from("Categories").select("*");
    Settext1(data);
    // console.log(data, error);
  }
  useEffect(async () => {
    myApiCall1();
  }, []);

  const deleteData = async (dataId) => {
    try {
      await supabase.from("Checklist").delete().eq("Id", dataId);
      setCategory(Category.filter((Category) => Category.Id != dataId));
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleClick = () => {
    window.location.reload();
    //window.location.href = window.location.href;
  };
  function handleEdit(id) {
    setId(id);
    for (let i = 0; i < text.length; i++) {
      if (text[i].Id === id) {
        setguidlines(text[i].Guidlines);
        setimplementation(text[i].Implementation);
        setimpact(text[i].Impact);
        setdescription(text[i].Description);
        setimage(text[i].Image)
      }
    }
    tog();
  }

  async function addData() {
    const { data, error } = await supabase.from("Checklist").insert([
      {
        Guidlines: guidlines,
        Implementation: implementation,
        Impact: impact,
        Image: getImage.data.publicUrl,
        Description: description,
      },
    ]);
  }
  useEffect(async () => {
    // addData()
  }, []);

  async function updateData(id) {
    const { data, error } = await supabase
      .from("Checklist")
      .update([
        {
          Guidlines: guidlines,
          Implementation: implementation,
          Impact: impact,
          Image: getImage.data.publicUrl,
          Description: description,
        },
      ])
      .eq("Id", EditId);
    setUpData(upData.filter((upData) => upData.Id != id));
  }
  useEffect(async () => {
    // addData()
  }, []);

 
async function bucketdata(file){
  const { data, error } = await supabase.storage
  .from('images')
  .upload(`${file.name}`,file, decode('base64'),{ 
    contentType: 'image/png',
  })
  setImage(supabase.storage.from('images').getPublicUrl(`${file.name}`))
  // console.log(setImage)
  // console.log(data, error);
  // console.log(file)
}
useEffect(async () => {
  // bucketdata()
}, []);

  return (
    <>
      <div className="page-content">
        <Breadcrumbs title="Tasks" breadcrumbItem="Task List" />
        {/* Render Breadcrumbs */}

        {success_dlg ? (
          <SweetAlert
            success
            title={dynamic_title}
            onConfirm={() => {
              setsuccess_dlg(false);
            }}
          >
            {dynamic_description}
          </SweetAlert>
        ) : null}

        {error_dlg ? (
          <SweetAlert
            error
            title={dynamic_title}
            onConfirm={() => {
              seterror_dlg(false);
            }}
          >
            {dynamic_description}
          </SweetAlert>
        ) : null}
        <Row>
          <Col lg={12}>
            {/* <button className="btn btn-primary">Add New Category</button> */}
            <Col sm={6} md={4} xl={12}>
              <div className="my-4 text-center" style={{ marginLeft: "800px" }}>
                {/* <p className="text-muted">Standard modal</p> */}
                <button
                  type="button"
                  onClick={() => {
                    tog_standard();
                  }}
                  className="btn btn-primary waves-effect waves-light"
                  data-toggle="modal"
                  data-target="#myModal"
                >
                  Add New Category
                </button>
              </div>
              <Modal
                isOpen={modal_standard}
                toggle={() => {
                  tog_standard();
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title mt-0" id="myModalLabel">
                    Add New
                  </h5>
                  <button
                    type="button"
                    onClick={() => {
                      setmodal_standard(false);
                    }}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <label className="col-md-3 col-form-label">Guidlines</label>
                    <input
                      className="form-control"
                      type="text"
                      value={guidlines}
                      onChange={(e) => setguidlines(e.target.value)}
                    ></input>
                    <br></br>
                    <label className="col-md-4 col-form-label">
                      Parent Category
                    </label>
                      <select
                        className="form-control"
                      >
                        <option>---Select---</option>
                        {text1.map((x)=> (
                        <option value={x.Id}>{x.Name}</option>
                        ))}
                      </select>
                    <br></br>
                    <label className="col-md-3 col-form-label">
                      Implementation
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={implementation}
                      onChange={(e) => setimplementation(e.target.value)}
                    ></input>
                    <br></br>
                    <label className="col-md-3 col-form-label">Impact</label>
                    <input
                      className="form-control"
                      type="text"
                      value={impact}
                      onChange={(e) => setimpact(e.target.value)}
                    ></input>
                    <br></br>
                    <label className="col-md-3 col-form-label"> Image</label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(e) => bucketdata(e.target.files[0])}
                    ></input>
                    <br></br>
                    <label className="col-md-3 col-form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setdescription(e.target.value)}
                    ></textarea>
                    <br></br>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => {
                      tog_standard();
                    }}
                    className="btn btn-primary waves-effect"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary waves-effect waves-light"
                    onClick={() => {
                      tog_standard();
                      addData();
                      setbasic(true);
                    }}
                  >
                    Save changes
                  </button>
                </div>
              </Modal>
            </Col>
            {text.map((x) => (
              <Col sm={6} md={4} xl={12}>
                <Modal style={{opacity:"999", height:"100%"}} fade={false}
                  isOpen={modal}
                  toggle={() => {
                    tog();
                  }}
                >
                  <div className="modal-header">
                    <h5 className="modal-title mt-0" id="myModalLabel">
                      Edit Your Category
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setmodal(false);
                      }}
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                  <form>
                    <label className="col-md-3 col-form-label">Guidlines</label>
                    <input
                      className="form-control"
                      type="text"
                      value={guidlines}
                      onChange={(e) => setguidlines(e.target.value)}
                    ></input>
                    <br></br>
                    <label className="col-md-4 col-form-label">
                      Parent Category
                    </label>
                      <select
                        className="form-control"
                      >
                        <option>---Select---</option>
                        {text1.map((x)=> (
                        <option value={x.Id}>{x.Name}</option>
                        ))}
                      </select>
                    <br></br>
                    <label className="col-md-3 col-form-label">
                      Implementation
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={implementation}
                      onChange={(e) => setimplementation(e.target.value)}
                    ></input>
                    <br></br>
                    <label className="col-md-3 col-form-label">Impact</label>
                    <input
                      className="form-control"
                      type="text"
                      value={impact}
                      onChange={(e) => setimpact(e.target.value)}
                    ></input>
                    <br></br>
                    <label className="col-md-3 col-form-label"> Image</label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(e) => bucketdata(e.target.files[0])}
                    ></input>
                    <br></br>
                    <label className="col-md-3 col-form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setdescription(e.target.value)}
                    ></textarea>
                    <br></br>
                  </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => {
                        tog();
                      }}
                      className="btn btn-primary waves-effect"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary waves-effect waves-light"
                      onClick={() => {
                        tog();
                        updateData(x);
                        setbasic1(true);
                      }}
                    >
                      Save changes
                    </button>
                  </div>
                </Modal>
              </Col>
            ))}
            <CardBody>
              <table
                id="example"
                className="table table-striped table-bordered table-responsive"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>Guidlines</th>
                    <th>Implementation</th>
                    <th>Impact</th>
                    <th>Category_Id</th>
                    <th>Description</th>
                    <th style={{width: "11%"}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {text.map((x) => (
                    <tr>
                      <td>
                        <input type="checkbox"></input>
                      </td>
                      <td>{x.Guidlines}</td>
                      <td>{x.Implementation}</td>
                      <td>{x.Impact}</td>
                      <td>{x.category_id}</td>
                      <td>{x.Description}</td>
                      <td>
                        <button
                          className="btn"
                          color="link"
                          rounded="true"
                          size="sm"
                          onClick={() => {
                            handleEdit(x.Id);
                          }}
                          data-toggle="modal"
                          data-target="#myModal"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn"
                          color="link"
                          rounded="true"
                          size="sm"
                          onClick={() => {deleteData(x.Id); setbasic2(true);}}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* <tfoot>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
            </tr>
        </tfoot> */}
              </table>
            </CardBody>
          </Col>
          {basic ? (
            <SweetAlert
              title="Your Entry is Saved Successfully!!!"
              onConfirm={() => {
                setbasic(false); handleClick();
              }}
            />
          ) : null}

          {basic1 ? (
            <SweetAlert
              title="Your Entry is Updated Successfully!!!"
              onConfirm={() => {
                setbasic1(false); handleClick();
              }}
            />
          ) : null}

          {basic2 ? (
            <SweetAlert
              title="Your Entry is Deleted Successfully!!!"
              onConfirm={() => {
                setbasic2(false); handleClick();
              }}
            />
          ) : null}

        </Row>
      </div>
    </>
  );
};

CheckList.propTypes = {
  tasks: PropTypes.array,
  onGetTasks: PropTypes.func,
};

const mapStateToProps = ({ tasks }) => ({
  tasks: tasks.tasks,
});

const mapDispatchToProps = (dispatch) => ({
  onGetTasks: () => dispatch(getTasks()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CheckList));
// export default connect()(withRouter(CheckList));
