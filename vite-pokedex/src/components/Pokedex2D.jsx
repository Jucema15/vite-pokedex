import React, { useEffect } from "react";
import "./Pokedex2D.css";
import usePokeApi from "../hooks/usePokeApi";
import Card3D from "./Card3D";

const TYPES = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];
const LIST_LENGTH = 20;

const capitalize = (str) => (str ? str[0].toUpperCase() + str.substr(1) : "");

/**
 * Pokedex2D (actualizado) - ahora usa hook usePokeApi y muestra Card3D a la izquierda.
 */
function Pokedex2D() {
  const {
    pokeList,
    prevUrl,
    nextUrl,
    loadingList,
    pokeData,
    loadingPoke,
    error,
    fetchList,
    fetchPokemon,
  } = usePokeApi(LIST_LENGTH);

  useEffect(() => {
    // carga inicial
    fetchList();
  }, [fetchList]);

  function handleListClick(id) {
    fetchPokemon(id);
  }

  function renderList() {
    const items = [];
    for (let i = 0; i < LIST_LENGTH; i++) {
      const poke = pokeList[i];
      if (poke) {
        const urlArray = poke.url.split("/");
        const id = urlArray[urlArray.length - 2];
        items.push(
          <div
            key={id}
            className="list-item"
            onClick={() => handleListClick(id)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleListClick(id);
            }}
          >
            {id + ". " + capitalize(poke.name)}
          </div>
        );
      } else {
        items.push(
          <div key={"empty-" + i} className="list-item">
            {/* vacío */}
          </div>
        );
      }
    }
    return items;
  }

  function renderPokeScreen() {
    if (!pokeData) {
      return (
        <div className="main-screen hide">
          {/* opcional */}
        </div>
      );
    }
    const dataTypes = pokeData.types || [];
    const firstType = dataTypes[0]?.type?.name;
    const secondType = dataTypes[1]?.type?.name;
    const mainScreenClasses = ["main-screen"];
    if (firstType && TYPES.includes(firstType)) mainScreenClasses.push(firstType);

    return (
      <div className={mainScreenClasses.join(" ")}>
        <div className="screen__header">
          <span className="poke-name">{capitalize(pokeData.name)}</span>
          <span className="poke-id">#{pokeData.id.toString().padStart(3, "0")}</span>
        </div>
        <div className="screen__image">
          <img src={pokeData.sprites?.front_default || ""} className="poke-front-image" alt="front" />
          <img src={pokeData.sprites?.back_default || ""} className="poke-back-image" alt="back" />
        </div>
        <div className="screen__description">
          <div className="stats__types">
            <span className="poke-type-one">{firstType ? capitalize(firstType) : ""}</span>
            {secondType ? <span className="poke-type-two">{capitalize(secondType)}</span> : <span className="poke-type-two hide"></span>}
          </div>
          <div className="screen__stats">
            <p className="stats__weight">
              weight: <span className="poke-weight">{pokeData.weight}</span>
            </p>
            <p className="stats__height">
              height: <span className="poke-height">{pokeData.height}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pokedex-3d-layout">
      {/* Card3D a la izquierda; le pasamos el pokemon seleccionado */}
      <Card3D pokemon={pokeData} />

      {/* Pokedex 2D */}
      <div className="pokedex">
        <div className="left-container">
          <div className="left-container__top-section">
            <div className="top-section__blue"></div>
            <div className="top-section__small-buttons">
              <div className="top-section__red"></div>
              <div className="top-section__yellow"></div>
              <div className="top-section__green"></div>
            </div>
          </div>
          <div className="left-container__main-section-container">
            <div className="left-container__main-section">
              <div className="main-section__white">
                <div className="main-section__black">
                  {/* estado de carga / error */}
                  {error ? (
                    <div className="main-screen" style={{ padding: 20, color: "white" }}>
                      <div>Error: {error}</div>
                    </div>
                  ) : loadingPoke ? (
                    <div className="main-screen" style={{ padding: 20, color: "white" }}>
                      <div>Loading Pokémon...</div>
                    </div>
                  ) : (
                    renderPokeScreen()
                  )}
                </div>
              </div>
              <div className="left-container__controllers">
                <div className="controllers__d-pad">
                  <div className="d-pad__cell top"></div>
                  <div className="d-pad__cell left"></div>
                  <div className="d-pad__cell middle"></div>
                  <div className="d-pad__cell right"></div>
                  <div className="d-pad__cell bottom"></div>
                </div>
                <div className="controllers__buttons">
                  <div className="buttons__button">B</div>
                  <div className="buttons__button">A</div>
                </div>
              </div>
            </div>
            <div className="left-container__right">
              <div className="left-container__hinge"></div>
              <div className="left-container__hinge"></div>
            </div>
          </div>
        </div>
        <div className="right-container">
          <div className="right-container__black">
            <div className="right-container__screen">
              {loadingList ? <div style={{ color: "white", padding: 8 }}>Loading list...</div> : renderList()}
            </div>
          </div>
          <div className="right-container__buttons">
            <div className="left-button" onClick={() => prevUrl && fetchList(prevUrl)}>
              Prev
            </div>
            <div className="right-button" onClick={() => nextUrl && fetchList(nextUrl)}>
              Next
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pokedex2D;