import React from 'react'
import './LoginPage.css'
import ForumIcon from '@material-ui/icons/Forum'
import useAuth from '../Auth/useAuth'

const LoginPage = () => {

    const {login} = useAuth()

    return (
        <div className="login">
            <div className="login-container">

                {/* BRAND */}
                <h1 className="login-brand">
                    <ForumIcon className="login-icon"/>
                    <p>ChatRooms</p>
                </h1>

                {/* BUTTON */}
                <button className="login-btn" onClick={login}>
                    <p>Join With Google</p>
                    <img src="/google.png" alt="Google" width="20px"/>
                </button>

            </div>
            <div className="circle"></div>
        </div>
    )
}

export default LoginPage
