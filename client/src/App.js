import AppContext from './context/AppContext';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MeetHome from './pages/MeetHome/MeetHome';
import Login from './pages/Login/Login';
import Meet from './pages/Meet/Meet'


const App = () => {
    return (
        <AppContext>
            <BrowserRouter>
                <Switch>
                    <Route path='/login' render={(props) => <Login {...props} />} />
                    <Route path='/meet/:meetId' render={(props) => <Meet {...props} />} />
                    <Route path='/meet' render={(props) => <MeetHome {...props} />} />

                    <Redirect to='/login' />
                </Switch>
            </BrowserRouter>
        </AppContext>
    );
};

export default App;
