const userTab = document.querySelector("[data-userWeather]");
const searchTab =document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInterface = document.querySelector(".user-info-container");

const notFound = document.querySelector(".not-found");


// initially variables needs 


let oldTab  =  userTab; 
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

// switching tab functions 
function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
             userInterface.classList.remove("active");
             grantAccessContainer.classList.remove("active");
             searchForm.classList.add("active");
        }

        else{
            // first search tab vr hota ata your weather tab visible krna haio 
            searchForm.classList.remove("active");
            userInterface.classList.remove("active");
            getfromSessionStorage();
        }

    }
}

userTab.addEventListener("click",() => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",() => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});


// check if cordinates  already present in local storage 
function getfromSessionStorage() {
    const localCoordinate = sessionStorage.getItem("user-coordinate");
    if(!localCoordinate){
        // jar local corsinate snaste tr he kraych 
        grantAccessContainer.classList.add("active");

    }

    else {
        const cordinates = JSON.parse(localCoordinate);
         fetchUserWeatherInfo(cordinates);

    }
}

async function fetchUserWeatherInfo(cordinates) {
  
    const{lat, lon}= cordinates;
   
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
        
    // make loader visible
    loadingScreen.classList.add("active");
    
    // API call 
   
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
              );
              const data =  await response.json();
    
             loadingScreen.classList.remove("active");
             userInterface.classList.add("active");
              
             renderWeatherInfo(data);

            }
    catch(e){
       
          loadingScreen.classList.remove("active");
          
    }
 


}


function renderWeatherInfo(weatherInfo){
    // first , we have to fetch th element 
    
    const cityname = document.querySelector("[data-cityname]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weather]")
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloud]");


    // fetch values from API 
//    cityname made weather info put kela 
    //    ?.optional; operator 
    cityname.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // according to json object  api 
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${ weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all} %` ;

}  

// by geolocation API 
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocation" );
    }
}

// to get current location form user   
function showPosition(position){
    const userCordinates ={
           
        lat:position.coords.latitude,
        lon:position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinate",JSON.stringify(userCordinates));
    fetchUserWeatherInfo(userCordinates);
}

const grantAccessButton= document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");



searchForm.addEventListener("submit",(e)  => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
    //     notFound.classList.add("active");
    //    userInterface.classList.remove("active");
    return;
        
}

    
    else 
        fetchSearchWeatherInfo(cityName);
        userInterface.classList.add("active");

    
} )

async function fetchSearchWeatherInfo(city){

loadingScreen.classList.add("active");
userInterface.classList.remove("active");
grantAccessContainer.classList.remove("active");
notFound.classList.remove("active");

try{
     const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
     );

     const data = await response.json();
     loadingScreen.classList.remove("active");
     if (response.ok) {
        // If valid city, show weather data
        userInterface.classList.add("active");
        renderWeatherInfo(data);
    } else {
        // If invalid city, show "Not Found" image
        notFound.classList.add("active");
        userInterface.classList.remove("active");
    }
    

     }
     catch(e){
        console.error("Error fetching weather:", error);
        notFound.classList.add("active");
        userInterface.classList.remove("active");

     }
}

