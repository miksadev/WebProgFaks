export class Task {
  constructor(jmbg, ime, prezime, taskovi, mail, senioritet) {
    this.ime = ime;
    this.prezime = prezime;
    this.jmbg = jmbg;
    this.mail = mail;
    this.senioritet = senioritet;
    this.taskovi = taskovi;
    this.kontejner = null;
  }

  crtajTask(host) {
    if (!host) {
      throw new Exception("Roditeljski element ne postoji");
    }

    this.taskovi.map((task) => {
      this.kontejner = document.createElement("div");
      this.kontejner.classList.add("taskKontejner");

      if (task.tip == 1) {
        this.kontejner.classList.add("todo");
      }
      if (task.tip == 2) {
        this.kontejner.classList.add("wip");
      }
      if (task.tip == 3) {
        this.kontejner.classList.add("bug");
      }
      host.appendChild(this.kontejner);

      var taskIme = document.createElement("body");
      taskIme.className = "taskIme";
      taskIme.innerHTML = task.task;
      this.kontejner.appendChild(taskIme);
      var taskOpis = document.createElement("body");
      taskOpis.className = "taskOpis";
      taskOpis.innerHTML = task.opis;
      this.kontejner.appendChild(taskOpis);
      var imeRadnika = document.createElement("p");
      imeRadnika.className = "imeRadnika";
      imeRadnika.innerHTML =
        this.ime + " " + this.prezime + " " + this.mail + " " + this.senioritet;
      this.kontejner.appendChild(imeRadnika);

      var obrisiTask = document.createElement("button");
      obrisiTask.className = "obrisiTask";
      obrisiTask.innerHTML = "Obrisi task radniku";
      this.kontejner.appendChild(obrisiTask);

      obrisiTask.onclick = () => {
        // this.kontejner.style.display = "none";
        fetch(
          `https://localhost:7279/Task/ObrisiTaskRadniku/${this.jmbg}/${task.id}`,
          {
            method: "Delete",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((p) => {
            this.kontejner.parentNode.removeChild(this.kontejner);
          })
          .catch((e) => {
            alert("Greška prilikom citanja taska.");
          });
      };
    });
  }
}
