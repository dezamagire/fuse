import React, { useEffect, useState } from 'react';

function Post({ post , viewer, reloadPosts }) {

    const [currentPost, setCurrentPost] = useState(post); 

    const [poster, setPoster] = useState({
        id: '',
        username: '',
        pfpPath: ''
    });

    useEffect(() => {
        getUserById(currentPost.userId)
        .then(data => {
            setPoster({
                id: currentPost.userId,
                username: data.username,
                pfpPath: data.pfpPath
            });
        });
    }, [currentPost.userId]);

    const likePost = () => {
        fetch('http://localhost:5000/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: post.id, userId: viewer.id })
        })
        .then(response => {
            // console.log('Success:', response.status);
            if(response.status === 200){
                setCurrentPost(
                    {
                        ...currentPost,
                        liked: true,
                        likeCount: currentPost.likeCount + 1
                    }
                );
                console.log("liked post[" + post.id + "] by user[" + viewer.id + "]");
            } else if(response.status === 202){
                setCurrentPost(
                    {
                        ...currentPost,
                        liked: false,
                        likeCount: currentPost.likeCount - 1
                    }
                );
                console.log("unliked post[" + post.id + "] by user[" + viewer.id + "]");
            } else {
                console.log("error");
            }

        }
        );
    }
    
    const savePost = () => {
        fetch('http://localhost:5000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: post.id, userId: viewer.id })
        })
        .then(response => {
            // console.log('Success:', response.status);
            if(response.status === 200){
                setCurrentPost(
                    {
                        ...currentPost,
                        saved: true
                    }
                );
                console.log("saved post[" + post.id + "] by user[" + viewer.id + "]");
            } else if(response.status === 202){
                console.log("unsaved post[" + post.id + "] by user[" + viewer.id + "]");
                setCurrentPost(
                    {
                        ...currentPost,
                        saved: false
                    }
                );
            } else {
                console.log("error");
            }
        }
        );
    }

    const getUserById = (id) => {
        return fetch('http://localhost:5000/users/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }  
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
    }

    const timeSince = (date) => {
        let seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);
      
        if (interval > 1) {
          return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        // show 1 hour ago if it's been more than 60 minutes but less than 120 minutes
        if (interval === 1) {
            return "1 hour ago";
        }
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }

    const menuClick = () => {
        const modal = document.getElementById(`modal-${post.id}`);
        modal.classList.add('show');
    }

    const closeModal = () => {
        const modal = document.getElementById(`modal-${post.id}`);
        modal.classList.remove('show');
    }


    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href + "post/" + post.id);
        closeModal();
    }

    const deletePost = () => {
        fetch('http://localhost:5000/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: post.id })
        })
        .then(response => {
            if(response.status === 200){
                console.log("deleted post[" + post.id + "]");
                reloadPosts();
            } else {
                console.log("error");
            }
        }
        );
    }

    return (
        <div className="flex flex-row">
        <div className="post" id={`post-${post.id}`}>
            <div className="main">
                <div className="poster-info">
                    <img src={poster.pfpPath} alt="profile-pic" className="profile-pic"/>
                    <div className="poster-name">
                        {poster.username}
                        <span className='time-tag'>
                            { timeSince(new Date(currentPost.dateTime))}
                        </span>    
                    </div>
                </div>
                <div className="post-content">
                    {currentPost.content}
                </div>
            </div>
            <div className="post-actions">
                <div className="menu-btn" onClick={() => {
                    menuClick(this);
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
                </svg>
                </div>
                <div className="save-btn" onClick={() => {savePost();}}>
                    {currentPost.saved ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path  className="fill-teal-400" d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/>
                        </svg>    
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"/>
                        </svg>  
                    )}
                </div>
                <div className="like-btn" onClick={() => {likePost();}}>  
                    {currentPost.liked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path className="fill-pink-600" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                        </svg>    
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
                        </svg>    
                    )}
                    <div className="likes-count">
                        {currentPost.likeCount}
                    </div>
                </div>
            </div>
        </div>
        <div className="modal" id={`modal-${post.id}`}>
            <button className="copy-link-btn" onClick={() => {copyLink()}}>Copy Link</button>
            {(viewer.id === currentPost.userId || viewer.id === "3886f3d6-bf21-43b5-8cbb-0aa813d49319") && (
                <button className="delete-post-btn" onClick={() => {deletePost()}}>Delete Post</button>
            )}
            <div className="cls" onClick={() => {closeModal()}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </div>
        </div>
    </div>
    );
};

export default Post;