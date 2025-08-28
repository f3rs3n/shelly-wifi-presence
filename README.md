# Shelly Garage Light Automation Scripts

A collection of scripts for Shelly Gen3 devices to automatically control a garage light based on a car's presence, detected via its Wi-Fi hotspot.

## Project Overview

This project provides a simple yet effective way to automate your garage lighting. The script turns on a light connected to a Shelly device whenever your car is nearby and ensures it stays on as long as the car is present. It leverages the Shelly's built-in "Auto Off" timer, making the solution efficient and integrated with the device's native features.

This repository contains two versions of the script, using different methods for vehicle detection.

## Features

* **Automatic Light Control**: Turns the light on when you arrive.

* **Presence Detection**: Keeps the light on as long as the car is detected.

* **Efficient Timer Logic**: Resets the Shelly's built-in auto-off timer instead of managing a custom timer within the script.

* **Optimized Performance**: Checks the light's status before sending commands to avoid unnecessary network traffic.

* **Easy Configuration**: All settings are managed in a simple `CONFIG` object at the top of the script.

* **Fully Offline**: Works without an internet connection, relying on local Wi-Fi scanning.

## Scripts Included

### 1. SSID Version (`ssid-version.js`)

* **Detection Method**: Scans for the Wi-Fi network name (SSID) broadcasted by your car's infotainment system.

* **Pros**: Simple to set up; just requires the network name.

* **Cons**: Less unique, as other devices could potentially have the same SSID.

### 2. MAC Address Version (`mac-version.js`)

* **Detection Method**: Scans for the unique MAC address (BSSID) of your car's Wi-Fi hotspot.

* **Pros**: More robust and reliable, as the MAC address is a unique hardware identifier.

* **Cons**: Requires you to find the specific MAC address of your car's hotspot.

## How It Works

1. **Configuration**: You set up a built-in "Auto Off" timer in your Shelly device's settings (e.g., 180 seconds).

2. **Scanning**: The script runs on the Shelly and periodically scans for nearby Wi-Fi networks (e.g., every 15-30 seconds).

3. **Detection**: It checks if the car's Wi-Fi (identified by SSID or MAC address) is present in the scan results.

4. **Action**: If the car is detected and the light is currently off, the script sends a command to turn the light on.

5. **Timer Reset**: This "turn on" command automatically resets the Shelly's 180-second auto-off countdown. As long as the script keeps detecting the car, it will keep resetting the timer, effectively keeping the light on.

6. **Departure**: When you leave, the script no longer detects the car. The last auto-off countdown completes, and the light turns off automatically.

## Design Philosophy & Adaptability

This script is intentionally designed to integrate with a Shelly connected to a **momentary switch (button)** and configured with an **"Auto Off" timer**. This setup is ideal for a garage light for a key reason:

* **Courtesy Light Delay**: The timer ensures the light stays on for a few minutes after you've left the garage, preventing it from shutting off abruptly and leaving you in the dark.

While the script could be modified for a direct ON/OFF logic (light on when present, off immediately when absent), that approach is less practical for this specific application.

## Pro Tip: Which Wi-Fi to use?

In most cases, you don't need to activate a full internet-sharing hotspot in your car. The local Wi-Fi network that the infotainment system creates for wireless **Apple CarPlay** or **Android Auto** is usually sufficient for this script to work. This network is broadcasted even without an active internet connection.

## Requirements

* A Shelly Gen3 device (e.g., Shelly 1PM Mini Gen3).

* A vehicle with a Wi-Fi hotspot feature (including the one for CarPlay/Android Auto).

## Installation

1. Access your Shelly device's web interface by navigating to its IP address in a browser.

2. Go to the **Scripts** section.

3. Click the **(+)** button to create a new script.

4. Copy the content of either `ssid-version.js` or `mac-version.js` and paste it into the editor.

5. Update the `CONFIG` section with your details (see below).

6. Save the script and enable it using the toggle switch.

## Configuration

Before saving, you must edit the `CONFIG` object at the top of the script:

let CONFIG = {

// For ssid-version.js

CarSSID: "YOUR_CARS_WIFI_NAME",

// For mac-version.js

CarMACs: ["XX:XX:XX:XX:XX:XX"],

// Common settings

SwitchID: 0,ScanInterval_s: 30, // How often to scan, in seconds};

Finally, in your Shelly's settings, navigate to **Timers > Auto Off** and set a timer (e.g., 180 seconds). This value should be longer than your `ScanInterval_s`.
