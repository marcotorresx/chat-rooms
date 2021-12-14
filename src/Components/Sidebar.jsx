import React from 'react'
import ForumIcon from '@material-ui/icons/Forum'
import AddIcon from '@material-ui/icons/Add'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import useAuth from '../Auth/useAuth'
import useRooms from '../RoomsData/useRooms'
import CreateRoomModal from './CreateRoomModal'
import {NavLink} from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {

    // VARIABLES
    const {logout, user} = useAuth()
    const {userRoomsData} = useRooms()
    const [activeMode, setActiveMode] = React.useState(true)

    // CREATE ROOM MODAL
    const [isOpenRoomModal, setIsOpenRoomModal] = React.useState(false)
    const openRoomModal = () => setIsOpenRoomModal(true)
    const closeRoomModal = () => setIsOpenRoomModal(false)

    return (
        <div className="sidebar">

            {/* BRAND */}
            <div className="sb-brand">
                <ForumIcon/>
                <p>ChatRooms</p>
            </div>

            {/* USER INFO */}
            <div className="sb-user-info">

                <div className="sb-user-info-img">
                    <img src={user?.photoURL} alt="User Img" />
                    <div className={`sb-active-circle ${ activeMode ? "active" : "inactive" }`}></div>
                </div>

                <h1>{user?.displayName}</h1>

                <select onChange={ e => e.target.value === "active" ? setActiveMode(true) : setActiveMode(false) }>
                    <option className="option" value="active">active</option>
                    <option className="option" value="inactive">inactive</option>
                </select>

                <ExitToAppIcon onClick={logout}/>

            </div>

            {/* ROOMS HEADER */}
            <div className="sb-rooms-header">

                <p>My Rooms</p>

                {/* NEW ROOM MODAL */}
                <AddIcon onClick={openRoomModal}/>
                { isOpenRoomModal &&
                <CreateRoomModal close={closeRoomModal} /> }

            </div>

            {/* ROOMS */}
            <div className="sb-rooms">

                { userRoomsData.length < 1 && 
                <p className="sb-no-rooms-text">There are no Rooms</p> }

                { userRoomsData.map( (room, i) => (

                    // Room Item
                    <NavLink className="sb-room" key={i} to={`/room/${room?.roomID}`}>

                        <img src={room?.img} alt="Room Img" />
                        <div className="sb-room-info">
                            <h2>{room?.name}</h2>
                            <p>{room?.description}</p>
                        </div>

                    </NavLink>

                )) }

            </div>
        </div>
    )
}

export default Sidebar
