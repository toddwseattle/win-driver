// calculator.ts
import { WinAppDriverClient } from "./winappdriver-client";
import { saveScreenshot } from "./save-screenshot";

async function runCalculatorTest() {
  const client = new WinAppDriverClient({
    hostname: "127.0.0.1",
    port: 4723,
    app: "Microsoft.WindowsCalculator_8wekyb3d8bbwe!App",
  });

  try {
    await client.startSession();

    await saveScreenshot(client, "before.png");

    // Click 5
    const five = await client.findElement(
      "xpath",
      '//Button[@AutomationId="num5Button"]'
    );
    await client.click(five);

    // Click +
    const plus = await client.findElement(
      "xpath",
      '//Button[@AutomationId="plusButton"]'
    );
    await client.click(plus);

    // Click 3
    const three = await client.findElement(
      "xpath",
      '//Button[@AutomationId="num3Button"]'
    );
    await client.click(three);

    // Click =
    const equals = await client.findElement(
      "xpath",
      '//Button[@AutomationId="equalButton"]'
    );
    await client.click(equals);

    // Get result
    const result = await client.findElement(
      "xpath",
      '//Text[@AutomationId="CalculatorResults"]'
    );
    const text = await client.getText(result);
    console.log("Result:", text);

    await saveScreenshot(client, "after.png");
  } finally {
    await client.closeSession();
  }
}

runCalculatorTest().catch(console.error);
