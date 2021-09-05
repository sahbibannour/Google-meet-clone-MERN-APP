import React from 'react'
import classes from './NotificationMessage.module.css'
const NotificationMessage = (props) => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.notificationHeader}>
                <i className={`${'fas fa-comment'} ${classes.icon}`}></i>
                <h3 className={classes.userText}>{props.user.name}</h3>
            </div>
            <p className={classes.notificationMsg}>{props.message}</p>
        </div>
    );
};

export default NotificationMessage;
