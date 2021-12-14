import React, {createContext} from 'react'
import {useHistory} from 'react-router-dom'
import {auth, provider} from './firebase'

export const AuthContext = createContext()

const AuthProvider = ({children}) => {

    // VARIABLES
    const [user, setUser] = React.useState(null)
    const [userLoaded, setUserLoaded] = React.useState(false)
    const history = useHistory()

    // USE EFFECT
    React.useEffect( () => {

        // Check of there is a user session
        auth.onAuthStateChanged( user => {

            // Set user
            if (user) setUser(user)
            else setUser(null)

            // Set loaded user
            setUserLoaded(true)

        })

    }, [user])

    // LOGIN
    function login(){
        try {
            // Sign In with Google Provider
            auth.signInWithPopup(provider)

            // Set user on context
            auth.onAuthStateChanged( user => {
                if (user) setUser(user)
                else setUser(null)
                history.push("/")
            })
        }
        catch (error){
            console.log("LOGIN ERROR:", error)
        }
    }

    // LOGOUT
    function logout(){
        auth.signOut()
    }

    // CONTEXT VALUES
    const contextValues = {
        user,
        login,
        logout,
        userLoaded
    }

    return (
        userLoaded ?
        // App
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
        :
        // Loading
        <div className="app-loading">
            <img src="/loading.gif" alt="Loading"/>
        </div>
    )
}

export default AuthProvider
