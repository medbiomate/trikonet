# Mobile first-tap regression

The previous handler arrived with the module bootstrap, after server-rendered cards were already visible. Card descriptions and whitespace were not native links. In a WebKit reproduction, replacing the card during pointer-down cancelled the original gesture and navigated to the replacement job instead of the original.

The navigation core now installs synchronously before analytics or ad scripts and is idempotent when the module runtime starts. The initial render waits until the active gesture and its click window finish before replacing server markup. A stretched native title link covers the card while company links, buttons and form controls retain their own hit targets.

Validation: browser-tests/mobile-job-tap.cjs exercises WebKit and Chromium with mobile touch input: JavaScript disabled, startup without app module, redraw queued during pointer-down, Save button, and company link. All ten scenarios passed. Node regression tests also cover scrolling, cancelled gestures, modified clicks, duplicate setup, and render deferral.

Run from frontend using node browser-tests/mobile-job-tap.cjs with Playwright installed. PLAYWRIGHT_MODULE, WEBKIT_EXECUTABLE and CHROME_EXECUTABLE can point to existing runtimes. This uses local intercepted fixture responses and does not modify production records.
