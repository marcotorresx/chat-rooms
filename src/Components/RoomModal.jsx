import React from 'react'
import './RoomModal.css'
import CloseIcon from '@material-ui/icons/Close'
import useRooms from '../RoomsData/useRooms'
import {db, storage} from '../Auth/firebase'
import {useHistory} from 'react-router-dom'
import useAuth from '../Auth/useAuth'

const RoomModal = ({data, close}) => {

    const {user} = useAuth()
    const {userRoomsData, userRoomsIds, setUserRoomsIds, setUserRoomsData} = useRooms()
    const [roomImg, setRoomImg] = React.useState(data?.img)
    const history = useHistory()

    // CHANGE PHOTO
    async function changePhoto(e){

        // Select photo from file input
        const photo = e.target.files[0]

        // Validations
        if (photo.type === "image/png" || photo.type === "image/jpeg" || photo.type === "image/jpg"){
            
            // Upload Img to Storage
            const imgRef = storage.ref().child("room-imgs").child(data?.roomID)
            await imgRef.put(photo)
            const imgURL = await imgRef.getDownloadURL()

            // Change img in the modal
            setRoomImg(imgURL)

            try{
                // Change img in the DB
                await db.collection("rooms").doc(data?.roomID).update({ img: imgURL })

                // Change img in the context
                userRoomsData.forEach( roomData => {
                    if (roomData?.roomID === data?.roomID) roomData.img = imgURL
                })
            }
            catch(error){
                console.log("CHANGE ROOM PHOTO ERROR:", error)
            }

        }
        else{
            alert("Images types can only be png, jpeg, jpg")
            return
        }
    }

    // LEAVE ROOM
    async function leaveRoom(){
        try{
            // Filter context
            const userRoomsDataFilter = userRoomsData.filter( roomData => roomData?.roomID !== data?.roomID)
            const userRoomsIdsFilter = userRoomsIds.filter( roomID => roomID !== data?.roomID)
            setUserRoomsData(userRoomsDataFilter)
            setUserRoomsIds(userRoomsIdsFilter)

            // Change user room ids in DB
            await db.collection("users").doc(user?.email).update({ rooms: userRoomsIdsFilter })

            // Go to Home
            history.push("/")
        }
        catch(error){
            console.log("LEAVE ROOM ERROR:", error)
        }
    }

    return (
        <div className="room-modal-bg">
            <div className="room-modal-container">
                
                {/* CLOSE BUTTON */}
                <CloseIcon onClick={close}/>

                {/* TITLE */}
                <h1>{data?.name}</h1>

                {/* IMG */}
                <img src={roomImg} alt="Room Img"/>
                <input type="file" onChange={changePhoto}/>
                <button className="rm-change-btn">Change Photo</button>

                {/* DESCRIPTION */}
                <p className="rm-description">{data?.description}</p>

                {/* ROOM ID */}
                <p className="rm-roomid">Room ID: {data?.roomID}</p>

                {/* LEAVE ROOM */}
                <button className="rm-leave-btn" onClick={leaveRoom}>Leave Room</button>

            </div>
        </div>
    )
}

export default RoomModal
