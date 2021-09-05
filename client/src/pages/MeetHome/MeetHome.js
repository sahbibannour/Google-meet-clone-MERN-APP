import React from 'react'
import classes from './MeetHome.module.css'
import { useHistory } from 'react-router-dom'
import shortid from 'shortid'
import { Container, Row, Col } from 'reactstrap';
import axios from '../../utils/axios'
import GlobalContext from '../../context/GlobalContext';
const MeetHome = () => {

    const history = useHistory();
    const [meetingCode, setMeetingCode] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState(null)
    const context = React.useContext(GlobalContext)


    React.useEffect(() => {
        if (!context.user)
            return history.replace('/login')
    }, [history, context.user])
    const startCall = () => {
        const uid = shortid.generate();
        history.push(`/meet/${uid}?new=true`);
    };

    const setMeetingCodeHandler = (valueInput) => {
        let roomId = valueInput
        if (valueInput.includes('http') || valueInput.includes('https')) {
            if (valueInput.split('meet')[1]) {
                roomId = valueInput.split('meet')[1].split('/')[1]
            }
        }
        setMeetingCode(roomId)
    }
    const joinMeetingHandler = () => {
        axios.get(`/meet/${meetingCode}`)
            .then(res => {
                if (res.data.meet) {

                    return history.push(`/meet/${meetingCode}`);
                } else {
                    return setErrorMessage('Meeting not found')
                }

            })
            .catch(error => {
                console.log({ error })
            })

    }
    if (context.user)
        return (
            <Container className={classes.mainContainer}>
                <Row >
                    <Col xs="12" md="6" className={classes.leftSide}>
                        <div>
                            <div >
                                <h2 className={classes.pageTitle}>Premium video meetings. Now free for everyone.</h2>
                                <p className={classes.pageDescription}>
                                    We re-engineered the service we built for secure business
                                    meetings, Google Meet, to make it free and available for all.
                                </p>
                                <Row className={classes.actionBtn} >
                                    {/* className={classes.actionBtn} */}
                                    <Col md="12" lg="5" style={{ margin: '5px 0' }}>
                                        <button className={classes.newMeetingButton} onClick={startCall}>
                                            <i className={`fas fa-video ${classes.iconBlockBtn}`} ></i>
                                            New Meeting
                                        </button>
                                    </Col>
                                    <Col className={classes.inputBlock} >
                                        <div className={classes.inputSection}>
                                            <i className={`fas fa-keyboard ${classes.iconBlockBtnSection}`} ></i>
                                            <input
                                                onFocus={() => setErrorMessage(null)}
                                                className={classes.inputCode} placeholder="Enter a code or link"
                                                onChange={(e) => setMeetingCodeHandler(e.target.value)}
                                                value={meetingCode} />
                                        </div>
                                        <button className={classes.joinBtn} onClick={joinMeetingHandler}>Join</button>
                                    </Col>
                                </Row>
                            </div>
                            {
                                errorMessage && <div className={classes.errorMessageContainer}>
                                    <h5 className={classes.errorText}>{errorMessage}</h5>
                                </div>
                            }
                        </div>
                    </Col>
                    <Col className={classes.rightSideMainContainer}>
                        <div className={classes.rightSideContent}>
                            <img className={classes.rightSideimg} alt="participant" src="https://www.gstatic.com/meet/google_meet_marketing_ongoing_meeting_grid_427cbb32d746b1d0133b898b50115e96.jpg" />
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    return null
}

export default MeetHome
