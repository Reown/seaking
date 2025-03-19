import { useEffect, useState } from "react";
import pokedex from "./data/pokedex.json";
import pokedexnf from "./data/pokedex_nofairy.json";
import typechart from "./data/typechart.json";
import abilityDescJson from "./data/ability.json";
import "./App.css";
import "./Type.css";

interface pokedexType {
  id: number;
  name: string;
  type: string[];
  ability: string[];
}

interface multiType {
  [key: string]: number;
}

interface abilityDescType {
  [key: string]: string;
}

function App() {
  const [query, setQuery] = useState<string>("");
  const [found, setFound] = useState<pokedexType[]>([]);
  const [fairy, setFairy] = useState<boolean>(true);
  const [hoverAbility, setHoverAbility] = useState<string | null>(null);
  const [hoverPokemon, setHoverPokemon] = useState<string | null>(null);
  const abilityDesc = abilityDescJson as abilityDescType;

  useEffect(() => {
    getPokemon(query);
  }, [fairy]);

  const getPokemon = (e: string) => {
    setQuery(e);
    setFound([]);

    //search pokedex for names that includes substring
    if (e.length > 2) {
      const checkf = pokedex.filter((item) =>
        item.name.toLowerCase().includes(e.toLowerCase())
      );

      //check if fairy is toggled, replace from pokedex_nofairy
      if (!fairy) {
        const checknf = checkf.map((item) => {
          const match = pokedexnf.find((item2) => item.id === item2.id);
          return match ? match : item;
        });
        setFound(checknf);
      } else {
        setFound(checkf);
      }
    }
  };

  const getDesc = (ability: string) => {
    //check if is Hidden Ability
    const isHA = ability.startsWith("HA:");
    const tempAbility = isHA ? ability.replace("HA: ", "") : ability;
    const description = abilityDesc[tempAbility]
      ? isHA
        ? `Hidden Ability: ${abilityDesc[tempAbility]}`
        : abilityDesc[tempAbility]
      : "Ability not found";

    return description;
  };

  const getMulti = (type: string[]) => {
    //deep copy from json
    let multi: multiType = JSON.parse(
      JSON.stringify(typechart.find((def) => def.type === "default")?.multi)
    );

    //multiply multi for dual types
    type.forEach((type) => {
      const temp: multiType = JSON.parse(
        JSON.stringify(typechart.find((item) => item.type === type)?.multi)
      );
      Object.keys(temp).forEach((key) => {
        multi[key] *= temp[key];
      });
    });

    //split multi to weak/strong/immune
    const weak: multiType = {};
    const strong: multiType = {};
    const immune: multiType = {};
    Object.keys(multi).forEach((key) => {
      if (multi[key] > 1.0) {
        weak[key] = multi[key];
      } else if (multi[key] > 0.0 && multi[key] < 1.0) {
        strong[key] = multi[key];
      } else if (multi[key] === 0.0) {
        immune[key] = multi[key];
      }
    });

    return [weak, strong, immune];
  };

  const renderNav = () => {
    return (
      <nav className="navbar navbar-dark navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="https://github.com/Reown/seaking">
            Seaking
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              Gen 1-5 Fairy
              <div className="form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked
                  onChange={(e) => setFairy(!fairy)}
                ></input>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  const renderPoke = (found: pokedexType) => {
    return (
      <div className="card-body">
        <div className="row">
          <div className="col">
            {found.type.map((type) => (
              <div className={`${type} sub`}>{type}</div>
            ))}
          </div>
          <div className="col name">{found.name}</div>
          <div className="col name">{found.name}</div>
          <div className="col">
            {found.ability.map((ability) => (
              <div
                className="ability sub"
                onMouseEnter={() => {
                  setHoverAbility(ability);
                  setHoverPokemon(found.name);
                }}
                onMouseLeave={() => {
                  setHoverAbility(null);
                  setHoverPokemon(null);
                }}
              >
                {ability}
                {hoverAbility === ability && hoverPokemon === found.name && (
                  <div className="hover">{getDesc(ability)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMulti = (type: string[]) => {
    const [weak, strong, immune] = getMulti(type);
    return (
      <div className="card-body">
        {Object.keys(weak).length > 0 && (
          <>
            <div className="weaklabel">
              Super Effective
              <div className="row g-0 weak">
                {Object.keys(weak).map((key) => (
                  <div className={`${key} col`}>
                    {key}
                    <br />
                    {weak[key]}x
                  </div>
                ))}
              </div>
            </div>
            <br />
          </>
        )}
        {Object.keys(strong).length > 0 && (
          <>
            <div className="stronglabel">
              Not Very Effective
              <div className="row g-0 strong">
                {Object.keys(strong).map((key) => (
                  <div className={`${key} col`}>
                    {key}
                    <br />
                    {strong[key]}x
                  </div>
                ))}
              </div>
            </div>
            <br />
          </>
        )}
        {Object.keys(immune).length > 0 && (
          <>
            <div className="immunelabel">
              Immune
              <div className="row g-0 strong">
                {Object.keys(immune).map((key) => (
                  <div className={`${key} col`}>{key}</div>
                ))}
              </div>
            </div>
            <br />
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {renderNav()}
      <div className="search">
        <textarea
          maxLength={18}
          placeholder="Search"
          className="text"
          onChange={(e) => {
            getPokemon(e.target.value);
          }}
        />
      </div>
      {found.map((found) => (
        <>
          <hr />
          <div className="card mx-auto">
            {renderPoke(found)}
            {renderMulti(found.type)}
          </div>
        </>
      ))}
    </>
  );
}

export default App;
