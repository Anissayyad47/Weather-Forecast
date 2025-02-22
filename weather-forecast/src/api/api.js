const apiKey="30048a46a58803bdde85dadf79287c21"
const getWeather=async (city) =>{
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then((res)=> res.json()).then((json)=>{return json;})
}
export default getWeather;