import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [gameInfo, setGameInfo] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);

  useEffect(() => {
    fetchGameInfo();
  }, []);

  const fetchGameInfo = async () => {
    const response = await fetch(
      "https://api.jikan.moe/v3/search/anime?q=One_Piece&limit=5"
    );
    const jsonData = await response.json();
    const items = jsonData.results;

    items.sort((a, b) => {
      return a.start_date > b.start_date ? 1 : -1;
    });
    items.forEach((item) => {
      let date = new Date(item.start_date);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      item.start_date = date.toLocaleDateString(undefined, options);
    });

    let tempDeck = [...jsonData.results];
    let tempShuffle = [];
    for (let i = tempDeck.length - 1; i >= 0; i--) {
      let randomIndex = Math.floor(Math.random() * tempDeck.length);
      let card = tempDeck.splice(randomIndex, 1)[0];
      console.log(card.title);
      tempShuffle.push(card);
      console.log(tempDeck.length);
    }
    setShuffledCards(tempShuffle);

    setGameInfo(jsonData.results);
    console.log(typeof jsonData.results[0].start_date);
  };

  const checkAnswers = () => {
    var rightAnswers = gameInfo.map((item) => {
      return item.title;
    });
    console.log(rightAnswers);
    var isRight = true;
    for (let i = 0; i < rightAnswers.length; i++) {
      if (rightAnswers[i] != selectedItems[i]) {
        isRight = false;
      }
    }
    if (isRight) {
      alert("You got it right!");
    } else {
      alert("Sorry, try again");
    }
  };

  const itemPicked = (selectedTitle) => {
    if (!selectedItems.includes(selectedTitle)) {
      console.log(selectedTitle);
      console.log("this is dat");
      console.log([...selectedItems, selectedTitle]);
      setSelectedItems([...selectedItems, selectedTitle]);
    }
  };

  return (
    <div className="container">
      <div className="col-12 text-center mx-auto">
        <h1 className="h1">Which movie or shows came first?</h1>
      </div>
      <div className="row">
        {shuffledCards.map((item, index) => {
          return (
            <div
              key={index}
              className={
                (selectedItems.includes(item.title) ? "gray" : "") +
                " card cardsize col-sm-6"
              }
              onClick={() => {
                itemPicked(item.title);
              }}
            >
              <img
                className="card-img-top card-image"
                src={item.image_url}
                alt="Card image cap"
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                {/* <h5 className="card-title">{item.start_date}</h5> */}
                <p className="card-text">{item.synopsis}</p>
                <a href={item.url} className="btn btn-primary">
                  MyAnime List
                </a>
              </div>
            </div>
          );
        })}

        <button className="btn btn-primary p-3" onClick={checkAnswers}>
          Check
        </button>
      </div>
    </div>
  );
}

export default App;
