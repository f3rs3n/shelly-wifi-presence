// Shelly Script: Garage Light Control (SSID Version)
// Resets the Shelly's built-in auto-off timer on every detection.

// --- CONFIGURATION ---
let CONFIG = {
  // SSID (name) of your car's Wi-Fi network
  CarSSID: "DIRECT-BMW 18863",
  
  // The ID of the switch to control
  SwitchID: 0,
  
  // How often to check for the car's presence (in SECONDS)
  ScanInterval_s: 30,
};

// --- MAIN FUNCTION ---
function checkForCar() {
  Shelly.call("Wifi.Scan", {}, function(result) {
    if (!result || !result.results) {
      return; // Exit silently on scan failure
    }
    
    const carNetworkFound = result.results.some(function(network) {
      return network.ssid === CONFIG.CarSSID;
    });

    // If the car is detected...
    if (carNetworkFound) {
      // ...turn the light on. This command is sent on every successful scan
      // to ensure the Shelly's auto-off timer is reset.
      console.log("Car present. Resetting auto-off timer.");
      Shelly.call("Switch.Set", { id: CONFIG.SwitchID, on: true });
    }
  });
}

// --- INITIALIZATION ---
Timer.set(CONFIG.ScanInterval_s * 1000, true, checkForCar);
console.log("Script 'Car Detection' (SSID Version) started.");
console.log("Ensure the Shelly's 'Auto Off' timer is set correctly.");

checkForCar();
