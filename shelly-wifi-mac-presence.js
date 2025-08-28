// Shelly Script: Garage Light Control (MAC Address Detection)
// Turns on the light when a specific device's MAC address is detected nearby,
// which in turn resets the built-in auto-off timer of the Shelly device.

// --- CONFIGURATION ---
let CONFIG = {
  // Enter the MAC addresses of the devices to monitor here.
  // The address is the BSSID of the Wi-Fi hotspot.
  CarMACs: ["XX:XX:XX:XX:XX:XX"], // <-- Inserisci qui il MAC della tua auto
  
  // The ID of the switch to control
  SwitchID: 0,
  
  // How often to check for the device's presence (in SECONDS)
  ScanInterval_s: 30,
};

// --- SCRIPT INITIALIZATION (No need to edit) ---
// Normalize MAC addresses to uppercase for reliable comparison
CONFIG.CarMACs = CONFIG.CarMACs.map(function(mac) { return mac.toUpperCase(); });

// --- MAIN FUNCTION ---
function checkForCar() {
  Shelly.call("Wifi.Scan", {}, function(result) {
    if (!result || !result.results) {
      return; // Exit silently on scan failure or empty results
    }
    
    // Check if any scanned network's BSSID (MAC address) matches one in our list.
    const carNetworkFound = result.results.some(function(network) {
      return CONFIG.CarMACs.includes(network.bssid.toUpperCase());
    });

    // Only proceed if a target device is found
    if (carNetworkFound) {
      Shelly.call("Switch.GetStatus", { id: CONFIG.SwitchID }, function(status) {
        // Only turn the light on if it is currently OFF to avoid spamming commands
        if (status.output === false) {
          console.log("Target device detected and light is off. Turning on.");
          Shelly.call("Switch.Set", { id: CONFIG.SwitchID, on: true });
        }
      });
    }
  });
}

// --- SCRIPT START ---
Timer.set(CONFIG.ScanInterval_s * 1000, true, checkForCar);
console.log("Script 'MAC Address Detection' started.");
console.log("Ensure the Shelly's 'Auto Off' timer is set correctly.");

checkForCar();
