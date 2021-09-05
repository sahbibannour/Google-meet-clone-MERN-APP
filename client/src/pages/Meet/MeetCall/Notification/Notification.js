import React from 'react'
import classes from './Notification.module.css'
const Notification = (props) => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.notificationContentContainer}>
                <h5 className={classes.notificationContentText}>
                    {props.content}

                </h5>
            </div>
        </div>
    )
}

export default Notification
