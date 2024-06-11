import React from 'react';

const InputField = ({ name, value, placeholder, onChange, required }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required={required}
            />
        </div>
    );
};

export default InputField;
