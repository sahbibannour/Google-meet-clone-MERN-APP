import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Container, Row } from 'reactstrap'
import classes from './ExcludedPage.module.css'
const ExcludedPage = () => {
    return (
        <Container className={classes.mainContainer}>
            <Row >
                <Col className={classes.mainInfoContainer}>
                    <div>
                        <div className={classes.titleContainer}>
                            <h5 className={classes.titleText}>You have been excluded of this meeting</h5>
                        </div>
                        <div className={classes.buttonContainer}>
                            <Button tag={Link} to="/meet" color="primary" className={classes.returnButton}>
                                Back to home page
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ExcludedPage
