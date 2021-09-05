import React from 'react'
import { Container, Col, Row, Button, Spinner } from 'reactstrap'
import WaveVisualizer from '../MeetCall/WaveVisualizer/WaveVisualizer'
import classes from './MeetSettings.module.css'
import * as vad from 'voice-activity-detection'

const MeetSettings = (props) => {

    const videoRef = React.useRef(null)
    const [soundActivity, setSoundActivity] = React.useState(0)
    React.useEffect(() => {
        if (props.userVideoStream) {

            videoRef.current.srcObject = props.userVideoStream
        }
    }, [props.userVideoStream])

    React.useEffect(() => {
        if (props.userAudioStream) {
            const audioContext = new AudioContext()
            let voiceDectionOptions = {
                onUpdate: (activityValue) => {
                    setSoundActivity(activityValue)
                }

            };
            vad(audioContext, props.userAudioStream, voiceDectionOptions)
            return () => {
                voiceDectionOptions = {}
            }
        }

    }, [props.userAudioStream])





    return (
        <Container fluid>
            <Row className={classes.mainContainer}>
                <Col className={classes.mainVideoContainer}>
                    <Row style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Col xs='12' sm="8" md="8" lg="9" >
                            <div className={classes.videoContainer}>
                                <video ref={videoRef} muted playsInline autoPlay className={classes.video}></video>
                                {props.mediaDevices && <div className={classes.settingsContainer} onClick={() => props.setIsOpenSettingsModal(true)}>
                                    <i className={`fas fa-cog ${classes.settingsIcon}`}></i>
                                </div>}
                                {props.userAudioStream && props.userVideoStream && <div className={classes.controlsContainer}>
                                    <div
                                        className={`${classes.centerItemIconBlock} ${!props.settings.isAudio ? classes.redBg : null}`}
                                        onClick={props.toggleAudioHandler}>
                                        <i className={`${props.settings.isAudio ? `fas fa-microphone ${classes.centerItemIcon}` : `fas fa-microphone-slash ${classes.activeIcon}`}`}></i>
                                    </div>
                                    <div className={`${classes.centerItemIconBlock} ${!props.settings.isVideo ? classes.redBg : null}`}
                                        onClick={props.toggleVideoHandler}>
                                        <i className={` ${props.settings.isVideo ? `fas fa-video ${classes.centerItemIcon}` : `fas fa-video-slash ${classes.activeIcon}`}`} ></i>
                                    </div>
                                </div>}
                                {!props.settings.isAudio ?
                                    <div className={classes.centerItemIconBlockVoiceOff}>
                                        <i className={`fas fa-microphone-slash ${classes.microIcon}`}></i>
                                    </div> :
                                    <div className={classes.centerItemIconBlockVoiceOn}>
                                        <WaveVisualizer soundActivity={soundActivity} />
                                    </div>

                                }
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" lg="4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                    <div >
                        <h5 className={classes.participateTitle}>Are you ready to Participate?</h5>
                        {props.participants ?
                            props.participants.length > 0 ?
                                <React.Fragment>
                                    <div className={classes.participantsPicturesContainer} >
                                        {props.participants.map((participant, index) => (
                                            <img key={`${participant._id} ${index}`} alt="participant" className={classes.participantImage} src={participant.profileImage} />

                                        ))}
                                    </div>
                                    <h5 className={classes.participantsText}>
                                        {`${props.participants.map((p, index) => {
                                            if (index < p.length - 2)
                                                return `${p.name || `${p.firstName} ${p.lastName}`}, `
                                            if (index === p.length - 2)
                                                return `${p.name || `${p.firstName} ${p.lastName}`}and `

                                            return `${p.name || `${p.firstName} ${p.lastName}`} `
                                        })} ${props.participants.length > 1 ? 'are' : 'is'} in this meeting`}
                                    </h5>
                                </React.Fragment>
                                :
                                <h5 className={classes.participantsText}>Pas de participants</h5>

                            :
                            <Spinner />
                        }

                        <div className={classes.buttonContainer}>
                            {!props.loading ?
                                !props.error ?
                                    <Button color="info" className={classes.participateButton} onClick={props.participateFunction}>
                                        Participate
                                    </Button>
                                    :
                                    <h5>{props.error}</h5>
                                :
                                <h5>loading...</h5>
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default MeetSettings
