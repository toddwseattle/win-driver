/**
 * WinAppDriver Client
 *
 * A TypeScript client library for automating Windows desktop applications using the Windows Application Driver (WinAppDriver) protocol.
 * This client provides a WebDriver-compatible interface to interact with Windows applications by communicating with the WinAppDriver service.
 *
 * Key capabilities:
 * - Session management (create and destroy sessions with target applications)
 * - Element finding and selection using various search strategies
 * - User interactions (click, keyboard input, text input)
 * - Element properties inspection (text, attributes, visibility, enabled state)
 * - Window management and switching
 * - Screenshot capture
 *
 * Usage:
 * ```typescript
 * const client = new WinAppDriverClient({
 *   hostname: 'localhost',
 *   port: 4723,
 *   app: 'C:\\Windows\\System32\\calc.exe'
 * });
 * await client.startSession();
 * // ... perform interactions ...
 * await client.closeSession();
 * ```
 */

interface SessionOptions {
  hostname: string;
  port: number;
  app: string;
}

interface Element {
  ELEMENT: string;
}

/**
 * Lightweight WinAppDriver client for creating sessions and automating Windows apps via the WebDriver protocol.
 */
export class WinAppDriverClient {
  private sessionId: string | null = null;
  private baseUrl: string;

  /**
   * Create a client targeting a WinAppDriver host.
   * @param options Connection and app launch settings.
   */
  constructor(private options: SessionOptions) {
    this.baseUrl = `http://${options.hostname}:${options.port}`;
  }

  /**
   * Start a new automation session for the configured app.
   */
  async startSession() {
    const response = await fetch(`${this.baseUrl}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desiredCapabilities: {
          app: this.options.app,
          platformName: "Windows",
        },
      }),
    });

    const data: any = await response.json();
    if (data.sessionId) {
      this.sessionId = data.sessionId;
      console.log("Session created:", this.sessionId);
    } else {
      throw new Error("Failed to create session: " + JSON.stringify(data));
    }
  }

  // ELEMENT FINDING
  /**
   * Find a single element.
   * @param strategy Locator strategy (e.g., xpath, accessibility id).
   * @param selector Selector value for the chosen strategy.
   */
  async findElement(strategy: string, selector: string): Promise<Element> {
    const response = await fetch(
      `${this.baseUrl}/session/${this.sessionId}/element`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ using: strategy, value: selector }),
      }
    );
    const data: any = await response.json();
    return data.value;
  }

  /**
   * Find multiple elements.
   * @param strategy Locator strategy.
   * @param selector Selector value.
   */
  async findElements(strategy: string, selector: string): Promise<Element[]> {
    const response = await fetch(
      `${this.baseUrl}/session/${this.sessionId}/elements`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ using: strategy, value: selector }),
      }
    );
    const data: any = await response.json();
    return data.value;
  }

  // INTERACTIONS
  /**
   * Click an element.
   */
  async click(element: Element) {
    await fetch(
      `${this.baseUrl}/session/${this.sessionId}/element/${element.ELEMENT}/click`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );
  }

  /**
   * Send text to an element.
   * @param text String to type.
   */
  async sendKeys(element: Element, text: string) {
    await fetch(
      `${this.baseUrl}/session/${this.sessionId}/element/${element.ELEMENT}/value`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: text.split("") }), // Split into array of characters
      }
    );
  }

  /**
   * Clear an element's value.
   */
  async clear(element: Element) {
    await fetch(
      `${this.baseUrl}/session/${this.sessionId}/element/${element.ELEMENT}/clear`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );
  }

  // ELEMENT PROPERTIES
  /**
   * Read visible text from an element.
   */
  async getText(element: Element): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/session/${this.sessionId}/element/${element.ELEMENT}/text`,
      { method: "GET" }
    );
    const data: any = await response.json();
    return data.value;
  }

  /**
   * Read an element attribute.
   * @param attributeName Name of the attribute.
   */
  async getAttribute(element: Element, attributeName: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/session/${this.sessionId}/element/${element.ELEMENT}/attribute/${attributeName}`,
      { method: "GET" }
    );
    const data: any = await response.json();
    return data.value;
  }

  /**
   * Check element visibility.
   */
  async isDisplayed(element: Element): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/session/${this.sessionId}/element/${element.ELEMENT}/displayed`,
      { method: "GET" }
    );
    const data: any = await response.json();
    return data.value;
  }

  /**
   * Check if element is enabled.
   */
  async isEnabled(element: Element): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/session/${this.sessionId}/element/${element.ELEMENT}/enabled`,
      { method: "GET" }
    );
    const data: any = await response.json();
    return data.value;
  }

  // KEYBOARD ACTIONS
  /**
   * Send keys to the active window (not a specific element).
   */
  async sendGlobalKeys(keys: string) {
    // Send keyboard input to the session (not to a specific element)
    await fetch(`${this.baseUrl}/session/${this.sessionId}/keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: keys.split("") }),
    });
  }

  // WINDOW MANAGEMENT
  /**
   * Get all window handles for the session.
   */
  async getWindowHandles(): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/session/${this.sessionId}/window_handles`,
      { method: "GET" }
    );
    const data: any = await response.json();
    return data.value;
  }

  /**
   * Switch to a given window handle.
   */
  async switchToWindow(handle: string) {
    await fetch(`${this.baseUrl}/session/${this.sessionId}/window`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: handle }),
    });
  }

  // SCREENSHOTS
  /**
   * Capture a base64-encoded PNG of the current window.
   */
  async takeScreenshot(): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/session/${this.sessionId}/screenshot`,
      { method: "GET" }
    );
    const data: any = await response.json();
    return data.value; // Returns base64-encoded PNG
  }

  // UTILITY
  /**
   * Sleep helper for simple waits.
   */
  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Close the active session if one exists.
   */
  async closeSession() {
    if (this.sessionId) {
      await fetch(`${this.baseUrl}/session/${this.sessionId}`, {
        method: "DELETE",
      });
      console.log("Session closed");
    }
  }
}
