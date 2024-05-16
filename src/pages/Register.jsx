import { Link, useNavigate } from 'react-router-dom';

function Register() {

    const navigate = useNavigate();
    
    const attemptRegister = () => {
        
        const username = document.querySelector('input[type="text"]').value;
        const password = document.querySelector('input[type="password"]').value;
        const confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;

        if (!username || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                console.log('Success:', response.status);
                // handle the response data here
                if (response.status === 406) {
                    alert('User with the same username already exists');
                } else if (response.status === 200) {
                    alert('User registered successfully');
                    navigate('/login');
                } else {
                    alert('Unexpected response from server');
                }
            })
            .catch(error => {
                // handle the error here
                console.error('Error:', error);
            })
    }


    return (
        <div className="card">
            <h1>Register</h1>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            
            <input type="password" placeholder="Confirm Password" />
            <button className="btn-main" onClick={attemptRegister}>
                Register
            </button>
            <p>
                <span className="text-zinc-200">or</span> <Link to="/login">log in</Link>
            </p>
        </div>
    )
}

export default Register;