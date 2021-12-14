import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import useAuth from '../Auth/useAuth'

const PrivateRoute = (props) => {

    const {user} = useAuth()

    // If there is no user
    if (!user) return <Redirect to="/login" />

    // If there is user
    return <Route {...props} />

}

export default PrivateRoute
