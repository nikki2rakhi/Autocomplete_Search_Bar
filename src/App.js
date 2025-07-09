import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [result, setResult] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [cache, setCache] = useState({});

  const fetchdata = async () => {
    if (cache[searchInput]) {
      console.log("Cache return", searchInput);
      setResult(cache[searchInput]);
      return;
    }
    console.log("Api call", searchInput);
    const response = await fetch(
      `https://dummyjson.com/recipes/search?q=${searchInput}`
    );
    const data = await response.json();
    setResult(data?.recipes);
    setCache((prev) => ({ ...prev, [searchInput]: data?.recipes }));
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchdata(), 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  const handleOnclick = (val) => {
    setSearchInput(val);
  };

  return (
    <div className="App">
      <h1>Autocomplete Search Bar</h1>
      <div>
        <label>Search : </label>
        <input
          className="search-input"
          type="text"
          placeholder="Search Here"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setShowResult(true)}
          onBlur={() => setShowResult(false)}
        />
      </div>
      {showResult && result.length > 0 ? (
        <div className="recipes-container">
          {result.map((r) => (
            <span
              className="recipes-name"
              key={r.id}
              onMouseDown={() => handleOnclick(r.name)}
            >
              <img src={r.image} className="recipes-image" />
              {r.name}
            </span>
          ))}
        </div>
      ) : (
        <div>{showResult && <h4>No Receipe Found</h4>}</div>
      )}
    </div>
  );
}
