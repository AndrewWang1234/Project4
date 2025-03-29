import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [dogData, setDogData] = useState(null); 
  const [banList, setBanList] = useState([]);

  const banned = (dogData) => {
    const breedName = dogData.breeds[0]?.name;
    const breedGroup = dogData.breeds[0]?.breed_group;
    const lifeSpan = dogData.breeds[0]?.life_span;
    const country = dogData.breeds[0]?.country_code;
    
    return banList.some((ban) => [breedName, breedGroup, lifeSpan, country].includes(ban));
  }


  const getData = async () => {
    let dog;
    let validDog = false;

    while (!validDog) {
      const response = await fetch(`https://api.thedogapi.com/v1/images/search?&has_breeds=1&api_key=${ACCESS_KEY}`);
      const data = await response.json();
      dog = data[0];
      
      validDog = !banned(dog);
    }
      
    setDogData(dog);
  }

  const addBan = (attribute) => {
    setBanList((prevList) => [...prevList, attribute]);
    alert(attribute + " added to ban list")
  }

  const removeBan = (attribute) => {
    setBanList((prevList) => prevList.filter((item) => item !== attribute));
  }
  


  console.log(banList);
  console.log(dogData);


  return (
    <div>
      <h1>Random Dog Generator</h1>

      <button onClick={getData}>Get Random Dog</button>
      {dogData ? (
        <div>
          <button onClick={() => addBan(dogData.breeds[0].name)}>{dogData.breeds[0].name}</button>
          {dogData.breeds[0].country_code && (
            <button>{dogData.breeds[0].country_code}</button>
          )}
          {dogData.breeds[0].breed_group && (
            <button onClick={() => addBan(dogData.breeds[0].breed_group)}>{dogData.breeds[0].breed_group}</button>
          )}
          <button onClick={() => addBan(dogData.breeds[0].life_span)}>{dogData.breeds[0].life_span}</button>
          <img src={dogData.url} alt="Random Dog" />
          
        </div>
      ) : (
        <div>No dog data available yet.</div>
      )}
      <div className="Sidebar">
        <div className="Banlist">
          <h3>Ban List</h3>
          <ul>
            {banList.map((item, index) => (
              <li key={index} onClick={() => removeBan(item)}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
