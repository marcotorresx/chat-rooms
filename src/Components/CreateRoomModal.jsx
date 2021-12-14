import React from 'react'
import CloseIcon from '@material-ui/icons/Close'
import {db, storage} from '../Auth/firebase'
import useRooms from '../RoomsData/useRooms'
import useAuth from '../Auth/useAuth'
import {useHistory} from 'react-router-dom'
import shortid from "shortid"
import './CreateRoomModal.css'

const CreateRoomModal = ({close}) => {  
    
    // VARIABLES
    const {user} = useAuth()
    const {userRoomsData, setUserRoomsData, userRoomsIds, setUserRoomsIds} = useRooms()

    const [joinMode, setJoinMode] = React.useState(true)
    const [roomIdValue, setRoomIdValue] = React.useState("")
    const [roomNameValue, setRoomNameValue] = React.useState("")
    const [roomDescriptionValue, setRoomDescriptionValue] = React.useState("")

    const [error, setError] = React.useState(null)
    const [newRoomDataGlobal, setNewRoomDataGlobal] = React.useState({})
    const [roomCreated, setRoomCreated] = React.useState(false)
    const history = useHistory()

    // CHANGE MODAL TYPE
    function changeType(type){
        // Select DOM elements
        const joinBtnType = document.querySelector("#join")
        const createBtnType = document.querySelector("#create")

        // If type is join
        if (type === "join"){
            setJoinMode(true)
            joinBtnType.classList.add("active")
            createBtnType.classList.remove("active")
        }

        // If type is create
        if (type === "create"){
            setJoinMode(false)
            createBtnType.classList.add("active")
            joinBtnType.classList.remove("active")
        }

        setError(null)
    }

    // CLOSE MODAL
    function closeModal(){
        setRoomIdValue("")
        setRoomNameValue("")
        setRoomDescriptionValue("")
        setError(null)
        close()
    }

    // JOIN ROOM
    async function joinRoom(){
        try{
            //Validations
            if (!roomIdValue.trim()){
                setError("Room ID field is empty.")
                return
            }

            // Check if user is already in the room
            var equalId = false
            userRoomsIds.forEach( roomId => {
                if ( roomId === roomIdValue ) equalId = true // Compare the id value with the user room id
            })
            if (equalId){
                setError("You are already in that room.")
                return
            }

            setError(null)

            // Search room in DB
            var roomRes = await db.collection("rooms").doc(roomIdValue).get()

            // If the room doesn't exist
            if (!roomRes.exists){
                setError("Room doesn't exists.")
                return
            }

            // Add new room id to user rooms ids in DB
            await db.collection("users").doc(user.email).update({ rooms: [...userRoomsIds, roomIdValue] })

            // Add room to context
            setUserRoomsIds( [...userRoomsIds, roomIdValue] )
            setUserRoomsData( [...userRoomsData, roomRes.data()] )

            // Close modal and go to room
            closeModal()
            history.push(`/room/${roomIdValue}`)

        }
        catch(error){
            console.log("JOIN ROOM ERROR:", error)
        }
    }

    // CREATE ROOM
    async function createRoom(){
        // Validations
        if (!roomNameValue.trim()){
            setError("Room name field is empty.")
            return
        }
        if (!roomDescriptionValue.trim()){
            setError("Room description field is empty.")
            return
        }

        setError(null)
        
        // Create new room data
        const newRoomId = shortid.generate()
        const newRoomData = {
            name: roomNameValue,
            description: roomDescriptionValue,
            roomID: newRoomId,
            img: "https://firebasestorage.googleapis.com/v0/b/chatrooms-mats.appspot.com/o/room-imgs%2Fbase-img.png?alt=media&token=e807cc15-13e6-4098-bfcf-02f342f43ec0"
        }
        setNewRoomDataGlobal(newRoomData) // Set the data into a global variable

        try {
            // Add new room in DB
            await db.collection("rooms").doc(newRoomId).set(newRoomData)

            // Add new room id to user room ids in DB
            await db.collection("users").doc(user?.email).update({ rooms: [...userRoomsIds, newRoomId] })

            // Add new room data in context
            setUserRoomsIds([...userRoomsIds, newRoomId])
            setUserRoomsData([...userRoomsData, newRoomData])

            // Set room created to true
            setRoomCreated(true)

        }
        catch(error) {
            console.log("CREATE ROOM ERROR:", error)
            setError("Something went wrong.")
            return
        }
    }

    // GO TO CREATED ROOM
    function goToCreatedRoom(){
        closeModal()
        history.push(`/room/${newRoomDataGlobal.roomID}`)
    }

    // CHANGE ROOM PHOTO
    async function changePhoto(e){

        // Select photo from file input
        const photo = e.target.files[0]

        // Validate
        if (photo.type === "image/png" || photo.type === "image/jpeg" || photo.type === "image/jpg"){

            // Upload img to storage
            const imgRef = storage.ref().child("room-imgs").child(newRoomDataGlobal.roomID)
            await imgRef.put(photo)
            const imgURL = await imgRef.getDownloadURL()

            // Change img in the DB
            await db.collection("rooms").doc(newRoomDataGlobal.roomID).update({ img: imgURL })

            // Change img in the modal
            setNewRoomDataGlobal({...newRoomDataGlobal, img: imgURL})

            // Change img in the context
            userRoomsData.forEach( roomData => {
                // Find the correct room
                if ( roomData.roomID === newRoomDataGlobal.roomID ) roomData.img = imgURL
            })

        }
        else{
            console.log("CHANGE ROOM PHOTO ERROR:", error)
        }
    }

    return (
        <div className="create-room-modal-bg">
            <div className="create-room-modal">    

                {/* CLOSE MODAL BUTTON */}
                <CloseIcon onClick={closeModal}/>

                {/* TITLE TYPES */
                !roomCreated ? 
                <>
                    {/* TITLES */}
                    <div className="crm-titles">
                        <div className="crm-title-type active" id="join" onClick={() => changeType("join")}>Join Room</div>
                        <div className="crm-title-type" id="create" onClick={() => changeType("create")}>Create Room</div>
                    </div>

                    {/* ERROR */
                    error && <div className="crm-error">{error}</div> }

                    {/* JOIN FROM */
                    joinMode &&
                    <div className="crm-join-form">
                        <input 
                            className="crm-join-input"
                            type="text" 
                            placeholder="Room Id"
                            value={roomIdValue}
                            onChange={ e => setRoomIdValue(e.target.value)}
                        />
                        <button className="crm-join-btn" onClick={joinRoom}>Join Room</button>
                    </div> }

                    {/* CREATE FROM */
                    !joinMode &&
                    <div className="crm-create-form">
                        <input 
                            className="crm-create-input"
                            type="text" 
                            placeholder="Room Name"
                            value={roomNameValue}
                            onChange={(e) => setRoomNameValue(e.target.value)}
                        />
                        <input 
                            className="crm-create-input"
                            type="text" 
                            placeholder="Room Description"
                            value={roomDescriptionValue}
                            onChange={(e) => setRoomDescriptionValue(e.target.value)}
                        />
                        <button className="crm-create-btn" onClick={createRoom}>Create Room</button>
                    </div>}
                </> 

                 :

                // WHEN ROOM IS CREATED
                <div className="crm-room-created">
                    <h1>Room Created</h1>
                    <img src={newRoomDataGlobal?.img} alt="" />

                    <input 
                        type="file"
                        onChange={changePhoto}
                    />
                    <button>Change Photo</button>

                    <h2>{newRoomDataGlobal?.name}</h2>
                    <p>{newRoomDataGlobal?.description}</p>
                    <button className="cmr-goroom" onClick={goToCreatedRoom}>Go to Room</button>

                </div> }

            </div>
        </div>
    )
}

export default CreateRoomModal
