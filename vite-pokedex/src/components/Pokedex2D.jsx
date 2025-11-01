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

function Spinner({ size = 48, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden>
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke={color}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function LoadingScreen({ text = "Loading...", color = "#fff" }) {
  return (
    <div
      className="main-screen"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        boxSizing: "border-box",
        padding: 20,
        color,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Spinner size={56} color={color} />
        <div style={{ marginTop: 12, fontSize: 16 }}>{text}</div>
      </div>
    </div>
  );
}

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
    setPokeData,
  } = usePokeApi(LIST_LENGTH);

  useEffect(() => {
    fetchList();
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
            className={`list-item ${
              pokeData?.id === Number(id) ? "active" : ""
            }`}
            onClick={() => fetchPokemon(id)}
            tabIndex={0}
            style={{ outline: "none" }}
          >
            {label}
          </div>
        );
      } else {
        items.push(<div key={i} className="list-item"></div>);
      }
    }
    return items;
  }

  function renderLeftContent() {
    if (loadingList) {
      return <LoadingScreen text="Cargando PokéDex..." color="#fff" />;
    }
    if (loadingPoke && !pokeData) {
      return <LoadingScreen text="Cargando Pokémon..." color="#fff" />;
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
          <div
            className="card-left"
            style={{
              flex: "0 0 360px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card3D pokemon={pokeData} useRightBlueBackground={false} />
          </div>

          <div
            className="card-info-right"
            style={{
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 12,
              color: "#fff",
              paddingRight: 12,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "2rem",
                textTransform: "capitalize",
              }}
            >
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

    return <div className="main-screen hide"></div>;
  }

  const RIGHT_SCREEN_BLUE = "#43B0F2";

  const mainBlackInlineStyle = {
    height: "92%",
    padding: 0,
    boxSizing: "border-box",
    background: pokeData ? RIGHT_SCREEN_BLUE : undefined,
    color: pokeData ? "#fff" : undefined,
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
                {loadingList || (loadingPoke && !pokeData) ? (
                  <LoadingScreen
                    text={
                      loadingList
                        ? "Cargando PokéDex..."
                        : "Cargando Pokémon..."
                    }
                    color="#fff"
                  />
                ) : (
                  renderLeftContent()
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
          <div
            className="right-container__screen"
            style={{ position: "relative", minHeight: 200 }}
          >
            {loadingList ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  padding: 16,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <Spinner size={48} color="#fff" />
                  <div style={{ marginTop: 10 }}>
                    Cargando lista de Pokémon...
                  </div>
                </div>
              </div>
            ) : (
              renderList()
            )}
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
