const getData = async () => {

    // Put URL of JSON data inside a variable so its easily changable
    const url = "https://angelique-smit.github.io/json-for-app/characters.json"

    //Retreiving the JSON data inside a try/catch to make it easy to see if something is failing.
    try {
        const response = await fetch(url);

        //If the response is empty, throw error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        //Await the JSON data
        const data = await response.json();

        //Return the JSON data (the getData const is now filled with the variable data (which is the entire JSON file))
        return data;
    } 
    
    //My failsafe in case the try fails me :(
    catch (error) {
        console.error("Error fetching data:", error);
        //This makes sure the error also gets inside the react component
        throw error;
    }
}

export default getData