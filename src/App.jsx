import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Logo from "./assets/marvel_logo.png";
import md5 from "md5";

const baseURL = "https://gateway.marvel.com/v1/public/comics"; // base Marvel API URL
const publicKey = "7c46fd08fb27d8ff113c13d979285c56"; // Public key
const privateKey = "2e3a6ee57cb759516b5c281b9317842293221da1"; // Private Key
const time = Number(new Date()); // Get Timestamp
const hash = md5(time + privateKey + publicKey);

// TEST

function App() {
  const [comicsArr, setComicsArr] = useState([]); // List Comics
  const [searchedValue, setSearchedValue] = useState(""); // Get Searched Value
  const [currentPage, setCurrentPage] = useState(1); // Current Page
  const [comicsPerPage] = useState(20); // Comics per page
  const indexOfLastItem = currentPage * comicsPerPage; // Get last comic
  const indexOfFirstItem = indexOfLastItem - comicsPerPage; // Get First Comic

  // BACK TO TOP

  function scrollReset() {
    window.scrollTo(0, 0);
  }

  // GO TO NEXT PAGE

  function nextPage() {
    setCurrentPage(currentPage + 1);
    console.log(currentPage);
  }
  // GO TO PREVIOUS PAGE
  function previousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(1);
    }
  }

  // HANDLE SEARCH

  function handleSearch() {
    axios
      .get(
        `https://gateway.marvel.com:443/v1/public/comics?title=${searchedValue}&limit=100&ts=${time}&apikey=${publicKey}&hash=${hash}`
      )
      .then((response) => {
        console.log(response);
        setComicsArr(response.data.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // REQUEST COMICS ONLOAD

  useEffect(() => {
    axios
      .get(
        `https://gateway.marvel.com/v1/public/comics?orderBy=-focDate&&limit=100&ts=${time}&apikey=${publicKey}&hash=${hash}`
      )
      .then((response) => {
        console.log(response);
        setComicsArr(response.data.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section id="home">
      <nav>
        <img src={Logo} className="logo" alt=""></img>
        <input
          type="text"
          placeholder="deadpool"
          className="search_bar"
          onKeyPress={(event) => event.key === "Enter" && handleSearch()}
          onChange={(e) => setSearchedValue(e.target.value)}
        />
      </nav>
      <div className="container">
        <div className="grid_container">
          {comicsArr.slice(indexOfFirstItem, indexOfLastItem).map((comic) => (
            <div className="grid_img">
              <img
                src={`${comic.thumbnail.path}.jpg`}
                className="grid_img-comic"
                alt=""
              ></img>
              <div className="grid_img-info">
                <div className="grid_img-title">{comic.title}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            className="pagination_button previous"
            onClick={() => previousPage()}
          >
            PREVIOUS PAGE
          </button>
          <button
            onClick={() => scrollReset()}
            className="pagination_button top"
          >
            BACK TO TOP
          </button>
          <button className="pagination_button next" onClick={() => nextPage()}>
            NEXT PAGE
          </button>
        </div>
      </div>
    </section>
  );
}

export default App;
