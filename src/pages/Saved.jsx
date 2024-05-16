import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import { useNavigate } from 'react-router-dom';

function Saved ({ currentUserId }) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState({
        id: '',
        username: '',
        pfpPath: ''
    });

    const reloadPosts = () => {
        fetch(`http://localhost:5000/saved/${currentUserId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data.sort((a, b) => {
                    return new Date(b.dateTime) - new Date(a.dateTime);
                });
                console.log(data);
                setPosts(data);
            })
            .catch(error => {
                console.error('Error fetching saved posts:', error);
            });
    }

    useEffect(() => {
        currentUserId = localStorage.getItem('token');
        reloadPosts();
    }
    , [currentUserId]);

    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/login');
        } else {
            currentUserId = localStorage.getItem('token');
            fetch('http://localhost:5000/users')
                .then(response => response.json())
                .then(data => {
                    setCurrentUser({
                        id: currentUserId,
                        username: data.find(user => user.id === currentUserId).username,
                        pfpPath: data.find(user => user.id === currentUserId).pfpPath
                    });
                    if (!currentUser) {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                });
        }
    });

    return (
        <div className="saved">
        <div className="main-container">
            <div className="header">
                <div className="pfp">
                    <img src={currentUser.pfpPath} alt=""/>
                </div>
                <div className="username">
                    {currentUser.username}'s saved posts
                </div>
            </div>
            <div className="postlist">
                {posts.map(post => (
                    <Post key={post.id} post={post} viewer={currentUser} reloadPosts={reloadPosts} />
                ))}
            </div>
        </div>
        <div className="button-back">
            <button className="btn-back" onClick={() => navigate('/')}>
                Back
            </button>
        </div>
    </div>
    )
}

export default Saved;