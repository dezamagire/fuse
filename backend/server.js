const express = require('express');
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemon = require('nodemon');

// Define your salt rounds for the password encryption
const saltRounds = 10;

const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fuse'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected');
});

// Define your API endpoints here

// Get all users
app.get('/users', (req, res) => {
    let sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
}
);

// Get user by id
app.get('/users/:id', (req, res) => {
    let sql = `SELECT * FROM users WHERE id = '${req.params.id}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    }
    );
}
);

// Create a user with data from the request ({ username, password })
app.post('/users', async (req, res) => {
    let id = uuidv4();

    let username = req.body.username;
    let password = req.body.password;

    // check if user with the same username already exists
    let sqlCheck = `SELECT * FROM users WHERE username = '${username}'`;
    
    const checkForExistingUser = await new Promise((resolve, reject) => {
        db.query(sqlCheck, (err, result) => {
            if (err) throw err;
            resolve(result);
        });
    });

    if (checkForExistingUser.length > 0) {
        return res.status(406).send('User with the same username already exists');
    }

    // encrypt the password

    let bcrpytHash = await bcrypt.hash(password, saltRounds);

    password = bcrpytHash;

    let sql = `INSERT INTO users (id, username, pfpPath, password) VALUES ('${id}', '${username}', 'https://i.pravatar.cc/250?u=${username}'    , '${password}')`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        return res.send('User added...');
    }
    );

}
);

// get a user by username
app.get('/users/username/:username', (req, res) => {
    let sql = `SELECT * FROM users WHERE username = '${req.params.username}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
}
);

// Update a user by id
app.put('/users/:id', (req, res) => {
    let newUsername = req.body.username;
    let newPassword = req.body.password;

    // encrypt the password
    bcrypt.hash(newPassword, saltRounds, function(err, hash) {
        newPassword = hash;
    });

    let sql = `UPDATE users SET username = '${newUsername}', password = '${newPassword}' WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        return res.send('User updated...');
    }
    );
}
); 

// Delete a user by id
app.delete('/users/:id', (req, res) => {
    let sql = `DELETE FROM users WHERE id = '${req.params.id}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        return res.send('User deleted...');
    }
    );
}
);


// Create a post with data from the request ({ content, userId })
app.post('/posts', (req, res) => {
    let id = uuidv4();
    let content = req.body.content;
    let userId = req.body.userId;
    let sql = `INSERT INTO posts (id, content, userId) VALUES ('${id}', '${content}', '${userId}')`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        return res.send('Post added...');
    });
});

// Get posts by user id
app.get('/posts/user/:userid', (req, res) => {
    let viewerId = req.headers.authorization.split(' ')[1];
    let sql = `SELECT posts.*, COUNT(likes.postId) AS likeCount, COUNT(saves.postId) AS saveCount,
                CASE WHEN likes.userId = "${viewerId}" THEN true ELSE false END AS liked,
                CASE WHEN saves.userId = "${viewerId}" THEN true ELSE false END AS saved
                FROM posts
                LEFT JOIN likes ON posts.id = likes.postId
                LEFT JOIN saves ON posts.id = saves.postId
                WHERE posts.userId = '${req.params.userid}'
                GROUP BY posts.id`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        console.log(result);
        return res.send(result);
    });
});


// Get all posts
app.get('/posts', (req, res) => {
    let userId = req.headers.authorization.split(' ')[1];
    let sql = `SELECT posts.*, COUNT(likes.postId) AS likeCount, COUNT(saves.postId) AS saveCount,
               CASE WHEN likes.userId = "${userId}" THEN true ELSE false END AS liked,
               CASE WHEN saves.userId = "${userId}" THEN true ELSE false END AS saved
               FROM posts
               LEFT JOIN likes ON posts.id = likes.postId
               LEFT JOIN saves ON posts.id = saves.postId
               GROUP BY posts.id`;
    db.query(sql, [req.query.userId, req.query.userId], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
}
);

// try to login, first check if user exists, then check if password is correct
app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let sql = `SELECT * FROM users WHERE username = '${username}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.send('User does not exist');
        } else {
            bcrypt.compare(password, result[0].password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    // send the user id to the client
                    res.send(result[0].id);
                } else {
                    res.send('Password is incorrect');
                }
            });
        }
    }
    );
}
);

// add a like or unlike to a post by post id and user id
app.post('/like', (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;

    let sqlCheck = `SELECT * FROM likes WHERE postId = '${postId}' AND userId = '${userId}'`;

    db.query(sqlCheck, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            let sql = `DELETE FROM likes WHERE postId = '${postId}' AND userId = '${userId}'`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                return res.status(202).send('Like removed...');
            });
        } else {
            let like_id = uuidv4();
            let sql = `INSERT INTO likes (postId, userId, likeId) VALUES ('${postId}', '${userId}', '${like_id}')`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                return res.send('Like added...');
            });
        }
    });
}
);

app.post('/save', (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;

    let sqlCheck = `SELECT * FROM saves WHERE postId = '${postId}' AND userId = '${userId}'`;

    db.query(sqlCheck, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            let sql = `DELETE FROM saves WHERE postId = '${postId}' AND userId = '${userId}'`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                return res.status(202).send('Save removed...');
            });
        } else {
            let save_id = uuidv4();
            let sql = `INSERT INTO saves (postId, userId, saveId) VALUES ('${postId}', '${userId}', '${save_id}')`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                return res.send('Save added...');
            });
        }
    });
})

// delete a post by id (and all likes and saves associated with it)
app.post('/delete', (req, res) => {
    let postId = req.body.postId;
    let sql = `DELETE FROM posts WHERE id = '${postId}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        return res.send('Post deleted...');
    });
});

// get post by id
app.get('/post/:postId', (req, res) => {
    let postId = req.params.postId;
    let sql = `SELECT posts.*, COUNT(likes.postId) AS likeCount, COUNT(saves.postId) AS saveCount,
               CASE WHEN likes.userId = "${req.headers.authorization.split(' ')[1]}" THEN true ELSE false END AS liked,
               CASE WHEN saves.userId = "${req.headers.authorization.split(' ')[1]}" THEN true ELSE false END AS saved
               FROM posts
               LEFT JOIN likes ON posts.id = likes.postId
               LEFT JOIN saves ON posts.id = saves.postId
               WHERE posts.id = "${postId}"
               GROUP BY posts.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

// get all saved posts by user id
app.get('/saved/:userId', (req, res) => {
    let userId = req.params.userId;
    let sql = `SELECT posts.*, COUNT(likes.postId) AS likeCount, COUNT(saves.postId) AS saveCount,
               CASE WHEN likes.userId = "${userId}" THEN true ELSE false END AS liked,
               CASE WHEN saves.userId = "${userId}" THEN true ELSE false END AS saved
               FROM posts
               LEFT JOIN likes ON posts.id = likes.postId
               LEFT JOIN saves ON posts.id = saves.postId
               WHERE posts.id IN (SELECT postId FROM saves WHERE userId = "${userId}")
               GROUP BY posts.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Search for users
app.get('/users/search/:searchTerm', (req, res) => {
    let searchTerm = req.params.searchTerm;
    let sql = `SELECT * FROM users WHERE username LIKE '%${searchTerm}%'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
