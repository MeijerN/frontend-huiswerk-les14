import React, {useEffect} from 'react';
import '../App.css';
import axios from "axios";

function PokemonDetails({pokemon}) {

    // State management
    const [data, setData] = React.useState({});
    const [error, setError] = React.useState('');

    // Load pokemon details on mount
    useEffect(() => {

        // Get cleanup token
        const source = axios.CancelToken.source();

        async function fetchData() {
            try {
                setError("");
                const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
                    cancelToken: source.token,
                });
                setData(result.data);
            } catch (e) {
                console.error(e);
                setError("Something went wrong with fetching pokemon details...");
            }
        }

        fetchData();
        // Cleanup function for API request cancelation
        return function cleanup() {
            source.cancel();
        }
    }, []);

    return (
        <>
            {error && <p className="error">{error}</p>}
            {Object.keys(data).length > 0 && <li className="pokemon-item">
                <h1>{data.name}</h1>
                <img src={data.sprites.front_default} alt={data.name}/>
                <p><b>Moves:</b> {data.moves.length}</p>
                <p><b>Weight:</b> {data.weight}</p>
                <div className="abilities-container">
                    <p><b>Abilities:</b></p>
                    <ul className="abilities-list" id="abilities">
                        {data.abilities.map((ability) => {
                            return (
                                <li className="ability-item" key={data.name + ability.ability.name}>
                                    {ability.ability.name}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </li>}
        </>
    );
}

export default PokemonDetails;