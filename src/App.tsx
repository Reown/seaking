import pokemon from "./pokemon.json";
import typechart from "./typechart.json";
import "./App.css";
import { SetStateAction, useState } from "react";

function App() {
  const [id, setId] = useState<number[]>([]);

  const update = (e: string) => {
    setId([]);
    if (e.length > 2) {
      let tempid = [] as number[];
      pokemon.map((item, key) => {
        if (item.name.includes(e)) {
          tempid.push(key);
        }
      });
      setId(tempid);
    }
  };

  const test = (iditem: number) => {
    let tempweak = [] as string[];
    typechart.map((typeitem) => {
      if (pokemon[iditem].type[0] === typeitem.type) {
        tempweak = tempweak.concat(typeitem.weak);
      }
    });
    console.log(tempweak);
    return <>{tempweak}</>;
  };

  const btnc = () => {
    console.log();
  };

  return (
    <>
      <div className="body">
        <textarea
          maxLength={18}
          placeholder="Search"
          className="text"
          onChange={(e) => {
            update(e.target.value);
          }}
        ></textarea>
        <button onClick={() => btnc()}>test</button>
      </div>
      {id.map((item, key) => (
        <>
          <hr />
          <div className="card formblock mx-auto">
            <div className="card-body">
              {pokemon[item].name}
              {test(item)}
            </div>
          </div>
        </>
      ))}
    </>
  );
}

export default App;
