export const LOGIN = "login";
export const LOGOUT = "logout";
export const CHECKUID = "checkUid";

const METHOD = { POST: 1, GET: 2 };
import { getConfiguration } from "@/common/configuration";

let serviceDefinition = function(url, method) {
  return method === METHOD.POST ? serviceDefinitionPOST(url) : serviceDefinitionGET(url);
};

let serviceDefinitionPOST = function(url) {
  let prefix = "";
  if (process.env.VUE_APP_URL_SECURITY_SERVER === 'local') prefix = "p/";
  return {
    request: {},
    url: prefix + url,
    method: "POST",
    skipCheckUid : false,
  };
};

let serviceDefinitionGET = function(url) {
  return {
    query: {},
    url: "g/" + url,
    method: "GET",
    skipCheckUid : false,
  };
};

let checkUid = function() {
  let r = serviceDefinitionPOST(CHECKUID);
  r.baseUrl = getConfiguration().urlSecurity;
  r.skipCheckUid = true;
  return r;
};


let login = function() {
  let r = serviceDefinitionPOST(LOGIN);
  r.baseUrl = getConfiguration().urlSecurity;
  r.skipCheckUid = true;
  return r;
};

let logout = function() {
  let r = serviceDefinitionPOST(LOGOUT);
  r.baseUrl = getConfiguration().urlSecurity;
  r.skipCheckUid = true;
  return r;
};

const serviceConfiguration = {
  login,
  logout,
  checkUid,
};

export function getServiceInfo(serviceName) {
  let r = serviceConfiguration[serviceName];
  if (r === undefined) throw "Servizio " + serviceName + " non configurato!";
  return r();
}
