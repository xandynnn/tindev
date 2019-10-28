import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import logo from './../assets/logo.svg';
import like from './../assets/like.svg';
import dislike from './../assets/dislike.svg';
import itsamatch from './../assets/itsamatch.png';

import api from './../services/api';

import './Main.css';

const Main = ({ match }) => {

    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    //Atualização do estado
    useEffect(() => {
        
        async function loadUsers(){
            const response = await api.get('/devs', { 
                headers: { user: match.params.id }
            })
            setUsers(response.data);
        }

        loadUsers();

    }, [match.params.id]);

    useEffect(()=>{
        const socket = io('http://localhost:3333',{
            query: { user: match.params.id }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        })

    },[match.params.id])

    // Like
    async function handleLike(id){
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id }
        });

        // não posso trabalhar como user array, preciso setar todos os usuarios
        // novamente com o setUsers. 
        setUsers(users.filter(user => user._id !== id))
    }

    // Like
    async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id }
        });

        // não posso trabalhar como user array, preciso setar todos os usuarios
        // novamente com o setUsers. 
        setUsers(users.filter(user => user._id !== id))
    }

    return (
        <div className="mainContainer">
            <Link to="/">
                <img src={logo} alt="TinDev" />
            </Link>
            { users.length > 0 ? (
                <ul>
                    { users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like" />
                                </button>
                            </div>
                        </li>
                        ))
                    }
                </ul>
            ) : (
                <div className="empty">Acabou</div>
            )}

            { matchDev &&
                <div className="matchContainer">
                    <img src={itsamatch} alt="Its a match" />
                    <img className="avatar" src={matchDev.avatar} alt=""/>
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>
                    <button type="button" onClick={()=>setMatchDev(false)}>FECHAR</button>
                </div>
            }

        </div>
    );
}

export default Main;
