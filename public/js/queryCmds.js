// Send API request and return status + data to callback.
function fetchMethod(url, callback, method = "GET", data = null, token = null) {
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
  if (method.toUpperCase() !== "GET" && data !== null) {
    options.body = JSON.stringify(data);
  }
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

