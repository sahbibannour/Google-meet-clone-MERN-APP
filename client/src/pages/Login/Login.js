import React from 'react';
import { Row, Col, Container } from 'reactstrap';
import classes from './Login.module.css';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import GlobalContext from '../../context/GlobalContext';
import axios from '../../utils/axios'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',

        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#696974',
            borderWidth: 2,
            borderRadius: 30,
        },

        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#007FFF',
        },
        '& .MuiOutlinedInput-input': {
            color: '#696974',
            paddingLeft: '1em',
            paddingBottom: '15px',
            paddingTop: '12px',
        },

        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
            color: '#007FFF',
            paddingLeft: '1em',
            paddingBottom: '15px',
            paddingTop: '12px',
        },
        '& .MuiInputLabel-outlined': {
            color: '#696974',
        },

        '& .MuiInputLabel-outlined.Mui-focused': {
            color: '#007FFF',
        },
    },

    label: {
        backgroundColor: 'white',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: -6,
    },
}));

const Login = (props) => {
    const classesMat = useStyles();
    const context = React.useContext(GlobalContext)
    const [userInfo, setUserInfo] = React.useState({})
    const history = useHistory()
    const loginHandler = () => {
        axios.post('/user', { user: userInfo })
            .then(res => {
                context.setUser(res.data.user)
                history.replace('/meet')

            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Container fluid>
            <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Col >
                    <Row>
                        <Col className={classes.container}>
                            <h1 className={classes.title}>Sign In</h1>
                            <p className={classes.description}>
                                Just sign in if you have an account in here.
                            </p>
                            <p className={classes.description}>Enjoy our Website.. </p>
                        </Col>
                    </Row>
                    <Row className={classes.main}>
                        <Col xs='11' sm='7' md='6' lg='4' className={classes.block}>
                            <Row className={classesMat.root}>
                                <Col xs='12' style={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        InputLabelProps={{
                                            classes: {
                                                root: classesMat.label,
                                            },
                                        }}
                                        variant='outlined'
                                        margin='normal'
                                        label='First name'
                                        className={classes.field}
                                        value={userInfo.firstName || ''}
                                        onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row className={classesMat.root}>
                                <Col
                                    xs='12'
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TextField
                                        InputLabelProps={{
                                            classes: {
                                                root: classesMat.label,
                                            },
                                        }}
                                        className={classes.field}
                                        id='outlined-password-input'
                                        label='Last name'
                                        autoComplete='current-password'
                                        variant='outlined'
                                        value={userInfo.lastName || ''}
                                        onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row className={classesMat.root}>
                                <Col xs='12' style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        className={classes.loginBtn}
                                        onClick={() => loginHandler()}
                                    >
                                        Connect
                                    </button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
