import React from 'react'
import classes from './PinnedUserCard.module.css'
import * as vad from 'voice-activity-detection'
import WaveVisualizer from '../WaveVisualizer/WaveVisualizer';
const PinnedUserCard = (props) => {


    const ref = React.useRef();
    const [soundActivity, setSoundActivity] = React.useState(0)
    const [showmenuOptions, setShowMenuOptions] = React.useState(true)

    React.useEffect(() => {
        if (ref.current)
            ref.current.srcObject = props.stream;

    }, [props.stream, props.isAudioOn, props.isVideoOn]);

    React.useEffect(() => {
        const audioContext = new AudioContext();
        const voiceDectionOptions = {
            onUpdate: (activityValue) => {
                setSoundActivity(activityValue)
            }

        };
        vad(audioContext, props.stream, voiceDectionOptions);


    }, [props]);



    return (
        <div onDoubleClick={props.onClick}
            onMouseEnter={() => setShowMenuOptions(true)}
            onMouseLeave={() => setShowMenuOptions(false)}
            className={props.isVideoOn ? classes.mainContainerVideoOn : classes.mainContainerVideoOff}>
            <div className={classes.soundActivity}>{soundActivity}</div>

            <div style={{ padding: '0' }}>
                <div className={classes.videoContainer} style={{ display: !props.isVideoOn ? 'none' : 'inline-block' }}>
                    <video className={classes.video} muted playsInline autoPlay ref={ref} ></video>
                </div>
                {!props.isVideoOn &&
                    <div className={classes.mainUserContainer}>

                        <div className={classes.userImageContainer} style={{ borderWidth: `${100 * soundActivity}px` }}>
                            <div className={classes.userImage} style={{ backgroundImage: `url(${props.image})` }}></div>

                        </div>
                    </div>
                }
                {!props.isAudioOn ?
                    <div className={classes.centerItemIconBlock}>
                        <i className={`fas fa-microphone-slash ${classes.microIcon}`}></i>
                    </div> :
                    <div className={classes.centerItemIconBlockVoice}>
                        <WaveVisualizer soundActivity={soundActivity} />
                    </div>

                }
                {showmenuOptions && <div className={classes.menuOptionsContainer} style={{ position: 'relative', cursor: 'pointer' }} onClick={props.unPinUserFunction}>
                    <div className={classes.pinIconSlash}>/</div>
                    <i className={`fas fa-thumbtack ${classes.pinIcon}`} ></i>
                </div>}
                <div className={classes.userInfoContainer}>
                    <h5 className={classes.userNameText}>
                        {props.name}
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default PinnedUserCard
