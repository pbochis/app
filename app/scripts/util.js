var BASE_URL = "/api";

if(location.origin.indexOf("localhost")==-1){
  BASE_URL = "https://api.cod.uno";
}

// TODO(victorbalan): Create methods that take in account the authorization type
function get(ajaxRequest, route){
  ajaxRequest.url = BASE_URL + route;
  ajaxRequest.method = "GET";
  ajaxRequest.headers = {"Authorization": "Token " + localStorage.getItem("token")};
  ajaxRequest.generateRequest();
}

function post(ajaxRequest, route, body){
  ajaxRequest.url = BASE_URL + route;
  ajaxRequest.method = "POST";
  ajaxRequest.headers = {"Authorization": "Token " + localStorage.getItem("token")};
  ajaxRequest.body = JSON.stringify(body);
  ajaxRequest.generateRequest();
}
