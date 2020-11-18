import React from 'react';
import Hello from './components/Hello';
import './styles/App.sass';

const App = () => {
    return (
        <div className='app'>
            <div className='container'>
                <Hello technology='React'></Hello>
            </div>
        </div>
    );
};

export default App;
