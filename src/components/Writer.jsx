function Writer ({ currentUserId, closeWriter, reloadPosts }) {

    const submitPost = () => {
        let content = document.querySelector('textarea').value;
        fetch('http://localhost:5000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: content, userId: currentUserId })
        })
            .then(response => {
                console.log(response);
                if(response.status === 200){
                    reloadPosts();
                    closeWriter();
                }
            }
            )
    }

    // if esc key is pressed, close the writer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeWriter();
        }
    });

    return (
        <div className="writer">
            <textarea></textarea>
            <button className="post-btn" onClick={() => submitPost()}>Post</button>
        </div>
  );
}

export default Writer;