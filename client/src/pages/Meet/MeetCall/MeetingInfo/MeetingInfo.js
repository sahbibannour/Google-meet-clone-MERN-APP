import React from 'react'
import classes from "./MeetingInfo.module.css";

const MeetingInfo = (props) => {

    const copyUrlHandler = () => {
        navigator.clipboard.writeText(props.url)
    }
    return (
        <div className={classes.meetingInfoBlock}>
            <div className={classes.meetingHeader}>
                <h3 className={classes.title}>Your meeting's ready</h3>
                <i className={`fas fa-times ${classes.timesIcon}`} onClick={() => { props.setMeetInfoPopup(false); }}></i>
            </div>
            <button className={classes.addPeopleBtn}>
                <i className={`fas fa-user ${classes.personIcon}`} ></i>
                Add Others
            </button>
            <p className={classes.infoText}>
                Or share this meeting link with others you want in the meeting
            </p>
            <div className={classes.meetLink}>
                <span className={classes.urlText}>{props.url}</span>
                <i className={`fas fa-copy ${classes.copyIcon}`} onClick={copyUrlHandler}></i>
            </div>
            <div className={classes.permissionText}>
                <i className={`fas fa-shield-virus ${classes.permissionIcon} ${classes.red}`} ></i>
                <p className={classes.smallText}>
                    People who use this meeting link must get your permission before they
                    can join.
                </p>
            </div>
            <p className={classes.smallText}>Joined as {props.name}</p>
        </div>
    );
};

export default MeetingInfo;
