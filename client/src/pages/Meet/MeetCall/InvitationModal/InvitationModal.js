import React from 'react';
import { Button, Modal } from 'reactstrap';
import classes from './InvitationModal.module.css'
const InvitationModal = (props) => {



    const toggle = () => props.toggle(!props.isOpen);

    return (
        <Modal isOpen={props.isOpen} toggle={() => { }} centered contentClassName={classes.contentClassName}>
            <div className={classes.headerContainer}>
                {props.requestedUsers.length === 1 &&
                    <h5 className={classes.modelHeader} > Someone want to join to this meeting </h5>
                }
                {props.requestedUsers.length > 1 &&
                    <h5 className={classes.modelHeader} > Multiple people want to join to this call </h5>
                }
            </div>
            {props.requestedUsers.length === 1 && <div className={classes.userInfoContainer}>
                <img alt="user profile" className={classes.userImage} src={props.requestedUsers[0].photo} />
                <p className={classes.userNameText}>{props.requestedUsers[0].name}</p>

            </div>}
            {props.requestedUsers.length > 1 &&
                <div>
                    {props.requestedUsers.map((user => (
                        <div className={classes.mainUserItemContainer}>
                            <div className={classes.userInfoContainer}>
                                <img alt="user profile" className={classes.userImage} src={user.photo} />
                                <p className={classes.userNameText}>{user.name}</p>
                            </div>
                            <div className={classes.userInfoContainer}>
                                <Button className={classes.modalButton} style={{ fontSize: '13px' }} color="primary" onClick={() => props.refusePerson(user.socketId)}>Refuse</Button>
                                <Button className={classes.modalButton} style={{ fontSize: '13px' }} color="primary" onClick={() => props.onAcceptPerson(user.socketId)}>Accept</Button>
                            </div>
                        </div>
                    )))}
                </div>
            }

            {props.requestedUsers.length === 1 && <div className={classes.modalFooter}>
                <Button className={classes.modalButton} color="primary" onClick={toggle}>Refuse</Button>
                <Button className={classes.modalButton} color="primary" onClick={props.onAcceptAll}>Accept</Button>
            </div>}

            {props.requestedUsers.length > 1 && <div className={classes.modalFooter}>
                <Button className={classes.modalButton} color="primary" onClick={toggle}>Refuse all</Button>
                <Button className={classes.modalButton} color="primary" onClick={props.onAcceptAll}>Accept all</Button>
            </div>}
        </Modal>
    );
}

export default InvitationModal;