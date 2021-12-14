import React, { createContext } from 'react'
import useAuth from '../Auth/useAuth'
import {db} from '../Auth/firebase'

export const RoomsContext = createContext()

const RoomsProvider = ({children}) => {

    const {user} = useAuth()
    const [userRoomsIds, setUserRoomsIds] = React.useState([])
    const [userRoomsData, setUserRoomsData] = React.useState([])
    const [roomsLoaded, setRoomsLoaded] = React.useState(false)

    // USE EFFECT
    React.useEffect(() => {

        // SEARCH USER ROOMS
        async function searchRooms(){
            
            // If there is a user search rooms
            if (user){
                try {
                    // Get from DB the room ids of the user
                    const userRoomsIdsRes = await db.collection("users").doc(user.email).get()

                    // If the data exists
                    var userRoomsIds
                    if (userRoomsIdsRes.exists){
                        userRoomsIds = userRoomsIdsRes.data().rooms // Get the room ids
                        setUserRoomsIds(userRoomsIds) // Set the room ids
                    }

                    // If data doesn't exists
                    else {
                        await db.collection("users").doc(user.email).set({ rooms: [] }) // Set rooms in DB to []
                        setUserRoomsIds([]) // Set room ids in context to []
                    }

                    // Get from DB the room data of each room id
                    var userRoomsData = []
                    userRoomsIds.forEach( async roomId => {
                        // Get the room data
                        const roomDataRes = await db.collection("rooms").doc(roomId).get();

                        // Add to array
                        userRoomsData.push( roomDataRes.data() )
                    })

                    // Set user rooms data
                    setUserRoomsData(userRoomsData)

                    // Set rooms loaded true
                    setTimeout( () => setRoomsLoaded(true), 300)
                    
                }

                catch(error){
                    console.log("LOAD ROOMS DATA ERROR:", error)
                }
            }

            // If there is no user
            else {
                setUserRoomsIds([])
                setUserRoomsData([])
                setRoomsLoaded(true)
            }

        }

        searchRooms()

    }, [user])
    

    // CONTEXT VALUES
    const contextValues = {
        userRoomsIds,
        setUserRoomsIds,
        userRoomsData,
        setUserRoomsData,
        roomsLoaded
    }

    return (
        roomsLoaded ?
        // App
        <RoomsContext.Provider value={contextValues}>
            {children}
        </RoomsContext.Provider>
        :
        // Loading
        <div className="app-loading">
            <img src="/loading.gif" alt="Loading"/>
        </div>
    )
}

export default RoomsProvider
