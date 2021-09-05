import React from 'react'
import { Container, Spinner, Row, Col } from 'reactstrap'
import classes from './LoadingCall.module.css'
const LoadingCall = () => {
    return (
        <Container fluid className={classes.mainContainer}>
            <Row className={classes.loadingContainer}>
                <Col className={classes.loadingContentContainer}>
                    <Spinner color="primary" />
                    <h1 className={classes.loadingText}>Loading...</h1>
                </Col>
            </Row>
        </Container>
    )
}

export default LoadingCall
