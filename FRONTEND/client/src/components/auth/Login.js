import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../store/actions/auth';
import Alert from '../layout/Alert';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
    const onSubmit = e => {
        e.preventDefault()
        login(email, password)
    }

    if (isAuthenticated) {
        return <Navigate to="/"/>
    }

    return <Fragment>
        <section className="container">
            <Alert/>
            <h1 className="large text-primary">Login</h1>
            <p className="lead"><i className="fas fa-user"></i> Login to Your Account</p>
            <form className="form" onSubmit={onSubmit} >
                <div className="form-group">
                    <input value={email} onChange={onChange} type="email" placeholder="Email Address" name="email" required />
                </div>
                <div className="form-group">
                    <input value={password} onChange={onChange}
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign In</Link>
            </p>
        </section>
    </Fragment>
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect( mapStateToProps , { login })(Login)