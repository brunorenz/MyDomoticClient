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
  let ld = store.getters.uid;
  if (ld === "") ld = {};
  return ld;
}

let removeUid = function() {
  store.commit("logoff");
};

let updateUid = function(datiLogon) {
  let l = {
    nome: datiLogon.nome,
    email: datiLogon.email,
    ruolo: datiLogon.ruolo,
    idRuolo: datiLogon.idRuolo,
  };
  store.commit("logon", l);
};

/**
 * Recupera dati logon da localStorage
 */
export function getLogonUid() {
  return window.localStorage.getItem(LOGONUIG);
}
/**
 * Aggiorna dati logon localStorage
 * @param {} uid
 */
export function doUpdateUid(uid) {
  window.localStorage.setItem(LOGONUIG, uid);
}

/**
 * Effettua logoff - rimuove dato da localStorage - azzera jwttoken - rimuove dati sessionStorage
 */
export function doLogoff() {
  document.cookie = "jwttoken=; Max-Age=-99999999;";
  removeUid();
  window.localStorage.removeItem(LOGONUIG);
}

/**
 * Effettua logon - salva dati in local storage se richiesto e sessionStorage
 * @param {*} datiLogon
 * @param {*} saveUser
 */
export function doLogon(datiLogon, saveUser) {
  if (typeof saveUser != "undefined") {
    if (saveUser) window.localStorage.setItem(LOGONUIG, datiLogon.uniqueId);
    else window.localStorage.removeItem(LOGONUIG);
  }
  updateUid(datiLogon);
}

import HttpManager from "@/common/services/HttpManager";
import { CHECKUID, getServiceInfo } from "@/common/services/commonRestServices";

export async function checkSession() {
  let uid = getLogonUid();
  let info = getServiceInfo(CHECKUID);
  info.request = {
    uniqueId: uid,
    application: process.env.VUE_APP_NAME,
  };
  const httpService = new HttpManager();
  let response = await httpService.callAsyncNodeServer(info);
  let dati = response.data;
  let rc = true;
  if (dati.error.code === 0) {
    doUpdateUid(dati.uniqueId);
  } else {
    doLogoff();
    router.push("/login");
    rc = false;
  }
  return rc;
}
