import React from 'react'
import classes from './UserPreviewCard.module.css'
const UserPreviewCard = (props) => {

    const ref = React.useRef();
    React.useEffect(() => {
        if (ref.current)
            ref.current.srcObject = props.stream;
    }, [props.isAudioOn, props.stream]);
    return (
        <div className={classes.mainContainer}>
            <div className={classes.videoContainer} style={{ display: !props.isVideoOn ? 'none' : 'block' }}>
                <video className={classes.video} muted playsInline autoPlay ref={ref} ></video>
            </div>
            {!props.isVideoOn && <div className={classes.mainUserInfoContainer}>
                <img src={props.image} alt={'profile user'} className={classes.userImage} />
            </div>
            }
            {!props.isAudioOn &&
                <div className={classes.centerItemIconBlock}>
                    <i className={`fas fa-microphone-slash ${classes.microIcon}`}></i>
                </div>
            }
        </div>
    )
}

export default UserPreviewCard
