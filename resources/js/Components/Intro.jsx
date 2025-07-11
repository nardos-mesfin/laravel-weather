// resources/js/Components/Intro.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { WiDayCloudy } from 'react-icons/wi'; // A nice, neutral weather icon

const Intro = () => {
    return (
        <motion.div 
            className="w-full h-screen flex flex-col items-center justify-center bg-gray-900"
            // This exit animation will be triggered by AnimatePresence in Weather.jsx
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <WiDayCloudy size={120} className="text-white" />
            </motion.div>
            <motion.h1
                className="text-white text-3xl font-bold mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Weatherly
            </motion.h1>
        </motion.div>
    );
};

export default Intro;