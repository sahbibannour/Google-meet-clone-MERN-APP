import React from 'react'
import classes from './Participants.module.css'
function Participants(props) {

    const isPinnedPeer = (peerId) => {
        return peerId === props.pinnedPeerId
    }
    return (
        <div className={classes.mainContainer}>
            <div className={classes.participantContainer} >
                <div className={classes.participantInfoContainer}>
                    <div className={classes.participantImageContainer}>
                        <img className={classes.participantImage} alt="participant" src={props.currentUser.profileImage} />
                    </div>
                    <div className={classes.participantNameContainer}>
                        <h5 className={classes.nameText}>(You) {props.currentUser.name || `${props.currentUser.firstName} ${props.currentUser.lastName}`}</h5>
                    </div>
                </div>
                {!isPinnedPeer('current') ? <div style={{ cursor: 'pointer' }} onClick={() => props.pinUserFunction('current')}>
                    <i className={`fas fa-thumbtack ${classes.pinIcon}`} ></i>
                </div> :
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => props.unPinUserFunction('current')}>
                        <div className={classes.pinIconSlash}>/</div>
                        <i className={`fas fa-thumbtack ${classes.pinIcon}`} ></i>
                    </div>
                }

            </div>
            {props.participants.map(participant => (
                <div className={classes.participantContainer} key={participant.peer._id}>
                    <div className={classes.participantInfoContainer}>
                        <div className={classes.participantImageContainer}>
                            <img className={classes.participantImage} alt="participant" src={participant.user.profileImage} />
                        </div>
                        <div className={classes.participantNameContainer}>
                            <h5 className={classes.nameText}>{participant.user.name || `${participant.user.firstName} ${participant.user.lastName}`}</h5>
                        </div>
                    </div>
                    {!isPinnedPeer(participant.peer._id) ? <div style={{ cursor: 'pointer' }} onClick={() => props.pinUserFunction(participant.peer._id)}>
                        <i className={`fas fa-thumbtack ${classes.pinIcon}`}></i>
                    </div> :
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => props.unPinUserFunction(participant.peer._id)}>
                            <div className={classes.pinIconSlash}>/</div>
                            <i className={`fas fa-thumbtack ${classes.pinIcon}`} ></i>
                        </div>
                    }

                </div>
            ))}
        </div>
    )
}

export default Participants
