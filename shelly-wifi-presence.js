// Shelly Script: Accensione luce garage (Con reset del timer interno)
// Ad ogni rilevamento del Wifi dell'auto, la luce viene accesa, resettando il timer
// di auto-spegnimento interno dello Shelly.

// --- CONFIGURAZIONE ---
let CONFIG = {
  // SSID (nome) della rete Wi-Fi della tua auto
  CarSSID: "DIRECT-BMW 18863",
  
  // ID dello switch da controllare
  SwitchID: 0,
  
  // Intervallo di controllo presenza auto (in SECONDI)
  ScanInterval_s: 30,
};

// --- FUNZIONE PRINCIPALE ---
function checkForCar() {
  Shelly.call("Wifi.Scan", {}, function(result) {
    if (!result || typeof result.results === 'undefined') {
      // Non logghiamo nulla in caso di fallimento per non riempire la console
      // La logica semplicemente non prosegue
      return;
    }
    
    let networks = result.results;
    let carNetworkFound = false;
    for (let i = 0; i < networks.length; i++) {
      if (networks[i].ssid === CONFIG.CarSSID) {
        carNetworkFound = true;
        break;
      }
    }

    // Se l'auto viene rilevata...
    if (carNetworkFound) {
      console.log("Auto presente. Accendo la luce e resetto il timer di auto-spegnimento.");
      // ...accendi la luce. Questo comando fa anche ripartire da capo
      // il timer di auto-spegnimento configurato nello Shelly.
      Shelly.call("Switch.Set", { id: CONFIG.SwitchID, on: true });
    }
  });
}

// --- INIZIALIZZAZIONE ---
Timer.set(CONFIG.ScanInterval_s * 1000, true, checkForCar);
console.log("Script 'Rilevamento Auto' avviato.");
console.log("Assicurati che il timer 'Auto Spegnimento' dello Shelly impostato sia >30 secondi.");

checkForCar();