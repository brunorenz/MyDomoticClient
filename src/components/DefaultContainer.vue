<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="#">
        <img
          class="navbar-brand-full"
          src="img/mydomotics.png"
          width="45"
          height="45"
          alt="MyDomoticsGUI"
        />
        <img
          class="navbar-brand-minimized"
          src="img/mydomotics.png"
          width="45"
          height="45"
          alt="MyDomoticsGUI"
        />
      </b-link>
      <SidebarToggler
        class="d-md-down-none"
        display="lg"
        :defaultOpen="false"
      />
      <b-navbar-nav class="d-md-down-none">
        <b-nav-item class="px-3" to="/dashboard">Dashboard</b-nav-item>
        <b-nav-item class="px-3" to="/gestione">Gestione</b-nav-item>
        <b-nav-item class="px-3" to="/statistiche">Statistiche</b-nav-item>
        <b-nav-item-dropdown class="px-3" text="Programmazione">
          <b-dropdown-item to="/programmazione/termostato"
            >Termostato</b-dropdown-item
          >
          <b-dropdown-item to="/programmazione/luce">Luce</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <HeaderDropdownAccount />
      </b-navbar-nav>
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader />
        <SidebarForm />
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarFooter />
        <SidebarMinimizer />
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list" />
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        <a href="https://coreui.io">CoreUI</a>
        <span class="ml-1">&copy; 2018 creativeLabs.</span>
      </div>
      <div class="ml-auto">
        <span class="mr-1">Powered by</span>
        <a><b>brunorenz@github</b></a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarNav,
  Aside as AppAside,
  AsideToggler,
  Footer as TheFooter,
  Breadcrumb,
} from "@coreui/vue";
import HeaderDropdownAccount from "./HeaderDropdownAccount";

export default {
  name: "DefaultContainer",
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer,
    HeaderDropdownAccount,
  },
  data() {
    return {
      nav: [
        {
          name: "Dashboard",
          url: "/dashboard",
          icon: "fa fa-dashboard ",
          badge: {
            variant: "primary",
          },
        },
        {
          name: "Gestione Dispositivi",
          url: "/gestione",
          icon: "fa fa-cogs",
        },
        {
          name: "Programmazione",
          url: "/programmazione",
          icon: "fa fa-calendar",
          children: [
            {
              name: "Termostato",
              url: "/programmazione/termostato",
              icon: "fa fa-thermometer-1",
            },
            {
              name: "Controllo Luce",
              url: "/programmazione/luce",
              icon: "fa fa-lightbulb-o",
            },
          ],
        },
        {
          name: "Statistiche",
          url: "/statistiche",
          icon: "fa fa-bar-chart",
        },
      ],
    };
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched.filter(
        (route) => route.name || route.meta.label
      );
    },
  },
};
</script>
