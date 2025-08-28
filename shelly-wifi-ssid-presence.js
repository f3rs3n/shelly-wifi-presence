// Shelly Script: Garage Light Control
// Turns on the light when the car's Wi-Fi is detected, which in turn
// resets the built-in auto-off timer of the Shelly device.

// --- CONFIGURATION ---
let CONFIG = {
  // SSID (name) of your car's Wi-Fi network
  CarSSID: "YOUR_CAR_WIFI_SSID",
  
  // The ID of the switch to control
  SwitchID: 0,
  
  // How often to check for the car's presence (in SECONDS)
  ScanInterval_s: 30,
};

// --- MAIN FUNCTION ---
function checkForCar() {
  Shelly.call("Wifi.Scan", {}, function(result) {
    if (!result || !result.results) {
      return; // Exit silently on scan failure or empty results
    }
    
    // Check if at least one network in the scan results matches the car's SSID.
    // .some() stops iterating as soon as the condition is met.
    const carNetworkFound = result.results.some(function(network) {
      return network.ssid === CONFIG.CarSSID;
    });

    // Only proceed if the car is found
    if (carNetworkFound) {
      Shelly.call("Switch.GetStatus", { id: CONFIG.SwitchID }, function(status) {
        // Only turn the light on if it is currently OFF to avoid spamming commands
        if (status.output === false) {
          console.log("Car present and light is off. Turning on and resetting timer.");
          Shelly.call("Switch.Set", { id: CONFIG.SwitchID, on: true });
        }
      });
    }
  });
}

// --- INITIALIZATION ---
Timer.set(CONFIG.ScanInterval_s * 1000, true, checkForCar);
console.log("Script 'Car Detection' started.");
console.log("Ensure the Shelly's 'Auto Off' timer is set correctly.");

checkForCar();
