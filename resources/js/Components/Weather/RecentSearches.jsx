// resources/js/Components/Weather/RecentSearches.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiX } from 'react-icons/fi'; // Import the 'X' icon

const RecentSearches = ({ searches, onSearch, onDelete }) => { // 1. Accept the new onDelete prop
    if (!searches || searches.length === 0) {
        return null;
    }

    // Prevent the click on the 'X' from bubbling up and triggering a search
    const handleDeleteClick = (e, search) => {
        e.stopPropagation(); // This is important!
        onDelete(search);
    };

    return (
        <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <div className="glass-card p-3">
                <h3 className="flex items-center gap-2 text-xs font-bold text-white/70 mb-2 px-1">
                    <FiClock />
                    RECENT SEARCHES
                </h3>
                <div className="flex flex-wrap gap-2">
                    {searches.map(search => (
                        // Changed this from a <button> to a <div> to act as a better container
                        <div
                            key={`${search.lat}-${search.lon}`}
                            onClick={() => onSearch(search)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-1 pl-3 pr-2 rounded-full transition-colors duration-200 cursor-pointer"
                        >
                            <span>{search.name}</span>
                            
                            {/* 2. Add the delete button with an icon */}
                            <button 
                                onClick={(e) => handleDeleteClick(e, search)}
                                className="p-1 rounded-full hover:bg-red-500/50 text-white/70 hover:text-white transition-colors"
                                aria-label={`Delete ${search.name}`}
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default RecentSearches;