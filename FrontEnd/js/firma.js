import { Task } from "./task.js";

export class Firma {
  constructor(id, ime, radnici) {
    this.id = id;
    this.ime = ime;
    this.radnici = radnici;
    this.taskovi = [];
    this.kontejner = null;
    this.taskContainer = null;
    this.rightContainer = null;
  }

  dodajRadnika(radnik) {
    this.radnici.push(radnik);
  }

  crtajFirmu(host) {
    if (!host) {
      throw new Exception("Roditeljski element ne postoji");
    }

    this.kontejner = document.createElement("div");
    this.kontejner.classList.add("kontejner");
    host.appendChild(this.kontejner);

    var divFlexLeft = document.createElement("div");
    divFlexLeft.classList.add("divFlexLeft");
    // var divFlexRight = document.createElement("div");
    // divFlexRight.classList.add("divFlexRight");

    this.crtajHeading(this.kontejner);
    this.kontejner.appendChild(divFlexLeft);
    this.crtajFormu(divFlexLeft);
    this.crtajDesniDeo(divFlexLeft);
  }

  crtajFormu(host) {
    const formContainer = document.createElement("div");
    formContainer.className = "formContainer";
    host.appendChild(formContainer);

    this.crtajdodajRadnika(formContainer);
    this.crtajDodajTask(formContainer);
  }

  crtajdodajRadnika(host) {
    const formaDodajRadnika = document.createElement("div");
    formaDodajRadnika.className = "formaDodajRadnika";
    host.appendChild(formaDodajRadnika);
    // Jmbg Radnika
    let jmbgLabela = document.createElement("p");
    jmbgLabela.innerHTML = "Jmbg radnika";
    jmbgLabela.className = "labela";
    formaDodajRadnika.appendChild(jmbgLabela);
    let jmbgRadnika = document.createElement("input");
    jmbgRadnika.type = "number";
    jmbgRadnika.className = "jmbg";
    formaDodajRadnika.appendChild(jmbgRadnika);
    // Ime radnika
    let elLabela = document.createElement("p");
    elLabela.innerHTML = "Ime radnika";
    elLabela.className = "labela";
    formaDodajRadnika.appendChild(elLabela);
    let imeRadnika = document.createElement("input");
    imeRadnika.className = "ime";
    formaDodajRadnika.appendChild(imeRadnika);
    //Prezime Radnika
    let elLabelaPrezime = document.createElement("p");
    elLabelaPrezime.innerHTML = "Prezime radnika";
    elLabelaPrezime.className = "labela";
    formaDodajRadnika.appendChild(elLabelaPrezime);
    let prezimeRadnika = document.createElement("input");
    prezimeRadnika.className = "prezime";
    formaDodajRadnika.appendChild(prezimeRadnika);
    // Senioritet Radnika
    let senioritetLabela = document.createElement("p");
    senioritetLabela.innerHTML = "Senioritet radnika";
    senioritetLabela.className = "labela";
    formaDodajRadnika.appendChild(senioritetLabela);
    let senioritetRadnika = document.createElement("input");
    senioritetRadnika.className = "senioritetRadnika";
    formaDodajRadnika.appendChild(senioritetRadnika);
    // Email Radnika
    let emailLabela = document.createElement("p");
    emailLabela.innerHTML = "Email radnika";
    emailLabela.className = "labela";
    formaDodajRadnika.appendChild(emailLabela);
    let emailRadnika = document.createElement("input");
    emailRadnika.className = "emailRadnika";
    formaDodajRadnika.appendChild(emailRadnika);
    // Dodaj radnika dugme
    let dugme = document.createElement("button");
    dugme.className = "dodajRadnikaDugme";
    dugme.innerHTML = "Dodaj radnika";
    formaDodajRadnika.appendChild(dugme);

    // Ucitaj radnika dugme
    let ucitajDugme = document.createElement("button");
    ucitajDugme.className = "ucitajDugme";
    ucitajDugme.innerHTML = "Ucitaj jmbg";
    formaDodajRadnika.appendChild(ucitajDugme);
    ucitajDugme.onclick = () => {
      let radniciSelect = this.kontejner.querySelector(".selectRadnik");
      jmbgRadnika.value = radniciSelect.value;

      fetch(`https://localhost:7279/Radnik/Radnik/${radniciSelect.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((p) => {
          if (p.ok) {
            p.json().then((q) => {
              console.log(q);
              imeRadnika.value = q.ime;
              prezimeRadnika.value = q.prezime;
              senioritetRadnika.value = q.senioritet;
              emailRadnika.value = q.email;
            });
          } else if (p.status == 400) {
            alert("Greska prilikom unosa radnika");
          }
        })
        .catch((p) => {
          alert("Greška prilikom upisa.");
        });
    };

    // Update radnika dugme
    let updateDugme = document.createElement("button");
    updateDugme.className = "ucitajDugme";
    updateDugme.innerHTML = "Update radnika";
    formaDodajRadnika.appendChild(updateDugme);
    updateDugme.onclick = () => {
      if (
        imeRadnika.value != "" &&
        prezimeRadnika.value != "" &&
        jmbgRadnika.value > 0 &&
        emailRadnika.value != "" &&
        senioritetRadnika.value != ""
      ) {
        fetch(
          `https://localhost:7279/Radnik/PromenitiRadnika/${jmbgRadnika.value}/${imeRadnika.value}/${prezimeRadnika.value}/${senioritetRadnika.value}/${emailRadnika.value}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((p) => {
            if (p.ok) {
              p.json().then((q) => {
                alert("Uspesno updateovan radnik");
                this.promeniRadnikaLokal(q);
              });
            } else if (p.status == 400) {
              alert("Greska prilikom unosa radnika");
            }
          })
          .catch((p) => {
            alert("Greška prilikom upisa.");
          });
      }
    };

    //Button click functionality
    dugme.onclick = () => {
      let ime = this.kontejner.querySelector(".ime").value;
      let prezime = this.kontejner.querySelector(".prezime").value;
      let jmbg = this.kontejner.querySelector(".jmbg").value;
      let senioritetRadnika =
        this.kontejner.querySelector(".senioritetRadnika").value;
      let emailRadnika = this.kontejner.querySelector(".emailRadnika").value;

      if (
        ime != "" &&
        prezime != "" &&
        jmbg > 0 &&
        emailRadnika != "" &&
        senioritetRadnika != ""
      ) {
        fetch("https://localhost:7279/Radnik/DodatiRadnika/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firmaIme: this.ime,
            jmbg: jmbg,
            ime: ime,
            prezime: prezime,
            senioritet: senioritetRadnika,
            email: emailRadnika,
          }),
        })
          .then((p) => {
            if (p.ok) {
              p.json().then((q) => {
                alert("Uspesno dodat radnik");
                this.updateRadnika();
              });
            } else if (p.status == 400) {
              alert("Greska prilikom update radnika");
            }
          })
          .catch((p) => {
            alert("Greška prilikom update radnika.");
          });
      } else {
        alert("Niste lepo uneli sve parametre radnika");
      }
    };
  }

  crtajDodajTask(host) {
    const formaDodajTask = document.createElement("div");
    formaDodajTask.className = "formaDodajTask";
    host.appendChild(formaDodajTask);
    // Ime Taska
    let imeTaskaLabela = document.createElement("p");
    imeTaskaLabela.innerHTML = "Ime Taska";
    imeTaskaLabela.className = "labela";
    formaDodajTask.appendChild(imeTaskaLabela);
    let imeTaska = document.createElement("input");
    imeTaska.className = "imeTaska";
    formaDodajTask.appendChild(imeTaska);
    // Opis Taska
    let opisTaskaLabela = document.createElement("p");
    opisTaskaLabela.innerHTML = "Opis Taska";
    opisTaskaLabela.className = "labela";
    formaDodajTask.appendChild(opisTaskaLabela);
    let opisTaska = document.createElement("input");
    opisTaska.className = "opisTaska";
    formaDodajTask.appendChild(opisTaska);
    //Tip Taska
    let tipTaskaLabela = document.createElement("p");
    tipTaskaLabela.innerHTML = "Tip taska";
    tipTaskaLabela.className = "labela";
    formaDodajTask.appendChild(tipTaskaLabela);
    let tipTaska = document.createElement("input");
    tipTaska.type = "number";
    tipTaska.setAttribute("min", "1");
    tipTaska.setAttribute("max", "3");
    tipTaska.setAttribute("placeholder", "1=To do 2=In progress 3=Bug");
    tipTaska.className = "tipTaska";
    formaDodajTask.appendChild(tipTaska);

    // Dodaj task dugme
    let dugme = document.createElement("button");
    dugme.className = "dodajRadnikaDugme";
    dugme.innerHTML = "Dodaj task";
    formaDodajTask.appendChild(dugme);

    // Ucitaj task dugme
    let ucitajDugme = document.createElement("button");
    ucitajDugme.className = "ucitajDugme";
    ucitajDugme.innerHTML = "Ucitaj Task";
    formaDodajTask.appendChild(ucitajDugme);
    ucitajDugme.onclick = () => {
      let taskSelect = this.kontejner.querySelector(".selectTask");

      fetch(`https://localhost:7279/Task/Task/${taskSelect.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((p) => {
          if (p.ok) {
            p.json().then((q) => {
              imeTaska.value = q.naziv;
              opisTaska.value = q.opis;
              tipTaska.value = q.tip;
            });
          } else if (p.status == 400) {
            alert("Greska prilikom unosa radnika");
          }
        })
        .catch((p) => {
          alert("Greška prilikom upisa.");
        });
    };

    // Update task dugme
    let updateDugme = document.createElement("button");
    let taskSelect = this.kontejner.querySelector(".selectTask");
    updateDugme.className = "ucitajDugme";
    updateDugme.innerHTML = "Update Task";
    formaDodajTask.appendChild(updateDugme);
    updateDugme.onclick = () => {
      if (imeTaska.value != "" && opisTaska.value != "") {
        fetch(
          `https://localhost:7279/Tasko/PromeniTask/${taskSelect.value}/${imeTaska.value}/${opisTaska.value}/${tipTaska.value}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((p) => {
            if (p.ok) {
              p.json().then((q) => {
                alert("Uspesno updateovan task");
              });
            } else if (p.status == 400) {
              alert("Greska prilikom unosa radnika");
            }
          })
          .catch((p) => {
            alert("Greška prilikom upisa.");
          });
      }
    };

    //Button click functionality
    dugme.onclick = () => {
      let imeTaska = this.kontejner.querySelector(".imeTaska").value;
      let opisTaska = this.kontejner.querySelector(".opisTaska").value;
      let tipTaska = this.kontejner.querySelector(".tipTaska").value;

      if (imeTaska != "" && opisTaska != "") {
        fetch("https://localhost:7279/Task/DodajTask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            naziv: imeTaska,
            opis: opisTaska,
            tip: tipTaska,
          }),
        })
          .then((p) => {
            if (p.status == 200) {
              this.updateTaskove();
              alert("Uspesno dodat task");
            } else if (p.status == 400) {
              alert("Greška prilikom upisa taska.");
            }
          })
          .catch((e) => {
            alert("Greška prilikom upisa taska.");
          });
      } else {
        alert("Niste lepo uneli sve parametre taska");
      }
    };
  }

  crtajHeading(host) {
    const kontHeading = document.createElement("div");
    kontHeading.className = "kontHeading";
    host.appendChild(kontHeading);

    const kontLabele = document.createElement("div");
    kontLabele.className = "kontLabele";
    kontHeading.appendChild(kontLabele);

    var elLabela = document.createElement("h3");
    elLabela.innerHTML = "Ime firme: " + this.ime;
    kontLabele.appendChild(elLabela);

    elLabela = document.createElement("h3");
    elLabela.innerHTML = "Broj zaposljenih: " + this.radnici.length;
    kontLabele.appendChild(elLabela);
  }
  crtajDesniDeo(host) {
    this.rightContainer = document.createElement("div");
    this.rightContainer.className = "rightContainer";
    host.appendChild(this.rightContainer);

    const divHeading = document.createElement("div");
    divHeading.className = "rightHeader";
    this.rightContainer.appendChild(divHeading);

    const naslovDodajTaskRadniku = document.createElement("p");
    naslovDodajTaskRadniku.innerHTML = "Dodaj task radniku";
    divHeading.appendChild(naslovDodajTaskRadniku);

    const inputsContainer = document.createElement("div");
    inputsContainer.className = "inputsContainer";
    divHeading.appendChild(inputsContainer);

    const select = document.createElement("select");
    select.name = "Radnici";
    select.className = "selectRadnik";
    inputsContainer.appendChild(select);
    this.radnici.map((radnik) => {
      const option = document.createElement("option");
      option.text = radnik.ime + " " + radnik.prezime;
      option.value = radnik.jmbg;
      option.className = "selectRadnikOptions";
      select.appendChild(option);
    });

    fetch("https://localhost:7279/Task/PreuzmiTaskove", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((p) => {
        if (p.ok) {
          p.json().then((q) => {
            const selectTaskovi = document.createElement("select");
            selectTaskovi.name = "Taskovi";
            selectTaskovi.className = "selectTask";
            inputsContainer.appendChild(selectTaskovi);
            q.map((task) => {
              const option = document.createElement("option");
              option.text = task.naziv;
              option.value = task.id;
              option.className = "selectRadnikOptions";
              selectTaskovi.appendChild(option);
            });
          });
        } else if (p.status == 400) {
          alert("Greska prilikom unosa radnika");
        }
      })
      .catch((e) => {
        alert("Greška prilikom citanja taska.");
      });

    // Dodaj radniku task dugme
    let taskRadnigDugme = document.createElement("button");
    taskRadnigDugme.className = "dodajTaskRadnikuDugme";
    taskRadnigDugme.innerHTML = "Dodaj task radniku";
    taskRadnigDugme.onclick = () => {
      this.dodajTaskRadniku();
    };
    divHeading.appendChild(taskRadnigDugme);

    // Obrisi radnika dugme
    let obrisiRadnikaDugme = document.createElement("button");
    obrisiRadnikaDugme.className = "dodajTaskRadnikuDugme";
    obrisiRadnikaDugme.innerHTML = "Obrisi radnika";
    obrisiRadnikaDugme.onclick = () => {
      this.obrisiRadnika();
    };
    divHeading.appendChild(obrisiRadnikaDugme);

    // Obrisi task dugme
    let obrisiTaskDugme = document.createElement("button");
    obrisiTaskDugme.className = "dodajTaskRadnikuDugme";
    obrisiTaskDugme.innerHTML = "Obrisi task";
    obrisiTaskDugme.onclick = () => {
      this.obrisiTask();
    };
    divHeading.appendChild(obrisiTaskDugme);

    this.crtajTaskove(this.rightContainer);
  }

  updateRadnika() {
    let radniciSelect = this.kontejner.querySelector(".selectRadnik");
    radniciSelect.innerHTML = "";
    this.radnici.map((radnik) => {
      const option = document.createElement("option");
      option.text = radnik.ime + " " + radnik.prezime;
      option.value = radnik.jmbg;
      option.className = "selectRadnikOptions";
      radniciSelect.appendChild(option);
    });
  }
  updateTaskove() {
    let taskoviSelect = this.kontejner.querySelector(".selectTask");
    taskoviSelect.innerHTML = "";
    fetch("https://localhost:7279/Task/PreuzmiTaskove", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((p) => {
        if (p.ok) {
          p.json().then((q) => {
            q.map((task) => {
              const option = document.createElement("option");
              option.text = task.naziv;
              option.value = task.id;
              option.className = "selectRadnikOptions";
              taskoviSelect.appendChild(option);
            });
          });
        } else if (p.status == 400) {
          alert("Greska prilikom unosa taska");
        }
      })
      .catch((e) => {
        alert("Greška prilikom citanja taska.");
      });
  }

  dodajTaskRadniku() {
    let radnikSelectovan = this.kontejner.querySelector(".selectRadnik").value;
    let taskSelectovan = this.kontejner.querySelector(".selectTask").value;
    fetch(
      `https://localhost:7279/Task/DodajTaskRadniku/${radnikSelectovan}/${taskSelectovan}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((p) => {
        if (p.status == 200) {
          this.updateTaskove();
          this.updateTaskRadnik();
          alert("Uspesno dodat task");
        } else if (p.status == 400) {
          alert("Ne mozete dodati isti task dva puta istom radniku");
        }
      })
      .catch((e) => {
        alert("Greška prilikom upisa taska.");
      });
  }

  obrisiRadnika() {
    let radnikSelectovan = this.kontejner.querySelector(".selectRadnik").value;

    fetch(
      `https://localhost:7279/Radnik/IzbrisatiRadnika/${radnikSelectovan}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((p) => {
        if (p.status == 200) {
          this.updateTaskove();
          this.updateTaskRadnik();
          alert("Uspesno izbrisan radnik");
        } else if (p.status == 400) {
          //   alert("Ne mozete dodati isti task dva puta istom radniku");
        }
      })
      .catch((e) => {
        // alert("Greška prilikom upisa taska.");
      });
    for (var i = 0; i < this.radnici.length; i++) {
      if (this.radnici[i].jmbg.toString() == radnikSelectovan) {
        this.radnici.splice(i, 1);
      }
    }
    this.updateRadnika();
    this.updateTaskRadnik();
  }

  obrisiTask() {
    let taskSelectovan = this.kontejner.querySelector(".selectTask").value;

    fetch(`https://localhost:7279/Task/ObrisiTask/${taskSelectovan}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((p) => {
        if (p.status == 200) {
          this.updateTaskove();
          alert("Uspesno izbrisan task");
        } else if (p.status == 400) {
          //   alert("Ne mozete dodati isti task dva puta istom radniku");
        }
      })
      .catch((e) => {
        // alert("Greška prilikom upisa taska.");
      });
    this.updateTaskove();
    this.updateTaskRadnik();
  }

  crtajTaskove(host) {
    fetch("https://localhost:7279/Task/RadniciTaskovi/Nolimix", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((p) => {
        if (p.ok) {
          p.json().then((q) => {
            this.taskContainer = document.createElement("div");
            this.taskContainer.className = "rightBody";
            host.appendChild(this.taskContainer);
            q.map((task) => {
              if (task.taskovi.length > 0) {
                const t = new Task(
                  task.jmbg,
                  task.ime,
                  task.prezime,
                  task.taskovi,
                  task.email,
                  task.senioritet
                );
                t.crtajTask(this.taskContainer);
              }
            });
          });
        } else if (p.status == 400) {
          alert("Greska prilikom unosa radnika");
        }
      })
      .catch((e) => {
        alert("Greška prilikom citanja taska.");
      });
  }

  updateTaskRadnik() {
    this.taskContainer.parentNode.removeChild(this.taskContainer);
    this.crtajTaskove(this.rightContainer);
  }
  promeniRadnikaLokal(radnik) {
    for (var i = 0; i < this.radnici.length; i++) {
      if (this.radnici[i].jmbg.toString() == radnik.jmbg) {
        this.radnici[i] = radnik;
        this.updateTaskRadnik();
        this.updateRadnika();
      }
    }
  }
}
