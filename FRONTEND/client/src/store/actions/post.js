import axios from "axios";
import { setAlert } from "./alert";
import { ADD_POST, DELETE_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";

export const getPosts = () => async dispatch => {
    try {
        const response = await axios.get('/api/posts')

        dispatch({ type: GET_POSTS, payload: response.data })
    } catch (err) {
        dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const addLike = (postId) => async dispatch => {
    try {
        const response = await axios.put(`/api/posts/like/${postId}`)

        dispatch({ type: UPDATE_LIKES, payload: { postId, likes: response.data } })
    } catch (err) {
        dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const removeLike = (postId) => async dispatch => {
    try {
        const response = await axios.put(`/api/posts/unlike/${postId}`)

        dispatch({ type: UPDATE_LIKES, payload: { postId, likes: response.data } })
    } catch (err) {
        dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const deletePost = (postId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}`)

        dispatch({ type: DELETE_POST, payload: postId })
        dispatch(setAlert('Post Removed', 'danger'))
    } catch (err) {
        dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}

export const addPost = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await axios.post('/api/posts', formData, config )

        dispatch({ type: ADD_POST, payload: response.data })
        dispatch(setAlert('Post Created', 'success'))
    } catch (err) {
        dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
    }
}