import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../store/actions/alert'
import { register } from '../../store/actions/auth'
import Alert from '../layout/Alert'

const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })
    const { name, email, password, password2 } = formData
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
    const onSubmit = e => {
        e.preventDefault()
        if ( password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            register({ name, email, password })
        }
    }

    if (isAuthenticated) {
        return <Navigate to="/"/>
    }

    return <Fragment>
        <section className="container">
            <Alert/>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={onSubmit} >
                <div className="form-group">
                    <input value={name} onChange={onChange} type="text" placeholder="Name" name="name" required />
                </div>
                <div className="form-group">
                    <input value={email} onChange={onChange} type="email" placeholder="Email Address" name="email" required />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                        Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input value={password} onChange={onChange}
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength='8'
                    />
                </div>
                <div className="form-group">
                    <input value={password2} onChange={onChange}
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength='8'
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </section>
    </Fragment>
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, register })(Register)