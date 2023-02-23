import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './store/actions/auth';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store} >
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Landing />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route element={<PrivateRoute />} >
              <Route exact path='/dashboard' element={<Dashboard />} />
              <Route exact path='/create-profile' element={<CreateProfile />} />
              <Route exact path='/edit-profile' element={<EditProfile />} />
              <Route exact path='/add-experience' element={<AddExperience />} />
              <Route exact path='/add-education' element={<AddEducation />} />
            </Route>
          </Routes>
        </Fragment>
      </Router >
    </Provider>
  )
}

export default App;
