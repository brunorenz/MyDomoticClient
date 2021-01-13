import store from "@/store";
import router from "@/router";
const LOGONUIG = "UID";

export function checkSecurity() {
  if (SecurityConfiguration.jwtRequired) {
    let token = window.sessionStorage.getItem("jwttoken");
    if (token == null) {
      router.push("/login");
    }
  }
}
// Definizioni da Server

// Sicurezza
export var SecurityConfiguration = {
  basicAuth: "Basic YWRtaW46YWgwNjB2eUEu",
  basicAuthRequired: true,
  jwtRequired: true,
};

export function isUserLogged() {
  let uid = store.getters.uid;
  let logged = uid != "";
  console.log("UDI : " + uid + " - Logged " + logged);
  return logged;
}

export function getDatiLogin() {
  return store.getters.uid;
}

let updateUid = function(datiLogon) {
  let l = {
    nome: datiLogon.nome,
    email: datiLogon.email,
    ruolo: datiLogon.ruolo,
    idRuolo: datiLogon.idRuolo,
  };
  store.commit("updateKeyStorage", {
    key: "uid",
    value: l,
  });
};

/**
 * Get saved logon UID from local storage
 */
export function getLogonUid() {
  return window.localStorage.getItem(LOGONUIG);
}
/**
 *
 */
export function doLogoff() {
  updateUid("");
  document.cookie = "jwttoken=; Max-Age=-99999999;";
  window.localStorage.removeItem(LOGONUIG);
}

export function doUpdateUid(uid) {
  window.localStorage.setItem(LOGONUIG, uid);
}

export function doLogon(datiLogon, saveUser) {
  if (typeof saveUser != "undefined") {
    if (saveUser) window.localStorage.setItem(LOGONUIG, datiLogon.uniqueId);
    else window.localStorage.removeItem(LOGONUIG);
  }
  updateUid(datiLogon);
}

// export function getXrfToken() {
//   return window.sessionStorage.getItem("jwttoken");
// }
