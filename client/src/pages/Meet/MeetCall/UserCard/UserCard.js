import React from 'react'
import classes from './UserCard.module.css'
import * as vad from 'voice-activity-detection'
import { Row, Col } from 'reactstrap'
import Tooltip from '@material-ui/core/Tooltip';
import WaveVisualizer from '../WaveVisualizer/WaveVisualizer';

const UserCard = (props) => {


    const ref = React.useRef();
    const [soundActivity, setSoundActivity] = React.useState(0)
    const [showmenuOptions, setShowMenuOptions] = React.useState(false)


    React.useEffect(() => {
        if (ref.current)
            ref.current.srcObject = props.stream;

    }, [props.streamVideo, props.isAudioOn, props.isVideoOn]);

    React.useEffect(() => {
        const audioContext = new AudioContext();
        const voiceDectionOptions = {
            onUpdate: (activityValue) => {
                setSoundActivity(activityValue)
                props.registerSoundActivity(activityValue)
            }

        };
        vad(audioContext, props.stream, voiceDectionOptions);


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
                {showmenuOptions && <div className={classes.menuControlsContainer} >

                    <div className={classes.menuControlItem} onClick={props.pinUserFunction}>
                        <i className={`fas fa-thumbtack ${classes.controlIcon}`} ></i>
                    </div>

                    {props.peerId !== 'current' && props.isAdmin && <React.Fragment>

                        {!props.isAudioOn ? <Tooltip
                            arrow
                            PopperProps={{
                                disablePortal: true,
                            }}

                            disableFocusListener
                            disableTouchListener
                            title="You cant reactive a user micro"
                        >
                            <div className={classes.menuControlItem} >
                                <i className={`fas fa-microphone-slash ${classes.controlIcon}`}></i>
                            </div>
                        </Tooltip> :
                            <div className={classes.menuControlItem} onClick={props.muteUserFunction}>
                                <i className={`fas fa-microphone-slash ${classes.controlIcon}`}></i>
                            </div>
                        }
                        <div className={classes.menuControlItem} onClick={() => props.excludeUserFunction(props.name)}>
                            <i className={`fas fa-minus-circle ${classes.controlIcon}`}></i>
                        </div>
                    </React.Fragment>}
                </div>}
            </Col>
        </Row>
    )
}

export default UserCard
