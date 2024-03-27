import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ThemeSelector.css"

const ThemeSelector = ({ onThemeSelect, language }) => {
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        fetchThemes(language);
    }, [language]);

    const fetchThemes = async (language) => {
        try {
            const response = await axios.get(`http://localhost:3002/themes/${language}`);
            setThemes(response.data);
        } catch (error) {
            console.error('Error fetching themes', error);
        }
    };

    return (
        <div className="theme-selector-container">
            <h2 className="theme-selector-title">Select a Theme:</h2>
            <ul className="theme-selector-list">
                {themes.map((theme) => (
                    <li
                        key={theme.id}
                        className="theme-selector-item"
                        onClick={() => onThemeSelect(theme.name)}
                    >
                        {theme.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThemeSelector;
