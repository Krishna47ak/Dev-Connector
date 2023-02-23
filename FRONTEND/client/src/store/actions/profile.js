import axios from "axios";
import { setAlert } from "./alert";
import { ACCOUNT_DELETED, CLEAR_PROFILE, GET_PROFILE, GET_PROFILES, GET_REPOS, PROFILE_ERROR, UPDATE_PROFILE } from "./types";

export const getCurrentProfile = () => async dispatch => {
    try {
        const response = await axios.get('/api/profile/me')

        dispatch({ type: GET_PROFILE, payload: response.data })
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    try {
        const response = await axios.get('/api/profile')

        dispatch({ type: GET_PROFILES, payload: response.data })
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const getProfileById = (userId) => async dispatch => {
    try {
        const response = await axios.get(`/api/profile/user/${userId}`)

        dispatch({ type: GET_PROFILE, payload: response.data })
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const getGitHubRepos = (username) => async dispatch => {
    try {
        const response = await axios.get(`/api/profile/github/${username}`)

        dispatch({ type: GET_REPOS, payload: response.data })
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await axios.post('/api/profile', formData, config)
        dispatch({ type: GET_PROFILE, payload: response.data })
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

        if (!edit) {
            history('/dashboard')
        }
    } catch (err) {
        const errors = err.response.data.errors
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await axios.put('/api/profile/experience', formData, config)
        dispatch({ type: UPDATE_PROFILE, payload: response.data })
        dispatch(setAlert('Experience Added', 'success'))

        history('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await axios.put('/api/profile/education', formData, config)
        dispatch({ type: UPDATE_PROFILE, payload: response.data })
        dispatch(setAlert('Education Added', 'success'))

        history('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const deleteExperience = (id) => async dispatch => {
    try {
        const response = await axios.delete(`/api/profile/experience/${id}`)
        dispatch({ type: UPDATE_PROFILE, payload: response.data })
        dispatch(setAlert('Experience Deleted', 'danger'))
    } catch (err) {
        const errors = err.response.data.errors
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const deleteEducation = (id) => async dispatch => {
    try {
        const response = await axios.delete(`/api/profile/education/${id}`)
        dispatch({ type: UPDATE_PROFILE, payload: response.data })
        dispatch(setAlert('Education Deleted', 'danger'))
    } catch (err) {
        const errors = err.response.data.errors
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
        try {
            const response = await axios.delete('/api/profile')
            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: ACCOUNT_DELETED  })
            dispatch(setAlert('Your account has been permanantly deleted', 'danger'))
        } catch (err) {
            const errors = err.response.data.errors
            if (errors) {
                errors.forEach(error => {
                    dispatch(setAlert(error.msg, 'danger'))
                });
            }
            dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }
}