import React from 'react'
import SendIcon from '@material-ui/icons/Send'
import {useParams} from 'react-router-dom'
import useRooms from '../RoomsData/useRooms'
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline'
import {db} from '../Auth/firebase'
import Message from '../Components/Message'
import useAuth from '../Auth/useAuth'
import firebase from 'firebase'
import RoomModal from '../Components/RoomModal'
import './Room.css'

const Room = () => {

    const {roomID} = useParams()
    const {user} = useAuth()
    const {userRoomsData, roomsLoaded} = useRooms()
    const [roomData, setRoomData] = React.useState(null)
    const [roomMsgs, setRoomsMsgs] = React.useState([])
    const [msgInput, setMsgInput] = React.useState("")

    // ROOM MODAL
    const [isOpenRoomModal, setIsOpenRoomModal] = React.useState(false)
    const openRoomModal = () => setIsOpenRoomModal(true)
    const closeRoomModal = () => setIsOpenRoomModal(false)
    

    // USE EFFECT
    React.useEffect( () => {

        // LOAD ROOM DATA
        async function loadRoomData(){
            try{
                // Find room data in context
                userRoomsData.forEach( roomData => {
                    if (roomData.roomID === roomID) setRoomData(roomData)
                })

                // Snapshot at messages in DB
                db.collection("rooms").doc(roomID).collection("msgs")
                    .orderBy("date", "desc")
                    .onSnapshot( snapshot => {
                        setRoomsMsgs( snapshot.docs.map( doc => doc.data() ) ) // Set messages with every message change
                    })
                    
            }
            catch(error){
                console.log("LOADING ROOM DATA ERROR:", error)
            }
        }

        loadRoomData()

    }, [userRoomsData, roomsLoaded, roomID])

    // SEND MESSAGE
    async function sendMsg(e){
        e.preventDefault()

        // Validations
        if (!msgInput.trim()){
            console.log("Message is empty.")
            return
        }

        // Create new message object
        const new_msg = {
            msg: msgInput,
            username: user?.displayName,
            uid: user?.uid,
            userImg: user?.photoURL,
            date: firebase.firestore.FieldValue.serverTimestamp()
        }

        // Add new message to DB
        try{
            await db.collection("rooms").doc(roomID).collection("msgs").add(new_msg)
        }
        catch(error){
            console.log("SEND MSG ERROR:", error)
        }

        // Clean input
        setMsgInput("")
    }

    return (
        <div className="room">

            {/* ROOM MODAL */
            isOpenRoomModal && <RoomModal data={roomData} close={closeRoomModal}/> }

            <div className="room-container">

                {/* HEADER */}
                <div className="room-header">
                    <h1 className="room-title">{roomData?.name}</h1>
                    <ViewHeadlineIcon onClick={openRoomModal}/>
                </div>

                {/* MESSAGES */}
                <div className="room-msgs-container">
                    { roomMsgs.map( (msg, i) => (
                        <Message data={msg} uid={user?.uid} key={i}/>
                    )) }
                </div>

                {/* INPUT */}
                <div className="room-input-container">
                    <form className="room-input-group" onSubmit={sendMsg}>
                        <input 
                            type="text" 
                            placeholder="Write your message..."
                            onChange={ e => setMsgInput(e.target.value) }
                            value={msgInput}
                        />
                        <button type="submit">
                            <SendIcon/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Room
