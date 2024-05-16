import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Search () {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const search = () => {
        fetch(`http://localhost:5000/users/search/${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data);
            })
            .catch(error => {
                console.error('Error searching for users:', error);
            });
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        search();
    }, [searchTerm]);

    return (
        <div className='searchpage'>
            <div className="searchbar">
                <input type="text" onChange={(e) => handleSearch(e)} />
                <button onClick={() => search()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </button>
            </div>
            <div className="search-results">
                {
                    searchResults.map(user => {
                        return (
                            <div key={user.id} className='result' onClick={
                                () => {
                                    navigate(`/user/${user.username}`);
                                }
                            }>
                                <h2>{user.username}
                                    {user.username === 'admin' ? 
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"/>
                                        </svg>
                                    </span> : ''}
                                </h2>
                                <img src={user.pfpPath} alt={user.username} />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Search;