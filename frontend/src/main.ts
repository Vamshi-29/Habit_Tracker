import { mountLoginPage } from "./login-page.js";

const app = document.querySelector<HTMLElement>("#app");
if (!app) {
  throw new Error('Missing root element "#app"');
}

mountLoginPage(app);
