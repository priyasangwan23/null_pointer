import React from 'react';
import './DotsLoader.css';

// Simple animated dot loader to indicate ongoing processing
export default function Loader({ size = 40, color = '#4B3621' }) {
    const dotStyle = {
        width: size / 5,
        height: size / 5,
        backgroundColor: color,
        margin: size / 10,
    };
    return (
        <div className="dots-loader" style={{ height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="dot" style={dotStyle} />
            <div className="dot" style={dotStyle} />
            <div className="dot" style={dotStyle} />
        </div>
    );
}
