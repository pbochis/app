var BASE_URL = "http://localhost:8080";

if (location.origin.indexOf("localhost") == -1) {
  BASE_URL = "https://api.cod.uno";
}

// TODO(victorbalan): Create methods that take in account the authorization type
function get(ajaxRequest, route, authorization, responseCallback){
  ajaxRequest.url = BASE_URL + route;
  ajaxRequest.method = "GET";
  if (authorization){
    ajaxRequest.headers = {"Authorization": authorization};
  }
  else{
    ajaxRequest.headers = {"Authorization": localStorage.getItem("authorization")};
  }
  ajaxRequest.generateRequest();
}

function post(ajaxRequest, route, body){
  ajaxRequest.url = BASE_URL + route;
  ajaxRequest.method = "POST";
  ajaxRequest.headers = {"Authorization": localStorage.getItem("authorization")};
  ajaxRequest.body = JSON.stringify(body);
  ajaxRequest.generateRequest();
}
