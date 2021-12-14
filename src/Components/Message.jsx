import React from 'react'
import './Message.css'

const Message = ({data, uid}) => {

    const [userMsg, setUserMsg] = React.useState(false)
    const [userChecked, setUserChecked] = React.useState(false)

    // CHECK MSG USER
    React.useEffect(() => {

        // If the msg user is equal to the actual user
        if (uid === data?.uid) setUserMsg(true) // Set true
        else setUserMsg(false) // If not set false

        // Let render the msg
        setUserChecked(true)

    }, [data, uid])

    return (
        userChecked &&
        <div className={`msg-container ${userMsg ? "yesuser" : "notuser"}`}>

            {/* USER IMG */}
            <img className={`msgs-user-img ${userMsg ? "yesuser" : "notuser"}`} src={data?.userImg} alt="" />
            
            {/* USER DATA */}
            <div className={`msg-user-data ${userMsg ? "yesuser" : "notuser"}`}>
                <p className={`msg-username ${userMsg ? "yesuser" : "notuser"}`}>{data?.username}</p>
                <p className={`msg-msg ${userMsg ? "yesuser" : "notuser"}`}>{data?.msg}</p>
                <p className={`msg-date ${userMsg ? "yesuser" : "notuser"}`}>{ ( new Date(data?.date?.toDate()).toUTCString() ).substring(5,22) }</p>
            </div>

        </div>
    )
}

export default Message