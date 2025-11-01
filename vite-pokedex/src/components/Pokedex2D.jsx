import React, { useEffect } from "react";
import "./Pokedex2D.css";
import usePokeApi from "../hooks/usePokeApi";
import Card3D from "./Card3D";

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
  // Use existing hook / services instead of manual fetch
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
    setPokeData, // kept in case you want to clear selection externally
  } = usePokeApi(LIST_LENGTH);

  // initial load
  useEffect(() => {
    fetchList(); // uses default URL with the limit passed to the hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderList() {
    let items = [];
    for (let i = 0; i < LIST_LENGTH; i++) {
      const poke = pokeList[i];
      if (poke) {
        const urlArray = poke.url.split("/");
        const id = urlArray[urlArray.length - 2];
        const label = id + ". " + capitalize(poke.name);
        items.push(
          <div
            key={id}
            className={`list-item ${pokeData?.id === Number(id) ? "active" : ""}`}
            onClick={() => fetchPokemon(id)}
            tabIndex={0}
            style={{ outline: "none" }}
          >
            {label}
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

  // Left content: when selected show Card3D on the left and info to the right
  function renderLeftContent() {
    if (loadingPoke && !pokeData) {
      return (
        <div className="main-screen" style={{ padding: 20, color: "white" }}>
          Loading Pokémon...
        </div>
      );
    }
    if (error && !pokeData) {
      return (
        <div className="main-screen" style={{ padding: 20, color: "white" }}>
          Error: {error}
        </div>
      );
    }

    if (pokeData) {
      const primaryType = pokeData.types?.[0]?.type?.name;
      return (
        <div
          className="card-and-info"
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            gap: 20,
            alignItems: "center",
            boxSizing: "border-box",
            padding: "12px",
          }}
        >
          {/* Left: 3D Card aligned to the left */}
          <div
            className="card-left"
            style={{
              flex: "0 0 360px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* pass useRightBlueBackground={true} to match the blue background */}
            <Card3D pokemon={pokeData} useRightBlueBackground={false} />
          </div>

          {/* Right: textual info (name, id, type) */}
          <div
            className="card-info-right"
            style={{
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 12,
              color: "#fff", // main-screen background for selected is blue, keep text white
              paddingRight: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: "2rem", textTransform: "capitalize" }}>
              {capitalize(pokeData.name)}
            </h2>
            <div style={{ fontSize: "1.05rem", opacity: 0.95 }}>
              <strong>ID:</strong> #{pokeData.id.toString().padStart(3, "0")}
            </div>
            <div style={{ marginTop: 6 }}>
              <strong>Tipo:</strong>{" "}
              <span
                className="poke-type-badge"
                style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {primaryType ? capitalize(primaryType) : "—"}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // fallback: no selection
    return <div className="main-screen hide"></div>;
  }

  // Use the same blue as the right side screen: #43B0F2
  const RIGHT_SCREEN_BLUE = "#43B0F2";

  // inline style for the inner black area; when pokeData exists paint the right-side blue
  const mainBlackInlineStyle = {
    height: "92%",
    padding: 0,
    boxSizing: "border-box",
    background: pokeData ? RIGHT_SCREEN_BLUE : undefined,
    color: pokeData ? "#fff" : undefined, // keep text readable on blue
  };

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
          <div className="left-container__main-section" style={{ padding: 16 }}>
            <div className="main-section__white" style={{ height: "88%" }}>
              <div className="main-section__black" style={mainBlackInlineStyle}>
                {renderLeftContent()}
              </div>
            </div>

            {/* CONTROLLERS: always visible */}
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

          {/* HINGES: always visible */}
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
          <div
            className="left-button"
            onClick={() => prevUrl && fetchList(prevUrl)}
          >
            Prev
          </div>
          <div
            className="right-button"
            onClick={() => nextUrl && fetchList(nextUrl)}
          >
            Next
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pokedex2D;