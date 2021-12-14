import React from 'react'
import Sidebar from '../Components/Sidebar'
import './Layout.css'

const Layout = ({children}) => {
    return (
        <div className="layout">
            <Sidebar/>
            {children}
        </div>
    )
}

export default Layout
