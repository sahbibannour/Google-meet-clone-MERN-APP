import React from "react";
import axios from '../../utils/axios'
import MeetCall from "./MeetCall/MeetCall";
import MeetSettings from "./MeetSettings/MeetSettings";
import { useHistory } from 'react-router-dom'
import * as qp from 'query-parse';
import io from "socket.io-client";

import GlobalContext from "../../context/GlobalContext";
import SettingsModal from "./SettingsModal/SettingsModal";


window.AudioContext = window.AudioContext || window.webkitAudioContext;

const Meet = (props) => {
    const socketRef = React.useRef();
    const [participate, setParticipate] = React.useState(false)
    const [participants, setParticipants] = React.useState([])
    const [loadingParticipations, setLoadingParticipation] = React.useState(true)
    const [errorParticipate, setErrorParticipate] = React.useState(null)
    const [settings, setSettings] = React.useState({ isVideo: true, isAudio: true })
    const [mediaDevices, setMediaDevices] = React.useState(null)
    const [selectedDevices, setSelectedDevices] = React.useState(null)
    const [meetAdmin, setMeetAdmin] = React.useState(null)
    const history = useHistory()
    const context = React.useContext(GlobalContext)
    const [isNewMeeting, setIsNewMeeting] = React.useState(null)
    const [isOpenSettingsModal, setIsOpenSettingsModal] = React.useState(false)
    const [userAudioStream, setUserAudioStream] = React.useState(null)
    const [userVideoStream, setUserVideoStream] = React.useState(null)


    React.useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                stream.getVideoTracks().forEach(track => track.stop())
                stream.getAudioTracks().forEach(track => track.stop())
                setupDevices();
            })
            .catch(() => {
                setLoadingParticipation(false)
                setErrorParticipate("Camera or microphone blocked!")
            })

        navigator.mediaDevices.ondevicechange = async function (event) {
            setupDevices();
        };

        return () => {
            navigator.mediaDevices.ondevicechange = null
        }
    }, [])

    React.useEffect(() => {
        if (selectedDevices && !participate) {
            navigator.mediaDevices.getUserMedia({
                video: { deviceId: selectedDevices.videoInput.deviceId ? { exact: selectedDevices.videoInput.deviceId } : undefined }
            }).then(stream => {
                if (!settings.isVideo) {
                    stream.getVideoTracks().forEach(track => track.stop())
                }
                setUserVideoStream((_stream) => {
                    if (_stream)
                        _stream.getVideoTracks().forEach(track => track.stop())
                    return stream;
                })
            })
                .catch(err => {
                    setLoadingParticipation(false)
                    console.log({ err })
                    setErrorParticipate("Camera or microphone blocked!")
                })
        }
        if (participate) {
            setUserAudioStream(audioStream => {
                if (audioStream)
                    audioStream.getAudioTracks().forEach(track => track.stop())
                return null
            })
            setUserVideoStream(videoStream => {
                if (videoStream)
                    videoStream.getVideoTracks().forEach(track => track.stop())
                return null
            })

        }
        // eslint-disable-next-line
    }, [selectedDevices?.videoInput, settings.isVideo, participate])


    React.useEffect(() => {
        if (selectedDevices && !participate) {

            navigator.mediaDevices.getUserMedia({
                audio: { deviceId: selectedDevices.audioInput.deviceId ? { exact: selectedDevices.audioInput.deviceId } : undefined },
            }).then(stream => {
                if (!settings.isAudio) {
                    stream.getAudioTracks().forEach(track => track.enabled = false)
                }
                setUserAudioStream((_stream => {
                    if (_stream)
                        _stream.getAudioTracks().forEach(track => track.stop())
                    return stream
                }))
            })
                .catch(err => {
                    setLoadingParticipation(false)
                    console.log({ err })
                    setErrorParticipate("Camera or microphone blocked!")
                })
        }
        // eslint-disable-next-line
    }, [selectedDevices?.audioInput, settings.isAudio])


    React.useEffect(() => {
        const paramObj = qp.toObject(props.location.search.slice(1, props.location.search.length))
        if (!context.user)
            return history.replace('/login')
        setIsNewMeeting(paramObj.new === 'true')
        if (!paramObj.new)
            axios.get(`/meet/${props.match.params.meetId}`)
                .then(res => {
                    if (res.data.meet) {
                        setParticipants(res.data.meet.users.map(userObj => userObj.user))
                        setMeetAdmin(res.data.meet.admin)
                        socketRef.current = io.connect(process.env.REACT_APP_WEBSOCKETURL);
                        setLoadingParticipation(false)

                    }
                    else
                        history.replace('/meet')

                })
                .catch(err => {
                    console.log({ err })
                })
        else {
            setParticipants([])
            socketRef.current = io.connect(process.env.REACT_APP_WEBSOCKETURL);
            history.push(`/meet/${props.match.params.meetId}`)
            setLoadingParticipation(false)

        }
        // eslint-disable-next-line 
    }, [])


    const participateHandler = () => {
        if (!isNewMeeting && meetAdmin !== context.user._id) {
            socketRef.current.emit("request-join-room", { roomId: props.match.params.meetId, user: context.user })
            socketRef.current.on("request-accepted", () => {
                setLoadingParticipation(false)
                setParticipate(true)
            })
            setLoadingParticipation(true)
        } else
            setParticipate(true)
    }

    const setupDevices = () => {

        navigator.mediaDevices.enumerateDevices().then((devices) => {
            let _mediaDevices = { audioInput: [], audioOutput: [], videoInput: [] }
            let _selectedDevices = {}

            let noDevices = true
            devices.forEach(device => {
                if (device.deviceId !== "")

                    noDevices = false
            })
            if (!noDevices) {
                devices.forEach(device => {

                    if (device.kind === 'audioinput') {
                        _mediaDevices.audioInput.push(device)
                        if (device.deviceId === "default")
                            _selectedDevices.audioInput = device
                    } else if (device.kind === 'audiooutput') {
                        _mediaDevices.audioOutput.push(device)
                        if (device.deviceId === "default")
                            _selectedDevices.audioOutput = device
                    } else if (device.kind === 'videoinput') {
                        _mediaDevices.videoInput.push(device)
                        if (!_selectedDevices.videoInput)
                            _selectedDevices.videoInput = device
                    }
                })

                setMediaDevices({ ..._mediaDevices })
                setSelectedDevices({ ..._selectedDevices })
            }

        })
    }

    const setSelectedVideoInputHandler = (deviceId) => {
        const deviceIndex = mediaDevices.videoInput.findIndex(v => v.deviceId === deviceId)

        setSelectedDevices({
            ...selectedDevices,
            videoInput: mediaDevices.videoInput[deviceIndex]
        })
    }
    const setSelectedAudioInputHandler = (deviceId) => {
        const deviceIndex = mediaDevices.audioInput.findIndex(v => v.deviceId === deviceId)
        setSelectedDevices({
            ...selectedDevices,
            audioInput: mediaDevices.audioInput[deviceIndex]
        })
    }

    const setSelectedAudioOutputHandler = (deviceId) => {
        const deviceIndex = mediaDevices.audioOutput.findIndex(v => v.deviceId === deviceId)
        setSelectedDevices({
            ...selectedDevices,
            audioOutput: mediaDevices.audioOutput[deviceIndex]
        })
    }

    const toggleAudioHandler = (value) => {
        setSettings({
            ...settings,
            isAudio: !settings.isAudio
        })
    }

    const toggleVideoHandler = () => {
        setSettings({
            ...settings,
            isVideo: !settings.isVideo
        })

    }

    if (context.user)
        return (
            <React.Fragment>
                <SettingsModal
                    setSelectedVideoInput={setSelectedVideoInputHandler}
                    setSelectedAudioInput={setSelectedAudioInputHandler}
                    setSelectedAudioOutput={setSelectedAudioOutputHandler}
                    toggle={setIsOpenSettingsModal}
                    isOpen={isOpenSettingsModal}
                    selectedDevices={selectedDevices}
                    devices={mediaDevices} />
                {
                    !participate ?
                        <MeetSettings
                            settings={settings}
                            userAudioStream={userAudioStream}
                            userVideoStream={userVideoStream}
                            toggleAudioHandler={toggleAudioHandler}
                            toggleVideoHandler={toggleVideoHandler}
                            participants={participants}
                            loading={loadingParticipations}
                            error={errorParticipate}
                            mediaDevices={mediaDevices}
                            selectedDevices={selectedDevices}
                            setupDevices={setupDevices}
                            setMediaDevices={setMediaDevices}
                            setSelectedDevices={setSelectedDevices}
                            setSettings={setSettings}
                            setIsOpenSettingsModal={setIsOpenSettingsModal}
                            setLoading={(val) => setLoadingParticipation(val)}
                            setErrorParticipate={(err) => setErrorParticipate(err)}
                            participateFunction={participateHandler} />
                        :
                        <MeetCall
                            isAdmin={context.user._id === meetAdmin || isNewMeeting}
                            roomID={props.match.params.meetId}
                            userAudioStream={userAudioStream}
                            userVideoStream={userVideoStream}
                            selectedDevices={selectedDevices}
                            showSettingsModal={() => setIsOpenSettingsModal(true)}
                            settings={settings} />
                }
            </React.Fragment>
        );
    return null
};

export default Meet;
