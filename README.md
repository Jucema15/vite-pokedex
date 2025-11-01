Proyecto Pokedex haciendo uso de Vite y React

1. Integrantes (nombres completos y roles elegidos).
   - Julio Cesar Mantilla Ramirez (BackEnd, FrontEnd, Lider de proyecto, Manager, etc)

2. Descripción corta del proyecto.
   Una Pokédex interactiva construida con React + Vite que muestra una lista paginada de Pokémon a la derecha y una pantalla principal a la izquierda.
   La pantalla principal puede mostrar información 2D o una tarjeta 3D interactiva del Pokémon seleccionado.
   El diseño recrea visualmente una Pokédex.
   
3. Breve explicación de cómo conectaron la API.   
   Servicio central: src/services/pokeApiService.js expone getPokeList(url) y getPokemonById(id).
   Internamente usa fetch (fetchJson) y mantiene caches en memoria: listCache por URL y pokemonCache por id/nombre para evitar llamadas repetidas.
   
   Hook consumidor: src/hooks/usePokeApi.js encapsula la lógica de uso del servicio y el estado (pokeList, prevUrl, nextUrl, pokeData, loadingList, loadingPoke, error).
   Provee fetchList(url) y fetchPokemon(idOrName) usados por componentes.
   
   Componente: src/components/Pokedex2D.jsx consume usePokeApi, llama fetchList() en mount y usa fetchList(prev/next) para la paginación.
   Al hacer click en un elemento de la lista llama fetchPokemon(id) para cargar la ficha completa. El flujo es: UI → usePokeApi → pokeApiService → PokeAPI.
   
   Manejo de paginación: la respuesta de la API incluye previous/next (URLs completas) que se almacenan y pasan directamente a getPokeList para navegar páginas.

   Manejo de errores/carga: usePokeApi maneja loading/error y los componentes muestran pantallas de carga y mensajes de error basados en esos estados.

   
4. Cómo decidieron representar los elementos (colores / figuras).
   
   Colores por tipo: hay un mapa TYPE_COLORS (en Card3D.jsx) que asigna un par de colores (top/bottom) a cada tipo de Pokémon.
   Ese gradiente se usa como fondo frontal de la tarjeta 3D para reforzar visualmente el tipo.
   
   Formas / emblemas 3D por tipo: para enfatizar el tipo se añade un emblema 3D sobre la carta:
        Fire → cono naranja (estilizado como llama).
        Water → esfera estirada/translucida (gota).
        Grass → plano/hoja verde ligeramente inclinado.
        Electric → prisma triangular/cono triangular (rayo) con emissive amarillo.
        Ice → octaedro / cristal azul claro, translúcido.
        (Estos emblemas se renderizan como meshes simples en Card3D para mantener rendimiento y coherencia.)
    
    
    
    
 
