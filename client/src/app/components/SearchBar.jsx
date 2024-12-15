

import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <TextField
                label="Search"
                variant="outlined"
                value={query}
                onChange={handleInputChange}
                style={{
                    marginRight: '10px',
                    width: '300px',
                    backgroundColor: '#ffffff', // White background for input bar
                    borderRadius: '4px'
                }}
                InputProps={{
                    style: {
                        color: '#333333' // Input text color
                    },
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                style={{
                    backgroundColor: '#ff8c42', 
                    color: '#ffffff'
                }}
            >
                Search
            </Button>
        </div>
    );
};

export default SearchBar;
