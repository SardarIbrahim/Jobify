import React, { useContext, useReducer } from 'react'
import axios from 'axios'

import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_BEGIN,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_SUCCESS,
  GET_JOBS_BEGIN,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  EDIT_JOB_BEGIN,
} from './actions'
import reducer from './reducers'

// load initially from localStorage
const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,

  // job related
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',

  // job location
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'iternship'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',

  // jobsx
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // axios setup
  const authFetch = axios.create({
    baseURL: '/api/v1',
  })

  authFetch.defaults.headers.common['Authorization'] = `Bearer ${state.token}`

  //  It is useful to check response status code for every response that is being received. Interceptors are methods which are triggered before or after the main method. {specifically we are looking for 401}

  // request interceptors -> we wanna add header token before sending off the request
  // authFetch.interceptors.request.use(
  //   (config) => {
  //     // do something before request is sent
  //     config.headers.common['Authorization'] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // response interceptors -> tackling the 401 error in a better way
  authFetch.interceptors.response.use(
    (response) => {
      // any status codes of 2xx will cause the func to trigger
      return response
    },
    (error) => {
      // any status codes outside of 2xx will cause the func to trigger
      if (error.response.status === 401) {
        logoutUser()
      }
      return Promise.reject(error)
    }
  )

  // display the alert
  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT })
    clearAlert()
  }

  // clear the alert
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT })
    }, 2000)
  }

  // toggle sidebar
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  // add to localStorage
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('location', location)
  }

  // remove from localStorage
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('location')
  }

  // one function for both login and register
  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN })

    try {
      const response = await axios.post(`api/v1/auth/${endPoint}`, currentUser)
      const { user, token, location } = response.data

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText },
      })

      // persist data in local storage
      addUserToLocalStorage({ user, token, location })
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  // logout
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER })
    removeUserFromLocalStorage()
  }

  // update user
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN })
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser)

      const { user, location, token } = data

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      })

      addUserToLocalStorage({ user, location, token })
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: {
            msg: error.response.data.msg,
          },
        })
      }
    }

    clearAlert()
  }

  // jobs
  const handleChange = ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: { name, value },
    })
  }

  // clear inputs
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES })
  }

  // create jobs
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN })

    try {
      const { position, company, jobLocation, jobType, status } = state

      await authFetch.post('/jobs', {
        company,
        position,
        jobLocation,
        jobType,
        status,
      })
      dispatch({ type: CREATE_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  // get jobs

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    if (search) {
      url = url + `&search=${search}`
    }
    dispatch({ type: GET_JOBS_BEGIN })
    try {
      const { data } = await authFetch(url)
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } })
  }

  // edit job
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN })

    try {
      const { position, company, jobLocation, jobType, status } = state
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      })
      dispatch({ type: EDIT_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN })
    try {
      await authFetch.delete(`/jobs/${jobId}`)
      getJobs()
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
