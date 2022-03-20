// Creating a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

// The URL to retrieve weather information from his API (country : US)
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

 // Personal API Key for OpenWeatherMap API
// &units=metric to get the Celsius Temperature
const apiKey = ",&appid=efd5d2f67153f5022be9934a276987e7&units=metric";

// the URL of the server to post data
const server = "http://127.0.0.1:8080";

// showing the error to the user
const error = document.getElementById("error");


const generateInfo = async() => { 
  //get value after click on the button
  const zip = document.querySelector("#zip").value;
  const feelings = document.querySelector("#feelings").value;

  // getWeatherData return promise
  getWeatherInfo(zip).then((data) => {
    //making sure from the received data to execute rest of the steps
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;

      const info = {
        newDate,
        city,
        temp: Math.round(temp), 
        description,
        feelings,
      };

      postData(server + "/add", info);

      updatingUI();
      document.getElementById('entry').style.opacity = 2;
    }
  });
};

// Event listener to add function to existing HTML DOM element
// Function called by event listener
document.querySelector("#generate").addEventListener("click", generateInfo);

//Function to GET Web API Data
async function getWeatherInfo (zip) {
  try {
    const res = await fetch(baseURL + zip + apiKey);
    const data = await res.json();

    if (data.cod != 200) {
      // display the error message on UI
      error.innerHTML = data.message;
      throw `${data.message}`;
    }else{
      error.innerHTML="";
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Function to POST data
const postData = async (url = "", info = {}) => {
  const res = await fetch(url, {
    method: "POST",
    credentials:"same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });

  try {
    const newData = await res.json();
    console.log(`new data saved`, newData);
    return newData;
  } catch (error) {
    console.log(error);
  }
};

//Function to GET Project Data
// and updating UI by this data
const updatingUI = async () => {
  const res = await fetch("/allData");
  try {
    const savedData = await res.json();

    document.querySelector("#date").innerHTML = savedData.newDate;
    document.querySelector("#city").innerHTML = savedData.city;
    document.querySelector("#temp").innerHTML = savedData.temp + '&degC';
    document.querySelector("#description").innerHTML = savedData.description;
    document.querySelector("#content").innerHTML = savedData.feelings;
  } catch (error) {
    console.log(error);
  }
};
