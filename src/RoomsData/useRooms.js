import {useContext} from 'react'
import {RoomsContext} from './RoomsProvider'

export default function useRooms() {
    return ( useContext(RoomsContext) )
}
