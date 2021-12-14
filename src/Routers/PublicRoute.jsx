import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import useAuth from '../Auth/useAuth'

const PublicRoute = (props) => {

    const {user} = useAuth()

    // If there is user
    if (user) return <Redirect to="/" />

    // IF USER
    return <Route {...props} />

}

export default PublicRoute
