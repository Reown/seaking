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
  const searchAll = (e: string) => {
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

    //split multi to weak/strong
    const weak: multiType = {};
    const strong: multiType = {};
    Object.keys(multi).forEach((key) => {
      if (multi[key] > 1.0) {
        weak[key] = multi[key];
      } else if (multi[key] < 1.0) {
        strong[key] = multi[key];
      }
    });

    return { weak, strong };
  };

  const render = (found: pokedexType) => {
    const { weak, strong } = getMulti(found.type);
    return (
      <>
        <div className="row g-1">
          <div className="col weak">
            <div>test1</div>
          </div>
          <div className="col weak">
            <div>
              test2
              <br />
              test4
            </div>
          </div>
          <div className="col weak">
            <div>
              test2
              <br />
              test3
            </div>
          </div>
        </div>
        <div className="row g-1">
          <div className="col strong">
            <div>test1</div>
          </div>
          <div className="col strong">
            <div>
              test2
              <br />
              test4
            </div>
          </div>
          <div className="col strong">
            <div>
              test2
              <br />
              test3
            </div>
          </div>
        </div>
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
            searchAll(e.target.value);
          }}
        ></textarea>
      </div>
      {found.map((found) => (
        <>
          <hr />
          <div className="card mx-auto">
            <div className="card-body row">
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
            <div className="card-body">{render(found)}</div>
          </div>
        </>
      ))}
    </>
  );
}

export default App;
