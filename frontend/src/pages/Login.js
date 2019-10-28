import React, { useState } from 'react';
import logo from './../assets/logo.svg';
import './Login.css';

import api from './../services/api';

export default function Login({ history }) {

    const [username, setUsername] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        
        const response = await api.post('/devs', { username });
        
        const { _id: userId } = response.data;



        history.push(`/dev/${userId}`);
    }

    return(
        <div className="loginContainer">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev" />
                <input 
                    placeholder="Digite seu usuário no GitHub"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}