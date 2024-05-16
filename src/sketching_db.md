### Likes and saves table
- `user_id` (int) - the id of the user who liked or saved the post
- `post_id` (int) - the id of the post that was liked or saved
- `like` (bool) - whether the user liked the post or not
- `save` (bool) - whether the user saved the post or not


CREATE TABLE likes (
    user_id TEXT REFERENCES users(id),
    post_id TEXT REFERENCES posts(id),
    like_id TEXT 
);
CREATE TABLE saves (
    user_id TEXT REFERENCES users(id),
    post_id TEXT REFERENCES posts(id),
    save_id TEXT
);
