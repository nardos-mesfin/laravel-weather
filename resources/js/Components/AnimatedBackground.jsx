// resources/js/Components/AnimatedBackground.jsx

import React, { useMemo } from 'react';

const generateParticles = (count, type) => {
    return Array.from({ length: count }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 4}s`,
        };
        if (type === 'rain') {
            style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        }
        return <div key={`${type}-${i}`} className={type} style={style}></div>;
    });
};

const AnimatedBackground = () => {
    const raindrops = useMemo(() => generateParticles(70, 'raindrop'), []);
    const windStreaks = useMemo(() => generateParticles(20, 'wind-streak'), []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="sun-ray-container">
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
            </div>
            {raindrops}
            {windStreaks}
        </div>
    );
};

export default AnimatedBackground;