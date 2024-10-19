import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PokemonDetail = () => {
  const { id } = useParams(); 
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [abilitiesDetails, setAbilitiesDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPokemonDetail = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const data = await response.json();
      setPokemonDetail(data);

      const abilitiesPromises = data.abilities.map(async (ability) => {
        const abilityResponse = await fetch(ability.ability.url);
        return await abilityResponse.json();
      });
      
      const abilitiesData = await Promise.all(abilitiesPromises);
      setAbilitiesDetails(abilitiesData);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonDetail();
  }, [id]);

  if (loading) return <p>Loading Pokémon details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Pokémon Detail</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Pokémon personal details.</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pokemonDetail.name}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Abilities</dt>
            <ul>
            {abilitiesDetails.map((abilityDetail, index) => (
                <li key={index}>
                    <dd className="mt-1 text-sm leading-6 font-medium text-gray-900 sm:col-span-2 sm:mt-0">{abilityDetail.name}:</dd>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{abilityDetail.effect_entries[0]?.effect || 'No effect description available'}</dd>
                </li>
            ))}
            </ul>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Forms</dt>
            <ul>
            {pokemonDetail.forms.map((form, index) => (
                <li key={index}>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{form.name}</dd>
                </li>
            ))}
            </ul>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Cries</dt>
            <audio controls>
                <source src={pokemonDetail.cries?.latest} type="audio/ogg" />
                Your browser does not support the audio element.
            </audio>
          </div>
        </dl>
      </div>
    </div>
  )
};

export default PokemonDetail;
