import React from 'react';
import GlobalContext from './GlobalContext';
import io from 'socket.io-client';

const AppContext = (props) => {
    const [user, setUser] = React.useState(null)
    const socket = React.useState(io(process.env.REACT_APP_WEBSOCKETURL))[0];

    return (
        <GlobalContext.Provider value={{
            user,
            setUser,
            socket
        }}>
            {props.children}
        </GlobalContext.Provider>
    );
};

export default AppContext;
