import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    function attemptLogin() {
        const username = document.querySelector('input[type="text"]').value;
        const password = document.querySelector('input[type="password"]').value;

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'User does not exist') {
                alert('User does not exist');
            } else if (data === 'Password is incorrect') {
                alert('Password is incorrect');
            } else {
                localStorage.setItem('token', data);
                navigate('/');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // handle enter key press
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });

    return (
        <div className="card">
            <h1>Log in</h1>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button onClick={attemptLogin} className="btn-main">
                Log in
            </button>
            <p>
                <span className="text-zinc-200">or</span> <Link to="/register">register</Link>
            </p>
        </div>
    )
}

export default Login;