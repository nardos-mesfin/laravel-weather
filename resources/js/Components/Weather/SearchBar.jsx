// resources/js/Components/Weather/SearchBar.jsx

import React from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearchChange }) => {

    const loadOptions = async (inputValue) => {
        try {
            const response = await fetch(`/api/autocomplete?q=${inputValue}`);
            const data = await response.json();
            return {
                options: data.options,
            };
        } catch (error) {
            console.error("Autocomplete error:", error);
            return { options: [] };
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '1rem',
            color: 'white',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
            }
        }),
        input: (provided) => ({ ...provided, color: 'white' }),
        singleValue: (provided) => ({ ...provided, color: 'white' }),
        placeholder: (provided) => ({ ...provided, color: 'rgba(255, 255, 255, 0.7)' }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
        }),
    };

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <AsyncPaginate
                placeholder="Search for a city..."
                debounceTimeout={600}
                loadOptions={loadOptions}
                onChange={onSearchChange}
                styles={customStyles}
            />
        </motion.div>
    );
};

export default SearchBar;