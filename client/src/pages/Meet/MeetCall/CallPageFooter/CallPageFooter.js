import React from 'react'
import classes from "./CallPageFooter.module.css";
import { Row, Col } from 'reactstrap';
import { formatDate } from "../../../../utils/FormatDate";

const CallPageFooter = (props) => {


    const interval = React.useRef();
    const [currentTime, setCurrentTime] = React.useState(() => {
        return formatDate();
    });

    React.useEffect(() => {
        interval.current = setInterval(() => setCurrentTime(formatDate()), 1000);
        return () => {
            clearInterval(interval.current);
        };
    }, []);

    const screenUnShareScreenHandler = () => {
        if (props.isPresenting)
            props.stopScreenShareFunction()
        else
            props.screenShareFunction()
    }
    return (
        <Row className={classes.footerItem}>
            <Col className={classes.centerItem}>
                <div className={classes.headerItems} onClick={() => props.setOpenParticipants(1)}>
                    <h5 className={classes.meetInfoText}>{`${props.roomId}  |  ${currentTime}`}</h5>

                </div>

            </Col>
            <Col xs='12' md="6" lg="4" className={classes.centerItem}>

                <Row>
                    <Col xs="4" md="2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0px' }}>
                        <div className={classes.centerItemIconBlock}
                            onClick={props.showHideMeetingDetailsFunction}>

                            <i className={`fas fa-info ${classes.centerItemIcon}`} ></i>

                        </div>

                    </Col>
                    <Col xs="4" md="2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0px' }}>
                        <div
                            className={`${classes.centerItemIconBlock} ${!props.isAudio ? classes.redBg : null}`}
                            onClick={() => props.toggleAudioFunction(!props.isAudio)}
                        >
                            <i className={`${props.isAudio ? 'fas fa-microphone' : `fas fa-microphone-slash`} ${classes.centerItemIcon}`}></i>
                        </div>

                    </Col>
                    <Col xs="4" md="2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0px' }}>
                        <div className={`${classes.centerItemIconBlock} ${!props.isVideo ? classes.redBg : null}`}
                            onClick={() => props.toggleVideoFunction(!props.isVideo)}>
                            <i className={` ${props.isVideo ? 'fas fa-video' : `fas fa-video-slash`} ${classes.centerItemIcon}`} ></i>
                        </div>


                    </Col>
                    <Col xs="4" md="2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0px' }}>

                        <div className={`${classes.centerItemIconBlock} ${props.isPresenting ? classes.activeBgIcon : null}`}
                            onClick={screenUnShareScreenHandler}>

                            <i className={` ${!props.isPresenting ? 'fas fa-desktop' : `fas fa-desktop ${classes.activeShare}`} ${classes.centerItemIcon}`} ></i>

                        </div>
                    </Col>
                    <Col xs="4" md="2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0px' }}>
                        <div className={classes.centerItemIconBlockPhone} onClick={props.disconnectCallFunction}>
                            <i className={`fas fa-phone ${classes.centerItemIcon}`} ></i>
                        </div>

                    </Col>
                    <Col xs="4" md="2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0px' }}>

                        <div className={`${classes.centerItemIconBlock}`}
                            onClick={props.toggleSettingsFunction}>
                            <i className={`fas fa-ellipsis-v ${classes.centerItemIcon}`} ></i>
                        </div>
                    </Col>
                </Row>
            </Col>
            <Col className={classes.centerItem}>
                <div className={classes.headerItems} style={{ position: 'relative' }} onClick={() => props.setOpenParticipants(1)}>
                    {props.participants.length > 0 && <div className={classes.badgeContainer}>
                        <h5 className={classes.badgeText}>{props.participants.length}</h5>
                    </div>}
                    <i className={`fas fa-user-friends ${classes.icon} ${props.isOpenMessenger === 1 ? classes.activeIcon : ''}`}></i>
                </div>
                <div
                    className={`${classes.headerItems} ${classes.iconBlock}`}
                    onClick={() => {
                        props.setIsOpenMessenger(2);
                        props.setNotification(null);
                    }}
                >
                    <i className={`fas fa-comment-alt ${classes.icon} ${props.isOpenMessenger === 2 ? classes.activeIcon : ''}`}></i>

                    {!props.isOpenMessenger && props.notification &&
                        <span className={classes.alertCircleIcon}></span>
                    }
                </div>
                <div className={classes.headerItems}>
                    <img src={props.userImage} alt="participant" className={classes.userImage} />
                </div>
            </Col>
        </Row>
    );
};


export default CallPageFooter;
