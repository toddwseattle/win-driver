import { promises as fs } from "fs";
import path from "path";
import { WinAppDriverClient } from "./winappdriver-client";

/**
 * Capture a screenshot from the active WinAppDriver session and write it to disk.
 * @param client Active WinAppDriver client with a started session.
 * @param fileName File name to write (e.g., before.png).
 * @param directory Target directory; defaults to `screenshots` and is created if missing.
 */
export async function saveScreenshot(
  client: WinAppDriverClient,
  fileName: string,
  directory = "screenshots"
) {
  const imageBase64 = await client.takeScreenshot();
  await fs.mkdir(directory, { recursive: true });
  const filePath = path.join(directory, fileName);
  await fs.writeFile(filePath, Buffer.from(imageBase64, "base64"));
  console.log(`Saved screenshot to ${filePath}`);
}
