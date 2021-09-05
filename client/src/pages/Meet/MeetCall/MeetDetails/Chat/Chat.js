import classes from "./Chat.module.css";
import React from 'react'
import { formatDate } from "../../../../../utils/FormatDate";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const Chat = (props) => {
    const [msg, setMsg] = React.useState("");
    const [isShiftActivated, setIsShiftActivated] = React.useState(0)

    const keyPressedHandler = (e) => {
        if (e.key === 'Enter' && msg.length > 0 && !isShiftActivated) {
            e.preventDefault();
            props.sendMessageFunction(msg);
            setMsg("");
        }
    }
    const messageInputChangeHandler = (e) => {
        setMsg(e.target.value);

    }


    const handleSendMsg = () => {
        if (msg !== "") {
            props.sendMessageFunction(msg);
            setMsg("");
        }
    };

    return (
        <div className={classes.chatContainer}>

            <div className={classes.chatSection}>
                {props.messagesList.map((message) => (
                    <div key={message.time} className={classes.chatBlock}>
                        <div className={classes.sender}>
                            {props.currentUserId === message.user._id ? 'You' : message.user.name}
                            <small className={classes.small}>{formatDate(message.time)}</small>
                        </div>
                        <p className={classes.textMessage}>{message.content}</p>
                    </div>
                ))}
            </div>

            {props.canChat ? <div className={classes.sendMsgSection}>
                <TextareaAutosize className={classes.inputMessage}
                    style={{ maxHeight: msg === "" ? '30px' : '200px' }}
                    maxRows={10}
                    onKeyDownCapture={(e) => { e.key === 'Shift' && setIsShiftActivated(true) }}
                    onKeyUpCapture={(e) => { e.key === 'Shift' && setIsShiftActivated(false) }}
                    onKeyPress={keyPressedHandler}
                    onChange={messageInputChangeHandler}
                    placeholder="Send a message to everyone"
                    value={msg} />

                <i className={`fas fa-paper-plane ${classes.icon}`} onClick={handleSendMsg}></i>
            </div> :
                <div className={classes.sendMsgSectionDisabled}>
                    <h5 className={classes.messageDisabledText}>Messaging is disabled by the admin of the room</h5>
                </div>
            }
        </div>
    );
};

export default Chat;
