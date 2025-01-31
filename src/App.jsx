import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [word, setWord] = useState("");
    const [definition, setDefinition] = useState("");
    const [synonyms, setSynonyms] = useState("");
    const [hindi, setHindi] = useState("");
    const [marathi, setMarathi] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getInitialWord = async () => {
            try {
                const result = await chrome.storage.local.get(["selectedWord"]);
                if (result.selectedWord) {
                    setWord(result.selectedWord);
                    await fetchWordData(result.selectedWord);
                }
            } catch (err) {
                setError("Failed to load initial word");
            }
        };

        getInitialWord();
    }, []);

    const fetchWordData = async (wordToFetch) => {
        setLoading(true);
        setError(null);

        try {
            const definitionData = await getDefinition(wordToFetch);
            setDefinition(definitionData.definition);
            setSynonyms(definitionData.synonyms);

            const hindiTranslation = await translateWord(wordToFetch, "hi");
            setHindi(hindiTranslation);

            const marathiTranslation = await translateWord(wordToFetch, "mr");
            setMarathi(marathiTranslation);
        } catch (error) {
            setError("Failed to fetch word data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getDefinition = async (word) => {
        try {
            const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`;

            const response = await axios.get(url);

            if (!response.data || response.data.length === 0) {
                throw new Error("No definition found");
            }

            const definition = response.data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found";
            const synonyms = response.data[0]?.meanings[0]?.synonyms?.join(", ") || "No synonyms found";

            return { definition, synonyms };
        } catch (error) {
            throw new Error("Failed to fetch definition and synonyms");
        }
    };

    const translateWord = async (word, lang) => {
        try {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${lang}`;

            const response = await axios.get(url);

            return response.data.responseData?.translatedText || `No translation found`;
        } catch (error) {
            throw new Error(`Failed to fetch translation`);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">Loading data for "{word}"...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button onClick={() => fetchWordData(word)}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <p className="word">{word}</p>
            <div className="result-section">
                <p><strong>Definition:</strong> {definition}</p>
                <hr />
                <p><strong>Synonyms:</strong> {synonyms}</p>
                <hr />
                <p><strong>Hindi:</strong> {hindi}</p>
                <hr />
                <p><strong>Marathi:</strong> {marathi}</p>
            </div>
        </div>
    );
}

export default App;
