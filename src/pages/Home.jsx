import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";
import Writer from "../components/Writer";
import Loader from "../components/Loader";
import Filler from "./Filler";

function Home(){
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(e.altKey && e.key === 'i'){
                navigate('/filler');
            }
        });
    }, [navigate]);

    useEffect(() => {
        fetch(`http://localhost:5000/posts`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                console.error('Error fetching posts:', error);
            });
    }, [localStorage.getItem('token')]);

    const [currentUser, setCurrentUser] = useState({
        id: '',
        username: '',
        pfpPath: ''
    });
    let currentUserId = '';

    const reloadPosts = () => {
        fetch(`http://localhost:5000/posts`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                console.error('Error fetching posts:', error);
            });
    }


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

    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const closeWriter = () => {
        document.getElementById('writer').classList.remove('open');
    }

    return (
        <div className="home">
        <div className="main-container">
            <div className="header">
                <div className="pfp">
                    <img src={currentUser.pfpPath} alt=""/>
                </div>
                <div className="username">
                    {currentUser.username}
                </div>
            </div>
            <div className="postlist">
                {posts.length === 0 ? (
                    <Loader/>                        
                ) : (
                    <>{posts.map(post => (
                        <Post key={post.id} post={post} viewer={currentUser} reloadPosts={reloadPosts} />
                    ))}</>
                )}
            </div>
        </div>
        <button className="btn-search" onClick={() => navigate('/search')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
        </button>
        <button className="btn-saved" onClick={() => navigate('/saved')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path  className="fill-teal-400" d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/>
            </svg>
        </button>
        <button className="btn-create" onClick={
            () => {
                console.log('clicked');
                document.getElementById('writer').classList.toggle('open');
                console.log(document.getElementById('writer').classList);
            }
        }>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-[24px] w-[24px]">
                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
            </svg>
        </button>
        <button onClick={logout} className="btn-logout">
            <span>
                Log out 
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
            </svg>
        </button>
        <div id="writer">
            <Writer currentUserId={ currentUser.id } reloadPosts={reloadPosts} closeWriter={closeWriter} />
        </div>
        </div>
    )
}

export default Home;