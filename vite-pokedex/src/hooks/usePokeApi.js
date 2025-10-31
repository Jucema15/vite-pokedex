import { useCallback, useState } from "react";
import { getPokeList, getPokemonById } from "../services/pokeApiService";

/**
 * usePokeApi - hook que encapsula llamadas a PokeAPI, estado de carga y errores.
 *
 * Retorna:
 * - pokeList, prevUrl, nextUrl, loadingList
 * - pokeData, loadingPoke
 * - fetchList(url), fetchPokemon(id)
 */
export default function usePokeApi(initialLimit = 20) {
  const [pokeList, setPokeList] = useState([]);
  const [prevUrl, setPrevUrl] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingList, setLoadingList] = useState(false);

  const [pokeData, setPokeData] = useState(null);
  const [loadingPoke, setLoadingPoke] = useState(false);

  const [error, setError] = useState(null);

  const fetchList = useCallback(
    async (url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${initialLimit}`) => {
      setLoadingList(true);
      setError(null);
      try {
        const data = await getPokeList(url);
        setPrevUrl(data.previous);
        setNextUrl(data.next);
        setPokeList(data.results || []);
        setPokeData(null);
      } catch (err) {
        console.error("usePokeApi fetchList error:", err);
        setError(err.message || "Error fetching list");
      } finally {
        setLoadingList(false);
      }
    },
    [initialLimit]
  );

  const fetchPokemon = useCallback(async (idOrName) => {
    if (!idOrName) return null;
    setLoadingPoke(true);
    setError(null);
    try {
      const data = await getPokemonById(idOrName);
      setPokeData(data);
      return data;
    } catch (err) {
      console.error("usePokeApi fetchPokemon error:", err);
      setError(err.message || "Error fetching Pokémon");
      return null;
    } finally {
      setLoadingPoke(false);
    }
  }, []);

  return {
    pokeList,
    prevUrl,
    nextUrl,
    loadingList,
    pokeData,
    loadingPoke,
    error,
    fetchList,
    fetchPokemon,
    // setters if outside needs to clear selection
    setPokeData,
  };
}