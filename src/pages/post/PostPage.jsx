import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../../components/Post';
import Loader from '../../components/Loader';

const PostPage = (props) => {
    const navigate = useNavigate();

    const { postId } = useParams();

    const [post, setPost] = useState(null);
    const [currentUser, setCurrentUser] = useState({
        id: '',
        username: '',
        pfpPath: ''
    });

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }

        fetch(`http://localhost:5000/user`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setCurrentUser(data);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
            });
    }, [localStorage.getItem('token')]);

    useEffect(() => {

        fetch(`http://localhost:5000/post/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setPost(data);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [postId]);
    
    return (
    <>
        {
            post != null ? (
            <>
                <div className="main-container">
                    <Post post={post} viewer={currentUser} />    
                </div>
                <div className="button-back">
                    <button className="btn-back" onClick={() => navigate('/')}>
                        Back
                    </button>
                </div> 
            </>) : <div>
                <Loader/>
            </div>
        }
    </>
    );
};

export default PostPage;