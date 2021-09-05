import React from 'react';
import { Col, Row, Modal, ModalBody } from 'reactstrap';
import classes from './SettingsModal.module.css'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
const SettingsModal = (props) => {



    const toggle = () => props.toggle(!props.isOpen);
    const [tab, setTab] = React.useState(0)

    return (
        <Modal isOpen={props.isOpen} toggle={() => { }} style={{ maxWidth: '500px' }} centered
            className={classes.className}
            contentClassName={classes.contentClassName}>
            <ModalBody>
                <Row style={{ minHeight: '500px' }}>
                    <Col md="4" className={classes.sidebarContainer}>
                        <Row>
                            <Col style={{ padding: '0px 10px 0px 0px' }}>
                                <div className={classes.headerContainer}>
                                    <h5 className={classes.settingTitle}>Settings</h5>
                                </div>
                                <div className={`${tab === 0 ? classes.menuItemContainerActive : classes.menuItemContainer}`} onClick={() => setTab(0)}>
                                    <i className={`fas fa-volume-up ${tab === 0 ? classes.menuIconActive : classes.menuIcon}`}></i>
                                    <h5 className={`${tab === 0 ? classes.menuTextActive : classes.menuText}`}>Audio</h5>
                                </div>
                                <div className={`${tab === 1 ? classes.menuItemContainerActive : classes.menuItemContainer}`} onClick={() => setTab(1)}>
                                    <i className={`fas fa-video ${tab === 1 ? classes.menuIconActive : classes.menuIcon}`}></i>
                                    <h5 className={`${tab === 1 ? classes.menuTextActive : classes.menuText}`}>Video</h5>
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    <Col style={{ padding: '0px 20px 10px 20px' }}>
                        <Row>
                            <Col className={classes.toggleModalHeader}>
                                <i onClick={toggle} className={`fas fa-times ${classes.iconTimes}`}>
                                </i>
                            </Col>
                        </Row>
                        <Row>
                            <Col >

                                {tab === 0 &&
                                    <Row>
                                        <Col>
                                            <Row className={classes.mainItemContainer}>
                                                <Col>
                                                    <Row className={classes.itemContainer}>
                                                        <Col>
                                                            <h5 className={classes.categoryTitle}>Micro</h5>
                                                        </Col>
                                                    </Row>
                                                    <Row className={classes.itemContainer}>
                                                        <Col>
                                                            <Select
                                                                style={{ width: 'min-content', minWidth: '200px', maxWidth: '350px' }}
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={props.selectedDevices?.audioInput.deviceId}
                                                                onChange={(e) => props.setSelectedAudioInput(e.target.value)}

                                                            >
                                                                {props.devices?.audioInput.map(device => (
                                                                    <MenuItem key={device.deviceId} value={device.deviceId}>
                                                                        {device.label}
                                                                    </MenuItem>
                                                                ))}

                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className={classes.mainItemContainer}>
                                                <Col>
                                                    <Row className={classes.itemContainer}>
                                                        <Col>
                                                            <h5 className={classes.categoryTitle}>Haut parleurs</h5>
                                                        </Col>
                                                    </Row>
                                                    <Row className={classes.itemContainer}>
                                                        <Col>
                                                            <Select
                                                                style={{ width: 'min-content', minWidth: '200px', maxWidth: '350px' }}
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={props.selectedDevices?.audioOutput.deviceId}
                                                                onChange={(e) => props.setSelectedAudioOutput(e.target.value)}
                                                            >
                                                                {props.devices?.audioOutput.map(device => (
                                                                    <MenuItem key={device.deviceId} value={device.deviceId}>
                                                                        {device.label}
                                                                    </MenuItem>
                                                                ))}

                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>

                                    </Row>
                                }

                                {tab === 1 &&
                                    <Row>
                                        <Col>
                                            <Row className={classes.mainItemContainer}>
                                                <Col>
                                                    <Row className={classes.itemContainer}>
                                                        <Col>
                                                            <h5 className={classes.categoryTitle}>Camera</h5>
                                                        </Col>
                                                    </Row>
                                                    <Row className={classes.itemContainer}>
                                                        <Col>
                                                            <Select
                                                                style={{ width: 'min-content', minWidth: '200px', maxWidth: '350px' }}
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={props.selectedDevices?.videoInput.deviceId}
                                                                onChange={(e) => props.setSelectedVideoInput(e.target.value)}

                                                            >
                                                                {props.devices?.videoInput.map(device => (
                                                                    <MenuItem key={device.deviceId} value={device.deviceId}>
                                                                        {device.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>

                                    </Row>
                                }


                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>

        </Modal>
    );
}

export default SettingsModal;