import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useSelector, useDispatch, connect } from 'react-redux';
import { setLanguage, setTheme } from '../redux/actions';
import ThemeSelector from "./ThemeSelector";
import "./Learn.css";

const LanguageThemeContext = createContext();

const Learn = () => {
    const dispatch = useDispatch();
    const selectedLanguage = useSelector(state => state.selectedLanguage);
    const selectedTheme = useSelector(state => state.selectedTheme);
    const [languages, setLanguages] = useState([]);
    const [themes, setThemes] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizMode, setQuizMode] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState(0);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get('http://localhost:3002/languages');
                setLanguages(response.data);
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };

        fetchLanguages();
    }, []);


    const handleLanguageSelect = async (selectedLanguage) => {
        dispatch(setLanguage(selectedLanguage));


        try {
            const response = await axios.get(`http://localhost:3002/themes/${selectedLanguage}`);
            setThemes(response.data);
        } catch (error) {
            console.error('Error fetching themes:', error);
        }
    };

    const handleThemeSelect = async (selectedTheme) => {
        dispatch(setTheme(selectedTheme)); // Используем экшен setTheme
        setCurrentFlashcardIndex(0);
        setCurrentQuizQuestionIndex(0);
        setIsFlipped(false);
        setQuizMode(false);

        try {
            const response = await axios.get(`http://localhost:3002/words/${selectedLanguage}/${selectedTheme}`);
            setFlashcards(response.data);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    };

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    const isOptionSelected = (option) => {
        return userAnswers === option;
    };

    const handleNextCard = () => {
        if (!quizMode) {
            if (currentFlashcardIndex < flashcards.length - 1) {
                setCurrentFlashcardIndex(currentFlashcardIndex + 1);
            } else {
                setCurrentFlashcardIndex(0);
            }
        } else {
            if (currentQuizQuestionIndex < quizQuestions.length - 1) {
                setCurrentQuizQuestionIndex(currentQuizQuestionIndex + 1);
            } else {
                setCurrentQuizQuestionIndex(0);
            }
        }

        setIsFlipped(false);
        setUserAnswers('');
    };

    const handlePreviousCard = () => {
        if (!quizMode) {
            if (currentFlashcardIndex > 0) {
                setCurrentFlashcardIndex(currentFlashcardIndex - 1);
            } else {
                setCurrentFlashcardIndex(flashcards.length - 1);
            }
        } else {
            if (currentQuizQuestionIndex > 0) {
                setCurrentQuizQuestionIndex(currentQuizQuestionIndex - 1);
            } else {
                setCurrentQuizQuestionIndex(quizQuestions.length - 1);
            }
        }

        setIsFlipped(false);
    };

    const handleTakeQuiz = () => {
        if (!selectedLanguage || !selectedTheme) {
            alert('Please select a language and a theme to take the quiz.');
            return;
        }

        const quizQuestions = flashcards.map(card => {
            const correctAnswer = card.answer;
            const options = shuffleArray(flashcards.map(flashcard => flashcard.answer));
            return { question: card.question, options, correctAnswer };
        });

        setQuizQuestions(quizQuestions);
        setUserAnswers('');
        setCorrectAnswers(0);
        setQuizMode(true);
    };

    const handleAnswerSelect = (selectedAnswer) => {
        setUserAnswers(selectedAnswer);
    };

    const handleSubmitQuiz = () => {
        const correctAnswer = quizQuestions[currentQuizQuestionIndex].correctAnswer;
        const isCorrect = userAnswers === correctAnswer;
        if (isCorrect) {
            setCorrectAnswers(correctAnswers + 1);
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <LanguageThemeContext.Provider value={{ selectedLanguage, selectedTheme, setLanguage, setTheme }}>
        <div className="section">
            <div className="language-selector">
                <h3>Languages</h3>
                <ul>
                    {languages.map((language) => (
                        <li key={language.id} onClick={() => handleLanguageSelect(language.name)}>
                            {language.name}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedLanguage && (
                <div className="theme-container">
                    <h3>Themes for {selectedLanguage}</h3>
                    <ThemeSelector themes={themes} onThemeSelect={handleThemeSelect} language={selectedLanguage} />
                </div>
            )}

            {selectedTheme && (
                <div className="quiz-container">
                    {quizMode ? (
                        <>
                            <h3 className="quiz-title">Quiz: {selectedTheme}</h3>
                            <div className="quiz-question">
                                <p>{quizQuestions[currentQuizQuestionIndex].question}</p>
                            </div>
                            <div className="quiz-options">
                                {quizQuestions[currentQuizQuestionIndex].options.map((option, idx) => (
                                    <div
                                        key={idx}
                                        className={`quiz-option ${isOptionSelected(option) ? 'selected-option' : ''}`}
                                        onClick={() => handleAnswerSelect(option)}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>

                            <button className="submit-button" onClick={handleSubmitQuiz}>Submit Quiz</button>
                            <p>Correct Answers: {correctAnswers}</p>
                        </>
                    ) : (
                        <div className={`card__inner ${isFlipped ? 'is-flipped' : ''}`} onClick={handleCardClick}>
                            {flashcards.length > 0 ? (
                                <>
                                    <div
                                        id="question"
                                        className={`question ${isFlipped ? 'hidden' : ''}`}
                                    >
                                        {flashcards[currentFlashcardIndex]?.question}
                                    </div>
                                    <div
                                        id="answer"
                                        className={`answer ${isFlipped ? '' : 'hidden'}`}
                                    >
                                        {flashcards[currentFlashcardIndex]?.answer}
                                    </div>
                                </>
                            ) : (
                                <p>Loading flashcards...</p>
                            )}
                        </div>
                    )}
                    <div className="button-container">
                        {!quizMode && <button onClick={handleTakeQuiz}>Take a Quiz</button>}
                        <button onClick={handlePreviousCard}>Previous</button>
                        <button onClick={handleNextCard}>Next</button>
                    </div>
                </div>
            )}

            {!selectedLanguage && (
                <div className="instruction-container">
                    <p className="instruction">Choose a language to start learning.</p>
                    <img src="5.png" alt="Placeholder" className="instruction-image"/>
                </div>
            )}
        </div>
        </LanguageThemeContext.Provider>
    );
};

const mapStateToProps = state => ({
    selectedLanguage: state.selectedLanguage,
    selectedTheme: state.selectedTheme
});

const mapDispatchToProps = {
    setLanguage,
    setTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(Learn);

export const useLanguageTheme = () => useContext(LanguageThemeContext);