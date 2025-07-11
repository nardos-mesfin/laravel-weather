// resources/js/Components/Intro.jsx

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground'; // Import our new stage

const Intro = () => {
    return (
        <motion.div
            key="intro-screen"
            className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        >
            {/* The background animations are now their own component */}
            <AnimatedBackground />

            {/* The brand name, which appears after the background has established itself */}
            <motion.div
                className="relative z-10 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.0, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <h1 className="text-white text-5xl font-bold tracking-wider drop-shadow-lg"
                    style={{ textShadow: '0px 0px 15px rgba(255,255,255,0.3)' }}
                >
                    Weatherly
                </h1>
                <p className="text-white/60 text-lg mt-2">Loading your forecast...</p>
            </motion.div>
        </motion.div>
    );
};

export default Intro;