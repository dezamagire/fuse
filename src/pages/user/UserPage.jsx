import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../../components/Post';

const UserPage = (props) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({
        id: '',
        username: '',
        pfpPath: ''
    });

    const { username } = useParams();
    const [user, setUser] = useState(
        {
            id: '',
            username: '',
            pfpPath: ''
        }
    );
    const [posts, setPosts] = useState([]);

    const getPostsByUserId = (userId) => {
        fetch(`http://localhost:5000/posts/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
            .then(response => response.json())
            .then(data => {
                data.sort((a, b) => {
                    return new Date(b.dateTime) - new Date(a.dateTime);
                });
                setPosts(data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    useEffect(() => {
        fetch('http://localhost:5000/users')
            .then(response => response.json())
            .then(data => {
                setCurrentUser({
                    id: localStorage.getItem('token'),
                    username: data.find(user => user.id === localStorage.getItem('token')).username,
                    pfpPath: data.find(user => user.id === localStorage.getItem('token')).pfpPath
                });
                if (!currentUser) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            });
            fetch(`http://localhost:5000/users/username/${username}`)
            .then(response => response.json())
            .then(data => {
                setUser(data[0]);
                getPostsByUserId(data[0].id);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
            });
        }, [username, navigate]);

    return (
        <div>
            <div className="main-container">
            <div className="header">
                <div className="username">
                    { user.username[user.username.length - 1] === 's' ?
                        <h1>{user.username}' posts</h1> :
                        <h1>{user.username}'s posts</h1>
                    }
                </div>
            </div>
            <div className="postlist">
                {posts.map(post => (
                    <Post key={post.id} post={post} viewer={currentUser} />
                ))}
            </div>
        </div>
        <div className="button-back">
            <button className="btn-back" onClick={() => navigate('/')}>
                Back
            </button>
        </div>
        </div>
    );
};

export default UserPage;