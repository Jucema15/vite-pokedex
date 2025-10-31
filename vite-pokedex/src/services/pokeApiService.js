// Servicio global para consumir la PokeAPI con caching simple.
// Provee funciones reutilizables: getPokeList(url) y getPokemonById(id)

const API_BASE = "https://pokeapi.co/api/v2";

// caches simples en memoria
const listCache = new Map(); // key: url -> value: data
const pokemonCache = new Map(); // key: idOrName -> value: data

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const message = `Error ${res.status} fetching ${url}${text ? ": " + text : ""}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * Obtiene una lista paginada de Pokémon.
 * Usa caching por URL (previous/next también funcionan).
 * @param {string} [url] - URL completa a llamar. Si no se pasa, usa el endpoint por defecto.
 * @returns {Promise<Object>} - respuesta JSON de la API (results, previous, next, ...)
 */
export async function getPokeList(url = `${API_BASE}/pokemon?offset=0&limit=20`) {
  if (listCache.has(url)) {
    return listCache.get(url);
  }
  const data = await fetchJson(url);
  listCache.set(url, data);
  return data;
}

/**
 * Obtiene los datos completos de un Pokémon por id o nombre.
 * Cache por id/name para evitar llamadas repetidas.
 * @param {string|number} id - id o nombre del Pokémon
 * @returns {Promise<Object>} - objeto Pokémon completo
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

/**
 * Funciones utilitarias para testing / desarrollo:
 */
export function clearPokeListCache() {
  listCache.clear();
}

export function clearPokemonCache() {
  pokemonCache.clear();
}

export function getCachedPokemon(id) {
  return pokemonCache.get(String(id).toLowerCase());
}