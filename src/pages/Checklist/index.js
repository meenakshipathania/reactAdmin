import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty, map, size } from "lodash";
import { Link, withRouter } from "react-router-dom";
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBCheckbox } from 'mdb-react-ui-kit';
import classNames from "classnames";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Modal} from "reactstrap";
import { MDBDataTable } from "mdbreact";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import ReactApexChart from "react-apexcharts";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


const TasksList = props => {
  const [modal_standard, setmodal_standard] = useState(false);
  const [modal, setmodal] = useState(false);
  // const { tasks, onGetTasks } = props;
  const [text, Settext] = useState([]);
  const [Category, setCategory] = useState([]);
  const [upData, setUpData] = useState([]);

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function tog_standard() {
    setmodal_standard(!modal_standard)
    removeBodyCss()
  }

  function tog() {
    setmodal(!modal)
    removeBodyCss()
  }

  async function myApiCall() {
    let{ data, error } = await supabase
  .from('Checklist')
  .select('*')
  Settext(data)
  } 
  useEffect(async() => {
    myApiCall()
  }, [])

  const deleteData = async (dataId) => {
    try {
      await supabase.from('Checklist').delete().eq('Id', dataId);
      setCategory(Category.filter((Category) => Category.Id != dataId));
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleClick = () => {
    window.location.reload();
    //window.location.href = window.location.href;
  };
  const [guidlines, setguidlines] = useState('');
  const [implementation, setimplementation] = useState('');
  const [impact, setimpact] = useState('');
  const [image, setimage] = useState(''); 
  const [description, setdescription] = useState(''); 
  async function addData() {
    const { data, error } = await supabase
    .from('Checklist')
    .insert([
      { Guidlines: guidlines, Implementation: implementation, Impact: impact, Image: image, Description: description },
    ])
  }
  useEffect(async() => {
    // addData()
  }, [])  

  async function updateData(id) {
    const { data, error } = await supabase
    .from('Checklist')
    .update([
      { Guidlines: guidlines, Implementation: implementation, Impact: impact, Image: image, Description: description},
    ])
    .eq('Id', id )
    setUpData(upData.filter((upData) => upData.Id != id));
  }
  useEffect(async() => {
    // addData()
  }, [])

  return (
    <>
      <div className="page-content">
        
          <Breadcrumbs title="Tasks" breadcrumbItem="Task List" />
          {/* Render Breadcrumbs */}
          
          <Row>
            <Col lg={12}>
            {/* <button className="btn btn-primary">Add New Category</button> */}
            <Col sm={6} md={4} xl={12}>
                    <div className="my-4 text-center" style={{marginLeft:"800px"}}>
                      {/* <p className="text-muted">Standard modal</p> */}
                      <button
                        type="button"
                        onClick={() => {
                          tog_standard()
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
                        tog_standard()
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myModalLabel">
                        Add New 
                            </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setmodal_standard(false)
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
                          <label  className="col-md-3 col-form-label">Guidlines</label>
                          <input className="form-control" type="text" value={guidlines} onChange={(e) => setguidlines(e.target.value)}></input>
                          <br></br>
                          <label  className="col-md-3 col-form-label"> Parent Category</label>
                          <div className="col-md-12">
                    <select className="form-control">
                    <option>---Select---</option>
                          <option>Homepage</option>
                          <option>Navigation</option>
                          <option>Search</option>
                          <option>Product List</option>
                          <option>Product Page</option>
                          <option>Cart</option>
                          <option>Checkout</option>
                          <option>Account</option>
                          <option>Mobile</option>
                    </select>
                  </div>
                          <br></br>
                          <label  className="col-md-3 col-form-label">Implementation</label>
                          <input className="form-control" type="text" value={implementation} onChange={(e) => setimplementation(e.target.value)}></input>
                          <br></br>
                          <label  className="col-md-3 col-form-label">Impact</label>
                          <input className="form-control" type="text" value={impact} onChange={(e) => setimpact(e.target.value)}></input>
                          <br></br>
                          <label  className="col-md-3 col-form-label"> Image</label>
                          <input className="form-control" type="file" value={image} onChange={(e) => setimage(e.target.value)}></input>
                          <br></br>
                          <label  className="col-md-3 col-form-label">Description</label>
                          <textarea className="form-control" value={description} onChange={(e) => setdescription(e.target.value)}></textarea>
                          <br></br>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() => {
                            tog_standard()
                          }}
                          className="btn btn-primary waves-effect"
                          data-dismiss="modal"
                        >
                          Close
                            </button>
                        <button
                          type="submit"
                          className="btn btn-primary waves-effect waves-light" onClick={() => {
                            tog_standard(); addData();
                          }}
                        >
                          Save changes
                            </button>
                      </div>
                    </Modal>
                  </Col>
                  {text.map(x => (
                  <Col sm={6} md={4} xl={12}>
                  
                    <Modal
                      isOpen={modal}
                      toggle={() => {
                        tog()
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myModalLabel">
                        Edit Your Category 
                            </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setmodal(false)
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
                          <label  className="col-md-3 col-form-label">Guidlines</label>
                          <input className="form-control" type="text" value={guidlines} onChange={(e) => setguidlines(e.target.value)}></input>
                          <br></br>
                          <label  className="col-md-3 col-form-label"> Parent Category</label>
                          <div className="col-md-12">
                    <select className="form-control">
                    <option>---Select---</option>
                          <option>Homepage</option>
                          <option>Navigation</option>
                          <option>Search</option>
                          <option>Product List</option>
                          <option>Product Page</option>
                          <option>Cart</option>
                          <option>Checkout</option>
                          <option>Account</option>
                          <option>Mobile</option>
                    </select>
                  </div>
                          <br></br>
                          <label  className="col-md-3 col-form-label">Implementation</label>
                          <input className="form-control" type="text" value={implementation} onChange={(e) => setimplementation(e.target.value)}></input>
                          <br></br>
                          <label  className="col-md-3 col-form-label">Impact</label>
                          <input className="form-control" type="text" value={impact} onChange={(e) => setimpact(e.target.value)}></input>
                          <br></br>
                          <label  className="col-md-3 col-form-label"> Image</label>
                          <input className="form-control" type="file" onChange={(e) => setimage(e.target.value)}></input>
                          <br></br>
                          <label  className="col-md-3 col-form-label">Description</label>
                          <textarea className="form-control" value={description} onChange={(e) => setdescription(e.target.value)}></textarea>
                          <br></br>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() => {
                            tog()
                          }}
                          className="btn btn-primary waves-effect"
                          data-dismiss="modal"
                        >
                          Close
                            </button>
                        <button
                          type="submit"
                          className="btn btn-primary waves-effect waves-light" onClick={() => {
                            tog(); updateData(x.Id);
                          }}
                        >
                          Save changes
                            </button>
                      </div>
                    </Modal>
                
                  </Col>
                    ))}
            <CardBody>
             
            <MDBTable striped responsive="true" className="forw">
      <MDBTableHead className="head">
        <tr>
        <th scope='col'></th>
          <th scope='col'>Guidlines</th>
          <th scope='col'>Implementation</th>
          <th scope='col'>Impact</th>
          {/* <th scope='col'>Image</th> */}
          <th scope='col'></th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {text.map(x => (
        <tr>
           <th scope='col'>
            <MDBCheckbox></MDBCheckbox>
          </th>
          <td>
            <div className='align-items-center colwid'>
              {/* <img
                src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                alt=''
                style={{ width: '45px', height: '45px' }}
                className='rounded-circle'
              /> */}
              {/* <div className='ms-3'> */}
                <p className='fw-bold mb-1'>{x.Guidlines}</p>
                {/* <p className='text-muted mb-0'>john.doe@gmail.com</p> */}
              {/* </div> */}
            </div>
          </td>
          <td>
          <MDBBadge color='success' className="rounded-pill">
          <p className='fw-normal mb-1'>{x.Implementation}</p>
            </MDBBadge>
           
          
          </td>
          <td>
          <MDBBadge color='success' pill>
          <p className='fw-normal mb-1'>{x.Impact}</p>
            </MDBBadge>
          </td>
          <td>
          {/* <div className='colwid1'>
          <p className='fw-normal mb-1'>{x.Image}</p>
          </div> */}
          </td>
          {/* <td>
            <MDBBadge color='success' pill>
              Active
            </MDBBadge>
          </td> */}
          {/* <td>Senior</td> */}
          
          <td>
          <button className="btn" color='link' rounded="true" size='sm' onClick={() => {
                          tog();
                        }}
                        data-toggle="modal"
                        data-target="#myModal">
          <i className="fas fa-edit"></i> 
            </button>
            <button className="btn" color='link' rounded="true" size='sm' onClick={() => deleteData(x.Id)}>
            <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
              </CardBody>
            </Col>
          </Row>
      </div>
      
    </>
  )
}

export default connect(
)(withRouter(TasksList))
