/* eslint-disable */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { isEmpty, map, size } from "lodash"
// import { useInsert } from 'react-supabase'
import { Link, withRouter } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { decode } from 'base64-arraybuffer'
// import {
//   MDBTable,
//   MDBTableHead,
//   MDBTableBody,
//   MDBCheckbox,
// } from "mdb-react-ui-kit";
// import classNames from "classnames"
import { Row, Col, CardBody, Modal } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
// import ReactApexChart from "react-apexcharts"
import { getTasks } from "../../store/tasks/actions";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TasksList = (props) => {
  const [modal_standard, setmodal_standard] = useState(false);
  const [modal, setmodal] = useState(false);
  const [EditId, setId] = useState(0);
  const [getImage, setImage] = useState(0);
  const [dynamic_description, setdynamic_description] = useState("")
  // const { tasks, onGetTasks } = props;
  const [text, Settext] = useState([]);
  const [Category, setCategory] = useState([]);
  const [upData, setUpData] = useState([]);
  const [basic, setbasic] = useState(false);
  const [basic1, setbasic1] = useState(false);
  const [basic2, setbasic2] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [image, setimage] = useState("");
  const [status, setstatus] = useState("");
  const [slug, setslug] = useState("");

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  
  function tog_standard() {
    setmodal_standard(!modal_standard);
    removeBodyCss();
    setname(" ");
    setdescription(" ");
    setstatus(" ");
    setslug(" ");
    setimage("")
  }

  function tog() {
    setmodal(!modal);
    removeBodyCss();
  }

  async function myApiCall() {
    let { data, error } = await supabase
      .from("Categories")
      .select("*")
      .order("Id", { ascending: true });
    Settext(data);
    $(document).ready(function () {
      $("#example").DataTable();
    });
    // console.log(data, error);
  }
  useEffect(async () => {
    myApiCall();
  }, []);

  const deleteData = async (dataId) => {
    try {
      await supabase.from("Categories").delete().eq("Id", dataId);
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
        setname(text[i].Name);
        setdescription(text[i].Description);
        setstatus(text[i].Status);
        setslug(text[i].Slug);
        setimage(text[i].Image)
      }
    }
    tog();
  }

  async function addData() {
    const { data, error } = await supabase
      .from("Categories")
      .insert([
        {
          Name: name,
          Description: description,
          Image: getImage.data.publicUrl,
          Status: status,
          Slug: slug,
        },
      ]);
  }
  useEffect(async () => {
    
  }, []);

  async function updateData(id) {
    const { data, error } = await supabase
      .from("Categories")
      .update([
        {
          Name: name,
          Description: description,
          Image: getImage.data.publicUrl,
          Status: status,
          Slug: slug,
        },
      ])
      .eq("Id", EditId);
    setUpData(upData.filter((upData) => upData.Id != id));
  }
  useEffect(async () => {
    // updateData(5);
  }, []);

  async function bucketdata(file){
    const { data, error } = await supabase.storage
    .from('category')
    .upload(`${file.name}`,file, decode('base64'),{ 
      contentType: 'image/png',
    })
    setImage(supabase.storage.from('category').getPublicUrl(`${file.name}`))
    // console.log(setImage)
    // console.log(data, error);
    // console.log(file)
  }
  useEffect(async () => {
    // bucketdata()
  }, []);

  // const recentTasks = tasks.find(task => task.title === "Recent Tasks")

  return (
    <>
      <div className="page-content">
        <Breadcrumbs title="Tasks" breadcrumbItem="Task List" />
        {/* Render Breadcrumbs */}

        {success_dlg ? (
          <SweetAlert
            success
            title={dynamic_title1}
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
                    <label className="col-md-4 col-form-label">
                      Category Name
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                    ></input>
                    <br></br>
                    <label className="col-md-4 col-form-label">
                      Parent Category
                    </label>
                    {/* <div className="col-md-12"> */}
                    <select className="form-control">
                      <option>---Select---</option>
                      {text.map((x) => (
                        <option value={x.Id}>{x.Name}</option>
                      ))}
                      {/* <option>Homepage</option>
                        <option>Navigation</option>
                        <option>Search</option>
                        <option>Product List</option>
                        <option>Product Page</option>
                        <option>Cart</option>
                        <option>Checkout</option>
                        <option>Account</option>
                        <option>Mobile</option> */}
                    </select>
                    {/* </div> */}
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
                    <label className="col-md-3 col-form-label">Image</label>
                    <input
                      className="form-control"
                      type="file"
                      value={image}
                      onChange={(e) => bucketdata(e.target.files[0])}
                    ></input>
                    <br></br>
                    <label className="col-md-3 col-form-label"> Status</label>
                    <input
                      className="form-control"
                      type="text"
                      value={status}
                      onChange={(e) => setstatus(e.target.value)}
                    ></input>
                    <br></br>
                    <label className="col-md-3 col-form-label">Slug</label>
                    <input
                      className="form-control"
                      type="text"
                      value={slug}
                      onChange={(e) => setslug(e.target.value)}
                    ></input>
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
                <Modal
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
                      <label className="col-md-4 col-form-label">
                        Category Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                      ></input>
                      <br></br>
                      <label className="col-md-4 col-form-label">
                        Parent Category
                      </label>
                      <select className="form-control">
                        <option>---Select---</option>
                        {text.map((x) => (
                          <option value={x.Id}>{x.Name}</option>
                        ))}
                      </select>
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
                      <label className="col-md-3 col-form-label">Image</label>
                      <input
                        className="form-control"
                        type="file"
                        onChange={(e) => bucketdata(e.target.files[0])}
                      ></input>
                      <br></br>
                      <label className="col-md-3 col-form-label"> Status</label>
                      <input
                        className="form-control"
                        type="text"
                        value={status}
                        // onChange={handleChange}
                        onChange={(e) => setstatus(e.target.value)}
                      ></input>
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
                    <th style={{ width: "10%" }}></th>
                    <th style={{ width: "12%" }}>Id</th>
                    <th style={{ width: "18%" }}>Name</th>
                    <th style={{ width: "17%" }}>Status</th>
                    {/* <th>Image</th> */}
                    <th style={{ width: "26%" }}>Description</th>
                    <th style={{ width: "17%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {text.map((x) => (
                    <tr>
                      <td>
                        <input type="checkbox"></input>
                      </td>
                      <td>{x.Id}</td>
                      <td>{x.Name}</td>
                      <td>{x.Status}</td>
                      {/* <td>{x.Image}</td> */}
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
                          onClick={() => {
                            deleteData(x.Id);
                            setbasic2(true);
                          }}
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
                setbasic(false);
                handleClick();
              }}
            />
          ) : null}

          {basic1 ? (
            <SweetAlert
              title="Your Entry is Updated Successfully!!!"
              onConfirm={() => {
                setbasic1(false);
                handleClick();
              }}
            />
          ) : null}
          {basic2 ? (
            <SweetAlert
              title="Your Entry is Deleted Successfully!!!"
              onConfirm={() => {
                setbasic2(false);
                handleClick();
              }}
            />
          ) : null}

          {/* 
            <Col lg={4}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-3">Tasks </CardTitle>
                  <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={280}
                    className="apex-charts"
                  />
                </CardBody>
              </Card>

              {!isEmpty(recentTasks) && (
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">{recentTasks.title}</CardTitle>
                    <div className="table-responsive">
                      <table className="table table-nowrap align-middle mb-0">
                        <tbody>
                          {map(recentTasks.tasks, (item, i) => (
                            <tr key={i}>
                              <td>
                                <h5 className="text-truncate font-size-14 m-0">
                                  <Link to="#" className="text-dark">
                                    {item.description}
                                  </Link>
                                </h5>
                              </td>
                              <td>
                                <div className="team">
                                {map(
                                    item.members,
                                    (member, index) =>
                                      index < 2 && (
                                        <Link
                                          to="#"
                                          className="team-member d-inline-block"
                                          key={index}
                                        >
                                          {member.userImg ? (
                                            <img
                                              src={member.userImg}
                                              className="rounded-circle avatar-xs m-1"
                                              alt=""
                                            />
                                          ) : (
                                            <div className="avatar-xs">
                                              <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                {member.username.charAt(0)}
                                              </span>
                                            </div>
                                          )}
                                        </Link>
                                      )
                                  )}
                                  {size(item.members) > 2 && (
                                    <Link
                                      to="#"
                                      className="team-member d-inline-block"
                                    >
                                      <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                          {size(item.members) - 2} +
                                        </span>
                                      </div>
                                    </Link>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              )}
           
            </Col> */}
        </Row>
      </div>
    </>
  );
};

TasksList.propTypes = {
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
)(withRouter(TasksList));
