import { mainAxios } from "@/common/services/axiosInstance";
import { getConfiguration } from "@/common/configuration";
import { doUpdateUid, getLogonUid, SecurityConfiguration } from "@/common/services/security";
import { CHECKUID, getServiceInfo } from "@/common/services/commonRestServices";

let validateRequest = function(serviceContext) {};

export default class HttpManager {
  constructor() {
    this.configuration = getConfiguration();
  }

  getConfiguration() {
    return this.configuration;
  }

  getMainAxios() {
    return mainAxios;
  }

  getPostJsonSecurityHeader() {
    let headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    //if (typeof auth === "undefined") auth = true;
    return this._getSecurityHeader(headers);
  }

  getPostSecurityHeader() {
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    };
    //if (typeof auth === "undefined") auth = true;
    return this._getSecurityHeader(headers);
  }

  getGetSecurityHeader() {
    return this._getSecurityHeader({});
  }

  _getSecurityHeader(headers) {
    if (typeof headers === "undefined") headers = {};
    if (SecurityConfiguration.basicAuthRequired) {
      headers.Authorization = SecurityConfiguration.basicAuth;
    }
    return headers;
  }

  getUrl(functionUrl, queryParams, url) {
    if (typeof url === "undefined") url = this.configuration.urlApp;
    //var outUrl = this.configuration.serverUrl + url + functionUrl;
    var outUrl = url + functionUrl;
    if (queryParams) {
      let key = Object.keys(queryParams);
      if (key != undefined) {
        outUrl += "?";
        for (let ix = 0; ix < key.length; ix++) {
          if (ix === 0) outUrl += key[ix] + "=" + queryParams[key[ix]];
          else outUrl += "&" + key[ix] + "=" + queryParams[key[ix]];
        }
      }
    }
    console.log("HttpManager : Call " + outUrl);
    return outUrl;
  }

  async checkLogin(uid) {
    let info = getServiceInfo(CHECKUID);
    info.request = {
      uniqueId: uid,
      application: process.env.VUE_APP_NAME,
    };
    let url = this.getUrl(info.url, info.query, info.baseUrl);
    let response = await mainAxios
      .post(url, JSON.stringify(info.request), {
        headers: this.getPostJsonSecurityHeader(),
        withCredentials: true,
      })
      .then((response) => {
        let dati = response.data;
        if (dati.error.code === 0) {
          doUpdateUid(dati.uniqueId);
        }
      });
  }

  async callNodeServer(serviceInfo) {
    let uid = getLogonUid();
    let check = true;
    //if (uid === null || serviceInfo.skipCheckUid === true) return this._callNodeServer(serviceInfo);
    if (check) return this._callNodeServer(serviceInfo);
    else {
      await this.checkLogin(uid);
      return this._callNodeServer(serviceInfo);
    }
  }
  async callAsyncNodeServer(serviceInfo) {
    return await this._callNodeServer(serviceInfo);
  }

  _callNodeServer(serviceInfo) {
    let url = this.getUrl(serviceInfo.url, serviceInfo.query, serviceInfo.baseUrl);
    // let auth = true;
    // if (serviceInfo.auth != undefined) auth = serviceInfo.auth;
    let usePost = false;
    if (serviceInfo.method != undefined) usePost = serviceInfo.method === "POST" ? true : false;
    try {
      validateRequest(serviceInfo.request);
    } catch (error) {
      console.log("ServiceContext non presente..");
    }
    if (usePost) {
      return mainAxios.post(url, JSON.stringify(serviceInfo.request), {
        headers: this.getPostJsonSecurityHeader(),
        withCredentials: true,
      });
    } else {
      return mainAxios.get(url, {
        headers: this.getGetSecurityHeader(),
        withCredentials: true,
      });
    }
  }
}
