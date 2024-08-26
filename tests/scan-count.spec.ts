import { test, expect } from '@playwright/test';

// Customize the URL to your local live server
const url = 'https://192.168.1.178:5503/hello-world.html';

test('should launch and verify the page', async ({ browser }) => {
  const startTime = Date.now();
  const duration = 25 * 60 * 1000; // 25 minutes in milliseconds for total test duration
  const interval = 3 * 60 * 1000; // 3 minutes milliseconds delay between each scan loop
  let repeatCount = 0;
  
  while (Date.now() - startTime < duration) {
    console.log("===== Start A New Loop =====");
    test.info().annotations.push({ type: '===== Start A New Loop =====' });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.waitForTimeout(interval);
    // Navigate to the specified URL
    await page.goto(url, { waitUntil: 'networkidle' });

    const beforeCount = await getScanCount();

    console.log("beforeCount", beforeCount);
    test.info().annotations.push({ type: 'Before Count', description: `${beforeCount}` });

    /* Selecting the Camera option to scan */
    // await page.selectOption('.dce-sel-camera', { label: 'Camo' });
    
    // Wait for the camera to update
    // await page.waitForTimeout(2000);
    
    // Wait for the results to be populated
    let resultArray = await page.evaluate(async () => {
      const startTime = Date.now();
      while (Date.now() - startTime < 10000) { // 10 seconds in milliseconds
        const resultsElement = document.getElementById('results');
        if (resultsElement && resultsElement.textContent) {
          const content = resultsElement.textContent.trim();
          const qrCodeStrings = content.match(/QR_CODE.*?(?=QR_CODE|$)/gs) || [];
          const uniqueStrings = [...new Set(qrCodeStrings.map(s => s.trim()))];
          
          return uniqueStrings;
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms before checking again
      }
      return null; // Return null if no results after 10 seconds
    });

    
    // Close the context instead of just the page
    await context.close();
    // await context.close();

    if (resultArray) {
      console.log(`${resultArray.length} Unique QR code strings detected: ${resultArray}`);
      test.info().annotations.push({ type: 'QR Codes Detected', description: `${resultArray.length} Unique QR codes: ${resultArray.join(', ')}` });
    } else {
      console.log("No results or less than 2 unique QR code strings detected");
      test.info().annotations.push({ type: 'QR Codes Detected', description: 'No results or less than 2 unique QR code strings detected' });
    }


    const afterCount = await getScanCount();
    console.log("afterCount", afterCount);
    test.info().annotations.push({ type: 'After Count', description: `${afterCount}` });

    // Verify that the scan count has increased
    // expect(afterCount).toBeGreaterThan(beforeCount);


    repeatCount++;
    console.log("repeatCount", repeatCount);
    test.info().annotations.push({ type: 'Repeat Count', description: `${repeatCount}` });
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