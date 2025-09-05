# Shelly Garage Light Automation Scripts

This repository contains two scripts for Shelly Gen2/Gen3 devices (like Shelly Plus or Pro series) to automatically turn on a garage light based on the presence of a car's Wi-Fi network.

The primary goal is to create a "welcome home" light that stays on as long as the car is present and turns off with a delay after you leave, all while remaining compatible with a physical wall switch.

There are two versions of the script:
1.  `shelly-wifi-ssid-presence.js`: Detects the car by its Wi-Fi network name (SSID).
2.  `shelly-wifi-mac-presence.js`: Detects the car by its Wi-Fi network's unique MAC address (BSSID). This is generally more reliable.

## Features

- **Automatic Light Activation**: The light turns on when the car's Wi-Fi is detected nearby.
- **Smart Timer Reset**: The light stays on as long as the car is present by continuously resetting the Shelly's built-in timer.
- **Works Offline**: The detection logic is entirely local and does not require an internet or home Wi-Fi connection in the garage.
- **Wall Switch Compatible**: The physical button continues to work as expected.
- **Efficient and Lightweight**: The scripts are optimized to be gentle on the Shelly device.

## Prerequisites

1.  A Shelly Gen2/Gen3 device (e.g., Shelly 1PM Mini Gen3, Shelly Plus 1PM) updated to the latest firmware.
2.  The Shelly device must be configured to control your garage light.

## Setup Instructions

1.  **Configure Shelly's Auto-Off Timer**:
    - Access your Shelly's web interface.
    - Go to **Settings > Timer > Auto Off**.
    - Set a timer for how long you want the light to stay on after you leave (e.g., `180` seconds for 3 minutes). This is your "courtesy light" delay.
    - This timer will be reset by the script as long as your car is detected.

2.  **Install the Script**:
    - In the Shelly web interface, go to the **Scripts** section.
    - Create a new script.
    - Copy the entire content of either `shelly-wifi-ssid-presence.js` or `shelly-wifi-mac-presence.js` and paste it into the editor.
    - Configure the `CarSSID` or `CarMACs` variable at the top of the script with your car's Wi-Fi details.
    - Save and enable the script by toggling the switch next to its name.

## How It Works

The script periodically scans for nearby Wi-Fi networks at a set interval (e.g., every 30 seconds).

If the car's network is detected, the script sends an `Switch.Set` command to turn the light ON. This action has a clever side effect: it **resets the Shelly's built-in auto-off timer**, causing the countdown to start over.

As long as the car is present, this cycle repeats, effectively keeping the light on. When you leave, the script stops detecting the car, the timer is no longer reset, and the light turns off automatically after the configured delay.

### Pro Tip: Finding Your Car's Wi-Fi Details

In my experience, the Wi-Fi network used by your car's infotainment system for **Apple CarPlay or Android Auto** works perfectly for this. You don't need to enable a separate internet hotspot. You can find the SSID and MAC address by scanning for networks with your phone while this feature is active.

### Design Philosophy & Adaptability

This script is intentionally designed to integrate with a "momentary" or "button" switch setup combined with Shelly's internal timer. This provides a practical delay for a garage light, preventing it from turning off too quickly.

While the script could be adapted for a direct ON/OFF logic (light on if present, off if absent), that approach is less practical for a garage setting, as the light would shut off instantly upon leaving, which is often undesirable.
