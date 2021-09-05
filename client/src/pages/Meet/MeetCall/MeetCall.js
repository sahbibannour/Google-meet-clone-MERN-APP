import React from 'react'
import CallPageFooter from './CallPageFooter/CallPageFooter'
import MeetingInfo from './MeetingInfo/MeetingInfo'
import NotificationMessage from './NotificationMessage/NotificationMessage'
import PinnedUserCard from './PinnedUserCard/PinnedUserCard'
import classes from './MeetCall.module.css'
import MeetDetails from './MeetDetails/MeetDetails'
import { useHistory } from 'react-router-dom';
import io from "socket.io-client";
import Peer from "simple-peer";
import { Row, Col, Container } from 'reactstrap'
import GlobalContext from '../../../context/GlobalContext'
import UserPreviewCard from './UserPreviewCard/UserPreviewCard'
import InvitationModal from './InvitationModal/InvitationModal'
import LoadingCall from './LoadingCall/LoadingCall'
import ReactHowler from 'react-howler'
import UserJoinedSound from '../../../assets/audio/join-call.mp3'
import UserRequestSound from '../../../assets/audio/ask-to-join.mp3'
import MessageSound from '../../../assets/audio/meet-message.mp3'
import Notification from './Notification/Notification'
import UserCard from './UserCard/UserCard'



const MeetCall = (props) => {


    const peersRef = React.useRef([]);
    const socketRef = React.useRef([])
    const [streamObj, setStreamObj] = React.useState();
    const [screenCastStream, setScreenCastStream] = React.useState(null);
    const [isPresenting, setIsPresenting] = React.useState(false)
    const history = useHistory();
    const url = `${window.location.origin}${window.location.pathname}`;
    const [meetInfoPopup, setMeetInfoPopup] = React.useState(false);
    const [messagesList, setListMessages] = React.useState([]);
    const [participants, setParticipants] = React.useState([])
    const [isOpenMessenger, setIsOpenMessenger] = React.useState(false);
    const [notificationMessage, setNotificationMessage] = React.useState(null);
    const [isAudio, setIsAudio] = React.useState(props.settings.isAudio);
    const [isVideo, setIsVideo] = React.useState(props.settings.isVideo);
    const context = React.useContext(GlobalContext)
    const [pinnedUser, setPinnedUser] = React.useState('current')
    const [requestedUsers, setRequestedUsers] = React.useState([])
    const [loadingPeers, setLoadingPeers] = React.useState(true)
    const [isOpenInvitationModal, setIsOpenInvitationModal] = React.useState(false)
    const [playingSoundUserRequest, setPlayingSoundUserRequest] = React.useState(false)
    const [playingSoundUserJoined, setPlayingSoundUserJoined] = React.useState(false)
    const [notification, setNotification] = React.useState(null)
    const notificationTimer = React.useRef(null)
    const notificationMessageTimer = React.useRef(null)
    const [isOpenSideBar, setIsOpenSideBar] = React.useState(false)
    const [playingMessageReceived, setPlayingMessageReceived] = React.useState(false)
    const firstLaunch = React.useRef(true)
    const [lastSpeaker, setLastSpeaker] = React.useState(null)
    const speakerInterval = React.useRef(null)
    React.useEffect(() => {
        console.log('heyyy')
        if (props.selectedDevices && streamObj) {
            const constraints = {
                audio: { deviceId: props.selectedDevices.audioInput.deviceId ? { exact: props.selectedDevices.audioInput.deviceId } : undefined },
                video: { deviceId: props.selectedDevices.videoInput.deviceId ? { exact: props.selectedDevices.videoInput.deviceId } : undefined }
            };

            navigator.mediaDevices.getUserMedia(constraints).then(stream => {

                setIsAudio(audio => {
                    if (!audio) {
                        stream.getAudioTracks().forEach(track => track.stop())
                    }
                    return audio
                })
                setIsVideo(video => {
                    if (!video) {
                        stream.getVideoTracks().forEach(track => track.stop())
                        return video
                    }
                })
                setParticipants(_participants => {
                    _participants.map(p => p.peer)
                        .forEach(peer => {
                            peer.replaceTrack(
                                streamObj.getAudioTracks()[0],
                                stream.getAudioTracks()[0],
                                streamObj
                            );
                            setIsPresenting((_presenting) => {
                                if (!_presenting)
                                    peer.replaceTrack(
                                        streamObj.getVideoTracks()[0],
                                        stream.getVideoTracks()[0],
                                        streamObj
                                    );
                                return _presenting
                            })

                        })
                    return _participants
                })
                setStreamObj((_streamObj) => {
                    const streamObjCopy = _streamObj
                    streamObjCopy.removeTrack(_streamObj.getAudioTracks()[0])
                    streamObjCopy.addTrack(stream.getAudioTracks()[0])
                    streamObjCopy.removeTrack(_streamObj.getVideoTracks()[0])
                    streamObjCopy.addTrack(stream.getVideoTracks()[0])

                    return streamObjCopy

                })
            })
        }
        // eslint-disable-next-line
    }, [props.selectedDevices])


    React.useEffect(() => {
        if (props.selectedDevices) {
            const audiosElements = document.querySelectorAll('.audio-meet')
            audiosElements.forEach(async (audioElement) => {
                await audioElement.setSinkId(props.selectedDevices.audioOutput.deviceId)
            })
        }
        // eslint-disable-next-line
    }, [props.selectedDevices?.audioOutput])
    React.useEffect(() => {
        firstLaunch.current = false
        socketRef.current = io.connect(process.env.REACT_APP_WEBSOCKETURL);
        if (props.isAdmin) {
            setMeetInfoPopup(true)
            socketRef.current.on('request-received', ({ user, socketId }) => {
                setPlayingSoundUserRequest(true)
                const name = user.name || `${user.firstName} ${user.lastName}`
                setRequestedUsers((_requestedUsers) => {
                    return [..._requestedUsers, { name, socketId: socketId, photo: user.profileImage }]
                })
                setIsOpenInvitationModal(true)

            })
        }

        const constraints = {
            audio: { deviceId: props.selectedDevices.audioInput.deviceId },
            video: { deviceId: props.selectedDevices.videoInput.deviceId }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            if (!props.settings.isAudio) {
                stream.getAudioTracks().forEach(track => track.enabled = false)
            }
            if (!props.settings.isVideo) {
                stream.getVideoTracks().forEach(track => track.stop())

            }


            setStreamObj(stream)
            socketRef.current.emit("join room", { roomID: props.roomID, user: context.user, state: props.settings })

            socketRef.current.on("all users", users => {
                if (users.length === 0) {
                    setLoadingPeers(false)

                }
                users.forEach((userObj, userIndex) => {
                    const peer = createPeer(userObj.socketId, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userObj.socketId,
                        peer,
                    })

                    peer.on('stream', async (stream) => {
                        setParticipants((_participants) => {
                            const newParticipants = [..._participants, { peer, user: userObj.user, state: userObj.state, stream, socketId: userObj.socketId }]
                            if (users.length > 0) {
                                setPinnedUser({ peer, user: userObj.user, state: userObj.state, stream, socketId: userObj.socketId })
                            }
                            if (users.length - 1 === userIndex)
                                setLoadingPeers(false)
                            return newParticipants
                        })
                        const audiosContainer = document.getElementById('audios')
                        const newAudioElement = document.createElement('audio')
                        newAudioElement.classList.add("audio-meet");

                        newAudioElement.srcObject = stream;
                        await newAudioElement.setSinkId(props.selectedDevices.audioOutput.deviceId)
                        newAudioElement.play()
                        audiosContainer.appendChild(newAudioElement)

                    })

                })

            })
            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream, payload.user, payload.state);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                peer.on('stream', (stream) => {
                    const audiosContainer = document.getElementById('audios')
                    const newAudioElement = document.createElement('audio')
                    newAudioElement.classList.add("audio-meet");
                    newAudioElement.srcObject = stream;
                    newAudioElement.play()
                    audiosContainer.appendChild(newAudioElement)
                    setParticipants(_participants => {
                        setPlayingSoundUserJoined(true)
                        const newParticipants = [..._participants, { peer: peer, user: payload.user, stream, state: payload.state, socketId: payload.callerID }]
                        if (_participants.length === 0)
                            setPinnedUser({ peer: peer, user: payload.user, stream, state: payload.state, socketId: payload.callerID })
                        return newParticipants
                    });

                })
            });
            socketRef.current.on('user-disconnect', (socketId) => {
                peersRef.current = peersRef.current.filter(peerRef => peerRef.peerID !== socketId)
                setParticipants(_participants => {
                    const participantIndex = _participants.findIndex(_participant => _participant.socketId === socketId)

                    const participantCopy = [..._participants]
                    if (participantIndex >= 0) {
                        const disconnectedUser = participantCopy[participantIndex].user
                        setNotification(`${disconnectedUser.name || `${disconnectedUser.firstName} ${disconnectedUser.lastName}`} has left the meeting`)
                        participantCopy[participantIndex].peer.destroy()
                        participantCopy.splice(participantIndex, 1)

                        setPinnedUser(_pinnedUser => {
                            if (participantCopy.length === 0) return 'current'

                            if (_pinnedUser && _pinnedUser !== 'current' && _pinnedUser.socketId === socketId) {
                                return null
                            } else {
                                return _pinnedUser
                            }
                        })
                    }

                    return participantCopy
                })

            })

            socketRef.current.on('disable-user-video', ({ userId, value }) => {
                setParticipants((_participants => {
                    const _participantsCopy = [..._participants]
                    const participantIndex = _participantsCopy.findIndex(part => part.socketId === userId)
                    if (participantIndex >= 0)
                        _participantsCopy[participantIndex].state.isVideo = value
                    return _participantsCopy
                }))
            })
            socketRef.current.on('disable-user-audio', ({ userId, value }) => {
                setParticipants((_participants => {
                    const _participantsCopy = [..._participants]
                    const participantIndex = _participantsCopy.findIndex(part => part.socketId === userId)
                    if (participantIndex >= 0)
                        _participantsCopy[participantIndex].state.isAudio = value
                    return _participantsCopy
                }))
            })

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

            socketRef.current.on("receive-message-meet", ({ message }) => {
                setListMessages((messagesList) => {
                    return [...messagesList, message]
                })
                if (!isOpenMessenger)
                    setNotificationMessage(message)
                setPlayingMessageReceived(true)
            });


        })
        return () => {
            socketRef.current.close()
            peersRef.current.forEach(peerObj => peerObj.peer.destroy())
            peersRef.current = []
            setParticipants(_participants => {
                _participants.forEach(part => part.peer.destroy())
                return []
            })
        }
        // eslint-disable-next-line
    }, []);
    React.useEffect(() => {
        return () => {
            if (streamObj) {
                console.log('heyyyended')
                streamObj.getTracks().forEach(track => track.stop())
            }
        }
    }, [streamObj])
    React.useEffect(() => {
        return () => {
            if (screenCastStream) {
                screenCastStream.getTracks().forEach(track => track.stop())
            }
        }
    }, [screenCastStream])


    React.useEffect(() => {
        if (notification) {
            if (notificationTimer.current)
                clearInterval(notificationTimer.current)
            notificationTimer.current = setTimeout(() => {
                setNotification(null)
            }, 4000)
        }
    }, [notification])

    React.useEffect(() => {
        if (notificationMessage) {
            if (notificationMessageTimer.current)
                clearInterval(notificationMessageTimer.current)
            notificationMessageTimer.current = setTimeout(() => {
                setNotificationMessage(null)
            }, 4000)
        }
    }, [notificationMessage])

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, user: context.user, state: props.settings })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream, user, state) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID, user, state })
        })

        peer.signal(incomingSignal);
        return peer;
    }

    const shareScreenHandler = () => {
        navigator.mediaDevices
            .getDisplayMedia({ cursor: true })
            .then((screenStream) => {
                setScreenCastStream(screenStream)
                screenStream.getTracks()[0].onended = () => {
                    participants.map(p => p.peer)
                        .forEach(peer => {
                            peer.replaceTrack(
                                screenStream.getVideoTracks()[0],
                                streamObj.getVideoTracks()[0],
                                streamObj
                            );
                        })
                    socketRef.current.emit('user-disable-video', { value: false })

                    setIsPresenting(false)

                };
                participants.map(p => p.peer)
                    .forEach(peer => {
                        peer.replaceTrack(
                            streamObj.getVideoTracks()[0],
                            screenStream.getVideoTracks()[0],
                            streamObj
                        );

                    })
                socketRef.current.emit('user-disable-video', { value: true })

                setIsPresenting(true)
            });
    }
    const stopScreenShareHandler = () => {
        socketRef.current.emit('user-disable-video', { value: false })
        setIsPresenting(false);

        screenCastStream.getVideoTracks().forEach((track) => {
            track.stop();
        });
        participants.map(p => p.peer)
            .forEach(peer => {
                peer.replaceTrack(
                    screenCastStream.getVideoTracks()[0],
                    streamObj.getVideoTracks()[0],
                    streamObj
                );

            })


    };
    const disconnectCallHandler = () => {

        history.push("/meet");
    }
    const toggleAudioHandler = (value) => {
        streamObj.getAudioTracks().forEach(track => track.enabled = value)
        socketRef.current.emit('user-disable-audio', { value })
        setIsAudio(value);
    }
    const toggleVideoHandler = (value) => {
        if (!value)
            streamObj.getVideoTracks().forEach(track => track.stop())
        else {
            const constraints = {
                audio: { deviceId: props.selectedDevices.audioInput.deviceId ? { exact: props.selectedDevices.audioInput.deviceId } : undefined },
                video: { deviceId: props.selectedDevices.videoInput.deviceId ? { exact: props.selectedDevices.videoInput.deviceId } : undefined }
            };
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {

                participants.map(p => p.peer)
                    .forEach(peer => {
                        peer.replaceTrack(
                            streamObj.getVideoTracks()[0],
                            stream.getVideoTracks()[0],
                            streamObj
                        );
                    })

                setStreamObj((_streamObj) => {
                    const streamObjCopy = _streamObj
                    streamObjCopy.removeTrack(_streamObj.getVideoTracks()[0])
                    streamObjCopy.addTrack(stream.getVideoTracks()[0])

                    return streamObjCopy

                })
            })
        }
        socketRef.current.emit('user-disable-video', { value })
        setIsVideo(value);
    }

    const showHideMeetingDetailsHandler = () => {

        setMeetInfoPopup((info) => !info)

    }

    const pinUserHandler = (peerId) => {
        if (peerId === 'current')
            return setPinnedUser(peerId)
        const participantIndex = participants.findIndex(participant => participant.peer._id === peerId)
        setPinnedUser({ ...participants[participantIndex] })
    }
    const unPinUserHandler = () => {
        setPinnedUser(null)
    }

    const onAcceptAllHandler = () => {
        setIsOpenInvitationModal(false)
        setRequestedUsers(_requestUsers => {
            _requestUsers.forEach(requestUser => {
                socketRef.current.emit('accept-user-request', { socketId: requestUser.socketId })

            });
            return []
        })
    }
    const onRefusePersonHandler = (socketId) => {
        setRequestedUsers(_requestUsers => {
            const requestUsers = [..._requestUsers]
            const requestedUserIndex = requestUsers.findIndex(user => user.socketId === socketId)
            requestUsers.splice(requestedUserIndex, 1)
            if (requestedUsers.length === 0)
                setIsOpenInvitationModal(false)
            return requestUsers
        })
    }

    const onAcceptPersonHandler = (socketId) => {
        setRequestedUsers(_requestUsers => {
            const requestUsers = [..._requestUsers]
            const requestedUserIndex = requestUsers.findIndex(user => user.socketId === socketId)
            socketRef.current.emit('accept-user-request', { socketId: _requestUsers[requestedUserIndex].socketId })
            requestUsers.splice(requestedUserIndex, 1)
            if (requestedUsers.length === 0)
                setIsOpenInvitationModal(false)
            return requestUsers
        })
    }



    const setIsOpenMessengerHandler = (valueOpen) => {
        setIsOpenSideBar(valueOpen !== 0)
        if (valueOpen > 0)
            setIsOpenMessenger(valueOpen)
        else
            setTimeout(() => {
                setIsOpenMessenger(valueOpen)
            }, 100)
    }
    const sendMessageHandler = (message) => {
        const newMessage = {
            content: message,
            user: { _id: context.user._id, name: context.user.name || `${context.user.firstName} ${context.user.lastName}` },
            time: new Date().toISOString()
        }
        setListMessages([...messagesList, newMessage])
        socketRef.current.emit('send-message-meet', { message: newMessage })

    }
    const setFullScreenHandler = async () => {
        const mainContainer = document.getElementById('mainContainer')
        await mainContainer.requestFullscreen()

    }
    const getTemplateGrid = () => {
        const participantsLength = participants.length + 1
        let grid = ""
        if (participantsLength === 2)
            grid = `repeat(2, auto)`
        else {
            if (participantsLength % 2 === 0)
                grid = `repeat(${participantsLength / 2}, auto)`
            else
                grid = `repeat(${(participantsLength - 1) / 2 + 1}, auto)`
        }
        return grid

    }
    const getGridItemStyles = () => {
        const participantsLength = participants.length + 1

        if (participantsLength % 2 !== 0)
            return {
                gridColumn: `${(participantsLength - 1) / 2}/${(participantsLength - 1) / 2 + 2}`,
            }
        return null
    }
    const registerSoundActivityHandler = (socketId, value) => {

        if (value > 0) {
            if (speakerInterval.current)
                clearInterval(speakerInterval.current)
            setLastSpeaker(socketId)
            speakerInterval.current = setTimeout(() => {
                setLastSpeaker(null)
            }, 2000)
        }

    }
    return (
        <React.Fragment>
            <div style={{ display: 'none' }} id='audios'>
            </div>
            {
                loadingPeers ?
                    <LoadingCall />
                    :
                    <Container id="mainContainer" fluid className={classes.mainComponentContainer}  >
                        <Row style={{ height: '100%' }}>
                            <Col>
                                <Row className={classes.mainRowContainer} style={{ overflow: 'hidden', }}>
                                    <Col className={classes.mainContainer} >
                                        {participants.length === 1 && pinnedUser && <Row >
                                            <Col style={{ height: '100%' }}>
                                                <UserPreviewCard
                                                    isAudioOn={isAudio}
                                                    isVideoOn={isVideo}
                                                    image={context.user.profileImage}
                                                    stream={isPresenting ? screenCastStream : streamObj}

                                                />
                                            </Col>
                                        </Row>}

                                        {pinnedUser !== null ?
                                            <React.Fragment>
                                                {
                                                    pinnedUser === 'current' ?
                                                        <Row style={{ height: '100%', position: 'relative', }}>
                                                            <Col style={{ height: '100%', position: 'relative' }}>
                                                                <PinnedUserCard
                                                                    isVideoOn={isVideo}
                                                                    isAudioOn={isAudio}
                                                                    onClick={setFullScreenHandler}
                                                                    name="You"
                                                                    peerId={'current'}
                                                                    unPinUserFunction={() => setPinnedUser(null)}
                                                                    image={context.user.profileImage}
                                                                    stream={streamObj}
                                                                    videoStream={isPresenting ? screenCastStream : streamObj} />
                                                            </Col>
                                                        </Row>
                                                        :
                                                        <Row style={{ height: '100%', position: 'relative', }}>
                                                            <Col style={{ height: '100%', position: 'relative' }}>
                                                                <PinnedUserCard
                                                                    key={pinnedUser.socketId}
                                                                    isVideoOn={pinnedUser.state.isVideo}
                                                                    isAudioOn={pinnedUser.state.isAudio}
                                                                    onClick={setFullScreenHandler}
                                                                    unPinUserFunction={() => setPinnedUser(null)}
                                                                    peerId={pinnedUser.socketId}
                                                                    videoStream={pinnedUser.stream}
                                                                    image={pinnedUser.user.profileImage}
                                                                    stream={pinnedUser.stream}
                                                                    name={pinnedUser.user.name || `${pinnedUser.user.firstName} ${pinnedUser.user.lastName}`} />
                                                            </Col>
                                                        </Row>
                                                }
                                            </React.Fragment>

                                            :
                                            <React.Fragment>

                                                {
                                                    <div className={classes.gridContainer} style={{ gridTemplateColumns: getTemplateGrid() }}>
                                                        {participants.map((participant) => (
                                                            <div className={classes.gridItem} key={participant.socketId} >
                                                                <UserCard
                                                                    isVideoOn={participant.state.isVideo}
                                                                    isLastSpeaker={lastSpeaker === participant.socketId}
                                                                    isAudioOn={participant.state.isAudio}
                                                                    image={participant.user.profileImage}
                                                                    stream={participant.stream}
                                                                    isPinned={pinnedUser?.peer._id === participant.peer._id}
                                                                    pinUserFunction={() => setPinnedUser(participant)}
                                                                    unPinUserFunction={() => setPinnedUser(null)}
                                                                    peerId={participant.socketId}
                                                                    videoStream={participant.stream}
                                                                    registerSoundActivity={(value) => registerSoundActivityHandler(participant.socketId, value)}
                                                                    name={participant.user.name || `${participant.user.firstName} ${participant.user.lastName}`}
                                                                />
                                                            </div>
                                                        ))}
                                                        <div className={classes.gridItem} style={getGridItemStyles()} >
                                                            <UserCard
                                                                isCurrentUser
                                                                isVideoOn={isVideo}
                                                                isAudioOn={isAudio}
                                                                name="You"
                                                                peerId={'current'}
                                                                isPinned={pinnedUser === 'current'}
                                                                isLastSpeaker={lastSpeaker === 'current'}
                                                                pinUserFunction={() => setPinnedUser('current')}
                                                                unPinUserFunction={() => setPinnedUser(null)}
                                                                registerSoundActivity={(value) => registerSoundActivityHandler('current', value)}
                                                                image={context.user.profileImage}
                                                                stream={streamObj}
                                                                streamVideo={isPresenting ? screenCastStream : streamObj} />
                                                        </div>
                                                    </div>

                                                }
                                            </React.Fragment>


                                        }


                                        {
                                            notification &&
                                            <Notification content={notification} />
                                        }
                                    </Col>
                                    <Col xs='3' className={classes.mainSideBarContainer} style={{
                                        transform: `translateX(${isOpenSideBar ? '0' : '+50vh'})`,
                                        maxWidth: isOpenSideBar ? '400px' : '0px',
                                        padding: isOpenMessenger ? '20px' : '0'


                                    }}>
                                        <MeetDetails
                                            setIsOpenMessenger={setIsOpenMessengerHandler}
                                            sendMessageFunction={sendMessageHandler}
                                            isOpenMessenger={isOpenMessenger}
                                            participants={participants}
                                            pinnedPeerId={(pinnedUser && pinnedUser !== 'current') ? pinnedUser.peer._id : pinnedUser ? 'current' : null}
                                            currentUser={context.user}
                                            messagesList={messagesList}
                                            unPinUserFunction={unPinUserHandler}
                                            pinUserFunction={pinUserHandler}
                                        />
                                    </Col>
                                </Row>
                                <Row >
                                    <Col style={{ padding: '0' }}>
                                        <CallPageFooter
                                            isOpenMessenger={isOpenMessenger}
                                            setIsOpenMessenger={setIsOpenMessengerHandler}
                                            notification={notificationMessage}
                                            setOpenParticipants={setIsOpenMessengerHandler}
                                            setNotification={setNotificationMessage}
                                            userImage={context.user.profileImage}
                                            isPresenting={isPresenting}
                                            participants={participants}
                                            roomId={props.roomID}
                                            stopScreenShareFunction={stopScreenShareHandler}
                                            screenShareFunction={shareScreenHandler}
                                            isAudio={isAudio}
                                            isVideo={isVideo}
                                            toggleSettingsFunction={props.showSettingsModal}
                                            toggleAudioFunction={toggleAudioHandler}
                                            toggleVideoFunction={toggleVideoHandler}
                                            showHideMeetingDetailsFunction={showHideMeetingDetailsHandler}
                                            disconnectCallFunction={disconnectCallHandler}
                                        />
                                    </Col>

                                </Row>
                            </Col>
                        </Row>
                        {!isOpenMessenger && notificationMessage && <div className={classes.notificationsContainer}>

                            <NotificationMessage user={notificationMessage.user} message={notificationMessage.content} />

                        </div>
                        }
                        <InvitationModal

                            requestedUsers={requestedUsers}
                            isOpen={isOpenInvitationModal}
                            onAcceptPerson={onAcceptPersonHandler}
                            refusePerson={onRefusePersonHandler}
                            onAcceptAll={onAcceptAllHandler}
                            toggle={setIsOpenInvitationModal} />


                        {
                            meetInfoPopup &&
                            <MeetingInfo
                                url={url}
                                setMeetInfoPopup={setMeetInfoPopup}
                                name={context.user.name || `${context.user.firstName} ${context.user.lastName}`} />
                        }

                        <ReactHowler
                            onEnd={() => setPlayingSoundUserRequest(false)}
                            src={UserRequestSound}
                            playing={playingSoundUserRequest}
                        />
                        <ReactHowler
                            onEnd={() => setPlayingSoundUserJoined(false)}

                            src={UserJoinedSound}
                            playing={playingSoundUserJoined}
                        />
                        <ReactHowler
                            onEnd={() => setPlayingMessageReceived(false)}
                            src={MessageSound}
                            playing={playingMessageReceived}
                        />

                    </Container >
            }
        </React.Fragment>

    )
}

export default MeetCall
