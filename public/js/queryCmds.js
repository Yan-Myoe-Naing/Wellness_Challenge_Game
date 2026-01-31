//=====================================================================================
// FETCH METHOD
// This function uses the fetch API to make a request to the server.
//=====================================================================================
function fetchMethod(url, callback, method = "GET", data = null, token = null) {

    //fetchMethod takes in 5 parameters

    //For token, our code automatically retrieve token and send it without user input
  const headers = {};

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  let options = {
    method: method.toUpperCase(),
    headers: headers,
  };

  //if there is data and its not GET, convert the data object to JSON
  // then add it to request body 
  if (method.toUpperCase() !== "GET" && data !== null) {
    options.body = JSON.stringify(data);
  }

  // the actual fetch that links frontend to backend
  // it sends all the setting we did above
  fetch(url, options)
    .then((response) => {
      if (response.status == 204) {
        callback(response.status, {});
      } else {
        response.json().then((responseData) => callback(response.status, responseData));
      }
    })
    .catch((error) => console.error(`Error from ${method} ${url}:`, error));
}
