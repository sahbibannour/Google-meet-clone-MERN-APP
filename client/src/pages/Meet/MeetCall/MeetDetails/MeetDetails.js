import classes from "./MeetDetails.module.css";
import React from 'react'
import Chat from "./Chat/Chat";
import Participants from "./Participants/Participants";
import { Row, Col } from 'reactstrap'
const MeetDetails = (props) => {

    return (
        <Row className={classes.mainContainer}>
            <Col className={classes.messengerContainer}>
                <Row >
                    <Col className={classes.messengerHeader}>
                        <h3 className={classes.mainTitle}>Meeting details</h3>
                        <i
                            className={`fas fa-times ${classes.icon}`}
                            onClick={() => {
                                props.setIsOpenMessenger(0);
                            }}
                        ></i>
                    </Col>
                </Row>

                <Row className={classes.messengerHeaderTabs}>
                    <Col className={classes.tab} style={{ borderBottom: props.isOpenMessenger === 1 ? '2px solid #007fff' : 'none' }} onClick={() => props.setIsOpenMessenger(1)}>
                        <i className={`fas fa-user-friends ${classes.icon}`}></i>
                        <p className={classes.navHeaderItem}>People ({props.participants.length + 1})</p>
                    </Col>
                    <Col className={classes.tab} style={{ borderBottom: props.isOpenMessenger === 2 ? '2px solid #007fff' : 'none' }} onClick={() => props.setIsOpenMessenger(2)}>
                        <i className={`fas fa-comment-alt ${classes.icon}`}></i>
                        <p className={classes.navHeaderItem}>Chat</p>
                    </Col>
                </Row>
                <Row className={classes.contentContainer}>
                    <Col style={{ padding: 0 }}>
                        {props.isOpenMessenger === 1 && < Participants pinnedPeerId={props.pinnedPeerId} currentUser={props.currentUser} participants={props.participants} unPinUserFunction={props.unPinUserFunction} pinUserFunction={props.pinUserFunction} />}
                        {props.isOpenMessenger === 2 && <Chat messagesList={props.messagesList} currentUserId={props.currentUser._id} sendMessageFunction={props.sendMessageFunction} />}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default MeetDetails;
