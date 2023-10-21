import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { baseUrl, initialStudentState } from '../common/common';

export default function AddStudent() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(initialStudentState)
    const [errorMessage, setErrorMessage] = useState("")

    const onInputChange = (e) => {
        setStudent({...student, [e.target.name]: e.target.value})
    }

    const onSubmitForm = async(e) => {
        e.preventDefault();

        validateDetails();

        await axios.post(`${baseUrl}/add`, {
            ...student, "satScore" : parseInt(student.satScore)
        })

        navigate("/")
    }

    const validateDetails = () => {
        // Basic validation
        const errors = []
        if (student.name === '') {
            errors.push("Name")
        }
        if (student.address === '') {
            errors.push("Address")
        }
        if (student.city === '') {
            errors.push("City")
        }
        if (student.country === '') {
            errors.push("Country")
        }
        if (student.pincode === '') {
            errors.push("Pincode")
        }
        if (student.satScore === "") {
            errors.push("Sat Score")
        }

        getErrorMessage(errors)
    }

    const getErrorMessage = (error) => {
        let str = "";
        const size = error?.length;
        if (size === 0) {
            setErrorMessage("")
            return
        }
        error.map((item, index) => {
            str = str + item + `${index !== size-1 ? ", " : " "}`;
        })

        str = str + `${size === 1 ? "is" : "are"}` + " required"
        setErrorMessage(str);
    }

  return (
    <div className="container">
        {errorMessage && <div class="alert alert-danger" role="alert">
            {errorMessage}
        </div>}
        <div className="row">
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h2 className="text-center m-4">Add User</h2>
                <form onSubmit={(e) => onSubmitForm(e)}>
                <div className="mb-3">
                    <input type='text' className='form-control' placeholder='Enter Name' name='name' value={student.name} onChange={(e) => onInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <input type='text' className='form-control' placeholder='Enter Address' name='address' value={student.address} onChange={(e) => onInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <input type='text' className='form-control' placeholder='Enter City' name='city' value={student.city} onChange={(e) => onInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <input type='text' className='form-control' placeholder='Enter Country' name='country' value={student.country} onChange={(e) => onInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <input type='text' className='form-control' placeholder='Enter Pincode' name='pincode' value={student.pincode} onChange={(e) => onInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <input type='number' className='form-control' placeholder='Enter Sat Score' name='satScore' value={student.satScore} onChange={(e) => onInputChange(e)}/>
                </div>
                <button type='submit' className='btn btn-outline-primary'>Submit</button>
                <Link className='btn btn-outline-danger mx-2' to='/'>Cancel</Link>
                </form>
            </div>
        </div>
    </div>
  )
}
