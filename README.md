# Overview
- Note that the test is currently only running on Chrome browser. You can modify the playwright.config.js to run the test on other browsers.
- Scan Count test following the below steps:
  1. Launch the browser
  2. Navigate to the specified URL (I use live server to host the hellow-world.html file)
  3. Scan the QR code
  4. Verify the scan count
  5. Close the browser
  6. Repeat the above steps with a delay

### Setup
- Ensure you have Node.js installed
- Ensure you have VS Code Liver Server [https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer] installed and setup.

- Follow the steps to configure the code under tests/scan-count-spec.ts to use your own local setup
    - Configure line 4 to your local live server URL
        ```
        const url = 'https://192.168.1.178:5503/hello-world.html';
        ```
    - Configure the camera option on line 27 if you do not want to use the default camera upon launching the site
        ```
        /* Selecting the Camera option to scan */
        // await page.selectOption('.dce-sel-camera', { label: 'Camo' });
        ```
    - Configure your test duration and interval on line 8 and 9
        ```
        const duration = 25 * 60 * 1000; // 25 minutes in milliseconds for total test duration
        const interval = 3 * 60 * 1000; // 3 minutes milliseconds delay between each scan loop
        ```

### Installation


1. Clone the repository:
   ```
   git clone https://github.com/eugene-dynamsoft/DBR-JS-Scan-Count-Test.git
   ```
2. Navigate to the project directory:
   ```
   cd DBR-JS-Scan-Count-Test
   ```
3. Install required dependencies:
   ```
   npm install
   ```
4. Run the test
   ```
   npm test
   ```

