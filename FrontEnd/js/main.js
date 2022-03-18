import { Firma } from "./firma.js";

window.onload = (event) => {
  fetch("https://localhost:7279/Firma/SveFirme").then((p) => {
    p.json().then((data) => {
      data.forEach((firma) => {
        const f = new Firma(firma.id, firma.ime, firma.radnici);
        f.crtajFirmu(document.body);
      });
    });
  });
};
