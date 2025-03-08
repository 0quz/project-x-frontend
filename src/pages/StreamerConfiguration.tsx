import axios from "axios";
import { useState, useEffect } from 'react';
import { Input } from 'antd';
import ConfigurationCard from '../components/ConfigurationCard';


const App: React.FC = () => {

return (
        <>
        <ConfigurationCard title="Set Up Media Player" content="To use media in your stream add username"/>
        </>
    );
};

export default App;