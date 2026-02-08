import type { Browser } from "puppeteer";

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
    if (browser && browser.connected) return browser;

    try {
        const puppeteer = await import("puppeteer");
        browser = await puppeteer.default.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        return browser;
    } catch (err) {
        throw new Error(
            `Puppeteer not available. Install it: npm i -D puppeteer\n${err}`
        );
    }
}

export async function capturePreview(opts?: {
    url?: string;
    waitMs?: number;
}): Promise<{ base64: string; mimeType: string }> {
    const url = opts?.url ?? "http://localhost:3333";
    const waitMs = Math.max(0, Math.min(opts?.waitMs ?? 2000, 15000));

    // Quick check: is the target server running?
    try {
        await fetch(url, { signal: AbortSignal.timeout(3000) });
    } catch {
        throw new Error(
            `Cannot reach ${url} — is the dev server running? Start with: npm run dev`
        );
    }

    const b = await getBrowser();
    const page = await b.newPage();

    try {
        await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
        await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

        // Wait for React to render
        if (waitMs > 0) {
            await new Promise((r) => setTimeout(r, waitMs));
        }

        const screenshot = await page.screenshot({
            type: "png",
            encoding: "base64",
        });

        return {
            base64: screenshot as string,
            mimeType: "image/png",
        };
    } finally {
        await page.close();
    }
}

export async function closeBrowser(): Promise<void> {
    if (browser) {
        await browser.close();
        browser = null;
    }
}
