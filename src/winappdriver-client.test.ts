import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock node-fetch module BEFORE importing the client
vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

import { WinAppDriverClient } from "./winappdriver-client";
import fetch from "node-fetch";

const mockFetch = fetch as ReturnType<typeof vi.fn>;

describe("WinAppDriverClient", () => {
  let client: WinAppDriverClient;

  beforeEach(() => {
    client = new WinAppDriverClient({
      hostname: "localhost",
      port: 4723,
      app: "C:\\Windows\\System32\\notepad.exe",
    });
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create a client with correct baseUrl", () => {
      expect(client).toBeDefined();
    });
  });

  describe("startSession", () => {
    it("should start a session and set sessionId", async () => {
      const sessionId = "session-123";
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          sessionId,
        }),
      });

      await client.startSession();

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:4723/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desiredCapabilities: {
            app: "C:\\Windows\\System32\\notepad.exe",
            platformName: "Windows",
          },
        }),
      });
    });

    it("should throw error if session creation fails", async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          error: "Failed to start session",
        }),
      });

      await expect(client.startSession()).rejects.toThrow(
        "Failed to create session"
      );
    });
  });

  describe("findElement", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should find an element by strategy and selector", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: element,
        }),
      });

      const result = await client.findElement("id", "button-id");

      expect(result).toEqual(element);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/element",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ using: "id", value: "button-id" }),
        }
      );
    });
  });

  describe("findElements", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should find multiple elements", async () => {
      const elements = [{ ELEMENT: "element-1" }, { ELEMENT: "element-2" }];
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: elements,
        }),
      });

      const result = await client.findElements("class name", "button-class");

      expect(result).toEqual(elements);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/elements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ using: "class name", value: "button-class" }),
        }
      );
    });
  });

  describe("click", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should click an element", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });

      await client.click(element);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/element/element-456/click",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    });
  });

  describe("sendKeys", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should send keys to an element", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });

      await client.sendKeys(element, "hello");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/element/element-456/value",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: ["h", "e", "l", "l", "o"] }),
        }
      );
    });
  });

  describe("clear", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should clear an element", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });

      await client.clear(element);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/element/element-456/clear",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    });
  });

  describe("getText", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should get text from an element", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: "Hello World",
        }),
      });

      const result = await client.getText(element);

      expect(result).toBe("Hello World");
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/element/element-456/text",
        { method: "GET" }
      );
    });
  });

  describe("getAttribute", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should get an attribute from an element", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: "button-value",
        }),
      });

      const result = await client.getAttribute(element, "value");

      expect(result).toBe("button-value");
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/element/element-456/attribute/value",
        { method: "GET" }
      );
    });
  });

  describe("isDisplayed", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should check if element is displayed", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: true,
        }),
      });

      const result = await client.isDisplayed(element);

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/element/element-456/displayed",
        { method: "GET" }
      );
    });

    it("should return false when element is not displayed", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: false,
        }),
      });

      const result = await client.isDisplayed(element);

      expect(result).toBe(false);
    });
  });

  describe("isEnabled", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should check if element is enabled", async () => {
      const element = { ELEMENT: "element-456" };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: true,
        }),
      });

      const result = await client.isEnabled(element);

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/element/element-456/enabled",
        { method: "GET" }
      );
    });
  });

  describe("sendGlobalKeys", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should send global keyboard keys", async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });

      await client.sendGlobalKeys("ABC");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/keys",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: ["A", "B", "C"] }),
        }
      );
    });
  });

  describe("getWindowHandles", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should get window handles", async () => {
      const handles = ["handle-1", "handle-2"];
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: handles,
        }),
      });

      const result = await client.getWindowHandles();

      expect(result).toEqual(handles);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/window_handles",
        { method: "GET" }
      );
    });
  });

  describe("switchToWindow", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should switch to a window", async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });

      await client.switchToWindow("handle-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/window",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "handle-1" }),
        }
      );
    });
  });

  describe("takeScreenshot", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should take a screenshot", async () => {
      const base64Screenshot =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          value: base64Screenshot,
        }),
      });

      const result = await client.takeScreenshot();

      expect(result).toBe(base64Screenshot);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123/screenshot",
        { method: "GET" }
      );
    });
  });

  describe("sleep", () => {
    it("should sleep for specified milliseconds", async () => {
      const start = Date.now();
      await client.sleep(100);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(100);
    });
  });

  describe("closeSession", () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();
      mockFetch.mockClear();
    });

    it("should close the session", async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });

      await client.closeSession();

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4723/session/session-123",
        { method: "DELETE" }
      );
    });

    it("should not make request if no session is active", async () => {
      const newClient = new WinAppDriverClient({
        hostname: "localhost",
        port: 4723,
        app: "C:\\Windows\\System32\\notepad.exe",
      });

      await newClient.closeSession();

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("integration test", () => {
    it("should perform a complete workflow", async () => {
      // Setup
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ sessionId: "session-123" }),
      });
      await client.startSession();

      // Find element
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ value: { ELEMENT: "element-456" } }),
      });
      const element = await client.findElement("id", "input-field");

      // Clear and send keys
      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });
      await client.clear(element);

      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });
      await client.sendKeys(element, "test input");

      // Get text
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ value: "test input" }),
      });
      const text = await client.getText(element);

      expect(text).toBe("test input");
      expect(mockFetch).toHaveBeenCalledTimes(5);
    });
  });
});
