import React, { useEffect, useState } from 'react';

const FechayHora = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    const formattedDate = dateTime.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = dateTime.toLocaleTimeString();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-200 to-blue-200 text-gray-700">
            <div className="text-2xl mb-4 animate-fadeIn">{formattedDate}</div>
            <div className="text-6xl font-bold animate-fadeIn">{formattedTime}</div>
        </div>
    );
};

export default FechayHora;
