import { useState } from "react";
import pokedex from "../pokedex.json";
import typechart from "../typechart.json";
import "./App.css";

//pokedex json type safety
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

  //deep copy from json to obtain only weak/strong multi
  const getMulti = (type: string[]) => {
    let multi: multiType = JSON.parse(
      JSON.stringify(typechart.find((def) => def.type === "default")?.multi)
    );

    type.forEach((type) => {
      const temp: multiType = JSON.parse(
        JSON.stringify(typechart.find((item) => item.type === type)?.multi)
      );
      Object.keys(temp).forEach((key) => {
        multi[key] *= temp[key];
      });
    });

    Object.keys(multi).forEach((key) => {
      if (multi[key] === 1.0) {
        delete multi[key];
      }
    });
    return multi;
  };

  const render = (found: pokedexType) => {
    const i = getMulti(found.type);
    console.log(i);
    return <></>;
  };

  return (
    <>
      <div className="body">
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
            <div className="card-body">
              {found.name}
              {render(found)}
            </div>
          </div>
        </>
      ))}
    </>
  );
}

export default App;
