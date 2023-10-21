import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
import { Modal, Button } from "react-bootstrap";
import { baseUrl, initialEditState, initialViewState } from '../common/common';

export default function Home() {
    const [students, setStudents] = useState([]);
    const [editDetails, setEditDetails] = useState(initialEditState);
    const [viewDetails, setViewDetails] = useState(initialViewState)

    const getStudents = async() => {
        const studentList = await axios.get(`${baseUrl}/getAll`)
        setStudents(studentList.data)
    }

    const deleteStudent = async(item) => {
        await axios.delete(`${baseUrl}/delete`, {
            data: {
                name: item.name
            }
        }).then(() => {
            getStudents();
        })
    }

    const handleClose = () => {
        setEditDetails(initialEditState)
    }
    const handleOnEdit = (item) => {
        setEditDetails({
            name: item.name,
            satScore: item.satScore
        })
    }
    const handleOnChange = (e) => {
        setEditDetails({
            ...editDetails,
            satScore: e.target.value
        })
    }

    const handleOnSave = async() => {
        axios.put(`${baseUrl}/update`, {
            name: editDetails.name,
            satScore: parseInt(editDetails.satScore)
        }).then(() => {
            getStudents()
            setEditDetails(initialEditState)
        })
    }

    const handleOnView = async(item) => {
        await axios.get(`${baseUrl}/getRank`, {
            params: { name:item.name }
        }).then((res) => {
            setViewDetails({
                name: item.name,
                satScore: item.satScore,
                rank: res.data,
                passed: item.passed
            })
        })
    }

    const handleViewClose = () => {
        setViewDetails(initialViewState)
    }

    useEffect(() => {
        getStudents();
    }, [])


  return (
    <div className="container">
        <div className="py-4">
        <table className="table table-striped border shadow">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">City</th>
                <th scope="col">Country</th>
                <th scope="col">Pincode</th>
                <th scope="col">Sat Score</th>
                <th scope="col">Result</th>
                </tr>
            </thead>
            <tbody>
                {
                    students.map((item, index) => (
                    <tr>
                        <th scope="row" className="align-middle">{index+1}</th>
                        <td className="align-middle">{item.name}</td>
                        <td className="align-middle">{item.address}</td>
                        <td className="align-middle">{item.city}</td>
                        <td className="align-middle">{item.country}</td>
                        <td className="align-middle">{item.pincode}</td>
                        <td className="align-middle">{item.satScore}</td>
                        <td className="align-middle">{item.passed === true ? "Pass" : "Fail"}</td>
                        <td className="align-middle">
                            <IconButton aria-label="edit" onClick={() => handleOnEdit(item)}>
                                <EditIcon style={{ color: "#0d6efd" }}/>
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => deleteStudent(item)}>
                                <DeleteIcon style={{ color: "#DC3545" }} />
                            </IconButton>
                            <IconButton aria-label="view">
                                <VisibilityIcon style={{ color: "#adb5bd" }} onClick={() => handleOnView(item)}/>
                            </IconButton>
                        </td>
                    </tr>
                    ))
                }
            </tbody>
        </table>
        </div>
        <Modal show={editDetails.name !== "" || editDetails.satScore !== ""} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Edit SAT Score</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <input type='number' 
                    className='form-control' 
                    placeholder='Enter Sat Score' 
                    name='satScore' 
                    value={editDetails.satScore}
                    onChange={(e) => handleOnChange(e)}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}> 
                Close
            </Button>
            <Button variant="primary" onClick={() => handleOnSave()}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={viewDetails.rank !== ""} onHide={handleViewClose}>
            <Modal.Header closeButton>
            <Modal.Title>Hello {viewDetails.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>{viewDetails.passed ? "Congratulations" : "Better Luck Next Time"}</div>
                <div>{`You have ranked ${viewDetails.rank} with score ${viewDetails.satScore}`}</div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleViewClose}> 
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}
