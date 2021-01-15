<template>
  <!--<b-navbar-nav class="d-md-down-none"> -->
  <b-navbar-nav>
    <b-nav-item-dropdown split no-caret>
      <template slot="button-content">
        <img
          v-if="!isUserLogged"
          src="img/icons/user-off-2.png"
          class="img-avatar"
          alt="NotLogged"
        />
        <img
          v-else
          src="img/icons/user-on-2.png"
          class="img-avatar"
          alt="Logged"
        />
      </template>
      <b-dropdown-item :disabled="!isUserLogged"
        ><i class="fa fa-wrench" /> Impostazioni</b-dropdown-item
      >
      <b-dropdown-item-button @click="doLogoff()" v-if="isUserLogged"
        ><i class="fa fa-lock" /> Logout</b-dropdown-item-button
      >
      <b-dropdown-item v-if="!isUserLogged" to="/login"
        ><i class="fa fa-lock" /> Login</b-dropdown-item
      >
    </b-nav-item-dropdown>
  </b-navbar-nav>
</template>

<script>
import { doLogon, doLogoff, getLogonUid } from "@/common/services/security";
import HttpManager from "@/common/services/HttpManager";
import { LOGIN, getServiceInfo } from "@/common/services/commonRestServices";

export default {
  name: "HeaderDropdownAccount",
  data: () => {
    return { logoff: false };
  },
  computed: {
    isUserLogged() {
      let uid = this.$store.getters.uid;
      let logged = uid != "";
      console.log("React UID = " + uid + " - Logged " + logged);
      return logged;
    },
  },
  mounted: function () {
    this.silentLogon();
  },
  methods: {
    doLogoff() {
      console.log("Do logoff!");
      this.$router.push("/logout");
    },
    silentLogon() {
      let uid = getLogonUid();
      if (uid !== undefined) {
        let info = getServiceInfo(LOGIN);
        console.log("APP NAME = " + process.env.VUE_APP_NAME);
        info.request = {
          uniqueId: uid,
          application: process.env.VUE_APP_NAME,
        };
        new HttpManager()
          .callNodeServer(info)
          .then((response) => {
            let dati = response.data;
            if (dati.error.code === 0) {
              doLogon(dati.data, true);
            } else {
              this.$router.push("/login");
            }
          })
          .catch((error) => {
            console.log("Silent Login error : ", error);
            this.$router.push("/login");
          });
      }
    },
  },
};
</script>
