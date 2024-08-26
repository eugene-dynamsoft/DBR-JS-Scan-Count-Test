import { test, expect } from '@playwright/test';

const url = 'https://192.168.1.178:5503/hello-world.html';

test('should launch and verify the page', async ({ browser }) => {
  const startTime = Date.now();
  const duration = 25 * 60 * 1000; // 25 minutes in milliseconds
  const interval = 20 * 1000; // 20 seconds milliseconds
  let repeatCount = 0;
  let codeDetected = 0;
  while (Date.now() - startTime < duration) {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.waitForTimeout(interval);
    // Navigate to the specified URL
    await page.goto(url, { waitUntil: 'networkidle' });

    const beforeCount = await getScanCount();

    console.log("beforeCount", beforeCount);

    /* Selecting the Camera option to scan */
    // await page.selectOption('.dce-sel-camera', { label: 'Camo' });
    
    // Wait for the camera to update
    await page.waitForTimeout(2800);
    
    // Initialize resultArray outside the waitForFunction callback
    let resultArray = [];
    // Wait for the results to be populated
    await page.waitForFunction(
      ({ codeDetected }) => {
        const resultsElement = document.getElementById('results');
        if (resultsElement && resultsElement.textContent) {
          const content = resultsElement.textContent.trim();
          const occurrences = (content.match(/QR_CODE/g) || []).length;
          codeDetected += occurrences;
          return occurrences >= 2;
        }
        return false;
      },
      { codeDetected },
      { timeout: 5000 } // 5 seconds timeout
    ).then(() => console.log("Results populated"));


    const afterCount = await getScanCount();
    console.log("afterCount", afterCount);

    // Verify that the scan count has increased
    expect(afterCount).toBeGreaterThan(beforeCount);

    // Close the context instead of just the page
    await context.close();
    repeatCount++;
    console.log("repeatCount", repeatCount);
    console.log("Total code detected: ", codeDetected);
  }
});


async function getScanCount() {
  let rep = await fetch('https://mdls.dynamsoftonline.com/license/item/103082778', {
    headers: {
      DynamsoftLTSTokenV2: "Qa2yJ41dTIbLLzulwLAwMy8EilpZBTZ8JeLhiZtR/Iavmd7y2hPzgyG282YoBBmva3ywW9QJ7TeCw7q5wkJM9N5j3pjMlDCskW1RDBIyYV0OA24fs5571sKLgw=="
    },
    cache: "no-cache"
  })
  if(!rep.ok){
    throw Error("fetch failure!")
  }
  let obj = await rep.json();
  
  return obj.usedCount;
}