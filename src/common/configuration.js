const local = true;
const remoteNodeServer = false;
const urlApp = process.env.VUE_APP_URL_MAIN;
const urlSecurity = process.env.VUE_APP_URL_SECURITY_SERVER === "local" ? process.env.VUE_APP_URL_SECURITY : process.env.VUE_APP_URL_SECURITY_REMOTE;
const serverUrlProduzione = "/";
const serverUrlRemote = remoteNodeServer ? "https://therm.65bruno.it/" : "http://192.168.0.101:8101/";
const serverUrlRemoteSec = remoteNodeServer ? "https://therm.65bruno.it/" : "http://192.168.0.101:8090/";
const serverUrlD = local ? "http://localhost:8101/" : serverUrlRemote;
const serverUrlDSec = local ? "http://localhost:8101/" : serverUrlRemoteSec;

const serverUrl = process.env.NODE_ENV === "production" ? serverUrlProduzione : serverUrlD;
const serverUrlSecurity = process.env.NODE_ENV === "production" ? serverUrlProduzione : serverUrlDSec;

// const urlApp =  serverUrl + urlApp;
// const urlSecurity =  serverUrlSecurity + urlSecurity;


let configuration = {
  urlApp: serverUrl + urlApp,
  urlSecurity: serverUrlSecurity + urlSecurity,
};

export function getConfiguration() {
  return JSON.parse(JSON.stringify(configuration));
}
