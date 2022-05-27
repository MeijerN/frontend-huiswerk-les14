import React, {useEffect} from 'react';
import './App.css';
import pokemon from "./assets/pokemon.png"
import axios from "axios";
import PokemonDetails from "./components/PokemonDetails";

function App() {

    const [data, setData] = React.useState({});
    const [error, setError] = React.useState("");
    const [loading, toggleLoading] = React.useState(false);
    const [endpoint, setEndPoint] = React.useState("");

    // Fetch first 20 pokemon names en url's on mounting
    useEffect(() => {

        // Get cleanup token
        const source = axios.CancelToken.source();

        async function fetchData() {
            try {
                toggleLoading(true);
                setError("");
                const result = await axios.get('https://pokeapi.co/api/v2/pokemon', {
                    cancelToken: source.token,
                });
                setData(result.data);
                toggleLoading(false);
            } catch (e) {
                toggleLoading(false);
                console.error(e);
                setError("Oops, something went wrong. Please refresh the page...");
            }
        }

        fetchData();
        // Cleanup function for API request cancelation
        return function cleanup() {
            source.cancel();
        }
    }, []);

    useEffect(() => {

        // Get cleanup token
        const source = axios.CancelToken.source();

        async function handleEndPointChange() {
            try {
                // Check if update useeffect is not triggered bij initialisation
                if (endpoint) {
                    toggleLoading(true);
                    setError("");
                    const result = await axios.get(endpoint, {
                        cancelToken: source.token,
                    });
                    setData(result.data);
                    toggleLoading(false);
                }
            } catch (e) {
                toggleLoading(false);
                console.error(e);
                setError("Oops, something went wrong. Please try again...");
            }
        }

        handleEndPointChange();
        // Cleanup function for API request cancelation
        return function cleanup() {
            source.cancel();
        }
    }, [endpoint]);

    async function handleNext() {
        setEndPoint(data.next);
    }

    async function handlePrevious() {
        setEndPoint(data.previous);
    }

    return (
        <>
            <header>
                <img className="header-image" src={pokemon} alt="pokemon"/>
                <div className="buttons-container">
                    <button onClick={handlePrevious} disabled={!data.previous}>Vorige</button>
                    <button onClick={handleNext} disabled={!data.next}>Volgende</button>
                </div>
            </header>
            {error && <p className="error">{error}</p>}
            {loading && <p className="loading">LOADING...</p>}
            <ul className="pokemon-list">
                {Object.keys(data).length > 0 && data.results.map((pokemon) => {
                    return (
                        <PokemonDetails
                            key={pokemon.url}
                            pokemon={pokemon.name}
                        />
                    )
                })}
            </ul>
        </>
    );
}

export default App;