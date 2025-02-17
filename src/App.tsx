import { useState } from "react";
import pokedex from "../pokedex.json";
import typechart from "../typechart.json";
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

function App() {
  const [found, setFound] = useState<pokedexType[]>([]);

  //search pokedex for names that includes substring
  const getPokemon = (e: string) => {
    setFound([]);
    if (e.length > 2) {
      setFound(
        pokedex.filter((item) =>
          item.name.toLowerCase().includes(e.toLowerCase())
        )
      );
    }
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

  const renderPoke = (found: pokedexType) => {
    return (
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
            <div className="ability sub">{ability}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderMulti = (found: pokedexType) => {
    const [weak, strong, immune] = getMulti(found.type);
    return (
      <>
        {Object.keys(weak).length > 0 && (
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
        )}
        <br />
        {Object.keys(strong).length > 0 && (
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
        )}
        <br />
        {Object.keys(immune).length > 0 && (
          <div className="immunelabel">
            Immune
            <div className="row g-0 strong">
              {Object.keys(immune).map((key) => (
                <div className={`${key} col`}>{key}</div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="search">
        <textarea
          maxLength={18}
          placeholder="Search"
          className="text"
          onChange={(e) => {
            getPokemon(e.target.value);
          }}
        ></textarea>
      </div>
      {found.map((found) => (
        <>
          <hr />
          <div className="card mx-auto">
            <div className="card-body">{renderPoke(found)}</div>
            <div className="card-body">{renderMulti(found)}</div>
          </div>
        </>
      ))}
    </>
  );
}

export default App;
