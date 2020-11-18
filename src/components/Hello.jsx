import React from 'react';
import './../styles/Hello.scss';

const Component = ({ technology }) => {
    return <h1 className='hello'>Hello from {technology}!</h1>;
};

export default Component;
