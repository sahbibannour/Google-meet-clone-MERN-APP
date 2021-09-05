import React from 'react'
import classes from './UserCard.module.css'
import * as vad from 'voice-activity-detection'
import { Row, Col } from 'reactstrap'
import WaveVisualizer from '../WaveVisualizer/WaveVisualizer';

const UserCard = (props) => {


    const ref = React.useRef();
    const [soundActivity, setSoundActivity] = React.useState(0)
    const [showmenuOptions, setShowMenuOptions] = React.useState(false)


    React.useEffect(() => {
        if (ref.current)
            ref.current.srcObject = props.stream;

    }, [props.streamVideo, props.isAudioOn, props.isVideoOn, props.stream]);

    React.useEffect(() => {
        const audioContext = new AudioContext();
        const voiceDectionOptions = {
            onUpdate: (activityValue) => {
                setSoundActivity(activityValue)
                props.registerSoundActivity(activityValue)
            }

        };
        vad(audioContext, props.stream, voiceDectionOptions);

        // eslint-disable-next-line
    }, [props.peerId]);




    return (
        <Row
            style={{ borderColor: `${props.isLastSpeaker ? '#007fff' : 'transparent'}` }}
            onMouseEnter={() => setShowMenuOptions(true)}
            onMouseLeave={() => setShowMenuOptions(false)}
            onDoubleClick={props.onClick}
            className={props.isVideoOn ? classes.mainContainerVideoOn : classes.mainContainerVideoOff}>
            <Col style={{ padding: '0' }}>
                <div className={classes.soundActivity}>{soundActivity}</div>
                <div className={classes.videoContainer} style={{ display: !props.isVideoOn ? 'none' : 'block' }}>
                    <video className={classes.video} muted playsInline autoPlay ref={ref} ></video>
                </div>
                {!props.isVideoOn &&
                    <div className={classes.mainUserContainer}>
                        <div className={classes.userImageContainer} style={{ borderWidth: `${100 * +soundActivity}px` }}>
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

                <div className={classes.userInfoContainer}>
                    <h5 className={classes.userNameText}>
                        {props.name}
                    </h5>
                </div>
                {showmenuOptions &&
                    <React.Fragment>
                        {!props.isPinned ? <div className={classes.menuOptionsContainer}>
                            <i className={`fas fa-thumbtack ${classes.pinIcon}`} onClick={props.pinUserFunction}></i>

                        </div> :
                            <div className={classes.menuOptionsContainer} style={{ position: 'relative', cursor: 'pointer' }} onClick={props.unPinUserFunction}>
                                <div className={classes.pinIconSlash}>/</div>
                                <i className={`fas fa-thumbtack ${classes.pinIcon}`} ></i>
                            </div>}
                    </React.Fragment>
                }
            </Col>
        </Row>
    )
}

export default UserCard
