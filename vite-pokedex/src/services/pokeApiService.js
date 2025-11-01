const API_BASE = "https://pokeapi.co/api/v2";

const listCache = new Map();
const pokemonCache = new Map();

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const message = `Error ${res.status} fetching ${url}${
      text ? ": " + text : ""
    }`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * Obtiene una lista paginada de Pokémon.
 */
export async function getPokeList(
  url = `${API_BASE}/pokemon?offset=0&limit=20`
) {
  if (listCache.has(url)) {
    return listCache.get(url);
  }
  const data = await fetchJson(url);
  listCache.set(url, data);
  return data;
}

/**
 * Obtiene los datos completos de un Pokémon por id o nombre.
 */
export async function getPokemonById(id) {
  const key = String(id).toLowerCase();
  if (pokemonCache.has(key)) {
    return pokemonCache.get(key);
  }
  const url = `${API_BASE}/pokemon/${key}`;
  const data = await fetchJson(url);
  pokemonCache.set(key, data);
  return data;
}

export function clearPokeListCache() {
  listCache.clear();
}

export function clearPokemonCache() {
  pokemonCache.clear();
}

export function getCachedPokemon(id) {
  return pokemonCache.get(String(id).toLowerCase());
}
