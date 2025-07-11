// resources/js/Components/Weather/DetailCard.jsx

import React from 'react';

const DetailCard = ({ icon, title, value, unit }) => {
    return (
        <div className="glass-card p-4 flex flex-col justify-center">
            <h4 className="flex items-center gap-2 text-sm opacity-80">
                {icon}
                {title}
            </h4>
            <p className="text-2xl font-semibold">
                {value}
                {unit && <span className="text-lg"> {unit}</span>}
            </p>
        </div>
    );
};

export default DetailCard;