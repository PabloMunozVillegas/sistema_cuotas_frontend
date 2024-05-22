import React, { useEffect, useState } from 'react';

const FechayHora = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-gray-700 text-xl">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
        </div>
    );
};

export default FechayHora;