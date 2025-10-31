import React, { useEffect, useState } from "react";
import "./Pokedex2D.css";

const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];
const LIST_LENGTH = 20;

const capitalize = (str) => str ? str[0].toUpperCase() + str.substr(1) : "";

function Pokedex2D() {
  const [pokeList, setPokeList] = useState([]);
  const [prevUrl, setPrevUrl] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [pokeData, setPokeData] = useState(null);

  useEffect(() => {
    fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=" + LIST_LENGTH);
  }, []);

  function fetchPokeList(url) {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPrevUrl(data.previous);
        setNextUrl(data.next);
        setPokeList(data.results || []);
        setPokeData(null); // Limpiar selección al cambiar página
      });
  }

  function fetchPokeDataById(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => setPokeData(data));
  }

  function renderList() {
    let items = [];
    for (let i = 0; i < LIST_LENGTH; i++) {
      const poke = pokeList[i];
      if (poke) {
        const urlArray = poke.url.split("/");
        const id = urlArray[urlArray.length - 2];
        items.push(
          <div
            key={id}
            className="list-item"
            onClick={() => fetchPokeDataById(id)}
            tabIndex={0}
            style={{outline: "none"}}
          >
            {id + ". " + capitalize(poke.name)}
          </div>
        );
      } else {
        items.push(
          <div key={i} className="list-item"></div>
        );
      }
    }
    return items;
  }

  function renderPokeScreen() {
    if (!pokeData) {
      return <div className="main-screen hide"></div>;
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
          <img
            src={pokeData.sprites?.front_default || ""}
            className="poke-front-image"
            alt="front"
          />
          <img
            src={pokeData.sprites?.back_default || ""}
            className="poke-back-image"
            alt="back"
          />
        </div>
        <div className="screen__description">
          <div className="stats__types">
            <span className="poke-type-one">
              {firstType ? capitalize(firstType) : ""}
            </span>
            {secondType ? (
              <span className="poke-type-two">{capitalize(secondType)}</span>
            ) : (
              <span className="poke-type-two hide"></span>
            )}
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
                {renderPokeScreen()}
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
            {renderList()}
          </div>
        </div>
        <div className="right-container__buttons">
          <div
            className="left-button"
            onClick={() => prevUrl && fetchPokeList(prevUrl)}
          >
            Prev
          </div>
          <div
            className="right-button"
            onClick={() => nextUrl && fetchPokeList(nextUrl)}
          >
            Next
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pokedex2D;