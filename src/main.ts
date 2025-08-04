import { bangs } from "./bang";
import "./global.css";

// Define popular search engines with their bang codes
export const searchEngines = [
  { name: "Google", bang: "g", url: "https://www.google.com/search?q={{{s}}}" },
  { name: "DuckDuckGo", bang: "d", url: "https://duckduckgo.com/?q={{{s}}}" },
  { name: "Bing", bang: "b", url: "https://www.bing.com/search?q={{{s}}}" },
  { name: "Yahoo", bang: "y", url: "https://search.yahoo.com/search?p={{{s}}}" },
  { name: "Yandex", bang: "ya", url: "https://yandex.com/search/?text={{{s}}}" },
  { name: "Ecosia", bang: "e", url: "https://www.ecosia.org/search?q={{{s}}}" },
  { name: "Startpage", bang: "sp", url: "https://www.startpage.com/sp/search?query={{{s}}}" },
  { name: "Qwant", bang: "q", url: "https://www.qwant.com/?q={{{s}}}" },
  { name: "Brave", bang: "br", url: "https://search.brave.com/search?q={{{s}}}" },
  { name: "Mojeek", bang: "m", url: "https://www.mojeek.com/search?q={{{s}}}" },
];

export function noSearchDefaultPageRender() {
  const LS_DEFAULT_ENGINE = localStorage.getItem("default-engine") ?? "g";
  
  // Get custom engines from localStorage
  const customEngines = JSON.parse(localStorage.getItem("custom-engines") || "[]");
  
  // Combine built-in and custom engines
  const allEngines = [...searchEngines, ...customEngines];
  
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Und*ck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        
        <div class="engine-selector-container">
          <label for="default-engine">Default Search Engine:</label>
          <select id="default-engine" class="engine-selector">
            ${allEngines.map(engine => 
              `<option value="${engine.bang}" ${engine.bang === LS_DEFAULT_ENGINE ? 'selected' : ''}>
                ${engine.name}
              </option>`
            ).join('')}
          </select>
        </div>
        
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="${window.location.origin}?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
        
        <div class="custom-engine-container">
          <button id="add-custom-engine" class="add-engine-button">+ Add Custom Search Engine</button>
          <div id="custom-engine-form" class="custom-engine-form" style="display: none;">
            <input type="text" id="custom-engine-name" placeholder="Engine Name (e.g. Google)" class="custom-engine-input" />
            <input type="text" id="custom-engine-bang" placeholder="Bang (e.g. g)" class="custom-engine-input" />
            <input type="text" id="custom-engine-url" placeholder="URL with {{{s}}} for query" class="custom-engine-input" />
            <button id="save-custom-engine" class="save-engine-button">Save</button>
            <button id="cancel-custom-engine" class="cancel-engine-button">Cancel</button>
          </div>
        </div>
        
        <div class="instructions">
          <p><strong>How to use:</strong></p>
          <ul>
            <li>Set your default search engine above</li>
            <li>Copy the URL and add it as a custom search engine in your browser</li>
            <li>Use bangs like <code>!gh</code> for GitHub, <code>!w</code> for Wikipedia, etc.</li>
            <li>Your default engine will be used when no bang is specified</li>
          </ul>
        </div>
      </div>
      <footer class="footer">
        <a href="https://t3.chat" target="_blank">t3.chat</a>
        •
        <a href="https://x.com/theo" target="_blank">theo</a>
        •
        <a href="https://github.com/t3dotgg/unduck" target="_blank">github</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;
  const engineSelector = app.querySelector<HTMLSelectElement>("#default-engine")!;
  const addCustomEngineButton = app.querySelector<HTMLButtonElement>("#add-custom-engine")!;
  const customEngineForm = app.querySelector<HTMLDivElement>("#custom-engine-form")!;
  const customEngineName = app.querySelector<HTMLInputElement>("#custom-engine-name")!;
  const customEngineBang = app.querySelector<HTMLInputElement>("#custom-engine-bang")!;
  const customEngineUrl = app.querySelector<HTMLInputElement>("#custom-engine-url")!;
  const saveCustomEngineButton = app.querySelector<HTMLButtonElement>("#save-custom-engine")!;
  const cancelCustomEngineButton = app.querySelector<HTMLButtonElement>("#cancel-custom-engine")!;

  // Update the URL input with the current domain
  urlInput.value = `${window.location.origin}?q=%s`;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });

  engineSelector.addEventListener("change", () => {
    localStorage.setItem("default-engine", engineSelector.value);
  });

  // Custom engine functionality
  addCustomEngineButton.addEventListener("click", () => {
    customEngineForm.style.display = "block";
    addCustomEngineButton.style.display = "none";
  });

  cancelCustomEngineButton.addEventListener("click", () => {
    customEngineForm.style.display = "none";
    addCustomEngineButton.style.display = "block";
    customEngineName.value = "";
    customEngineBang.value = "";
    customEngineUrl.value = "";
  });

  saveCustomEngineButton.addEventListener("click", () => {
    const name = customEngineName.value.trim();
    const bang = customEngineBang.value.trim();
    const url = customEngineUrl.value.trim();

    if (!name || !bang || !url) {
      alert("Please fill in all fields");
      return;
    }

    if (!url.includes("{{{s}}}")) {
      alert("URL must contain {{{s}}} as a placeholder for the search query");
      return;
    }

    // Get existing custom engines or initialize empty array
    const customEngines = JSON.parse(localStorage.getItem("custom-engines") || "[]");
    
    // Check if bang already exists
    if (customEngines.some((engine: any) => engine.bang === bang) || 
        searchEngines.some(engine => engine.bang === bang)) {
      alert("A search engine with this bang already exists");
      return;
    }

    // Add new custom engine
    customEngines.push({ name, bang, url });
    localStorage.setItem("custom-engines", JSON.stringify(customEngines));

    // Reset form
    customEngineName.value = "";
    customEngineBang.value = "";
    customEngineUrl.value = "";
    customEngineForm.style.display = "none";
    addCustomEngineButton.style.display = "block";
    
    // Refresh the page to show the new engine
    location.reload();
  });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

// Get the default search engine from localStorage
const LS_DEFAULT_ENGINE = localStorage.getItem("default-engine") ?? "g";
// Find the default search engine URL pattern
const defaultEngine = searchEngines.find(engine => engine.bang === LS_DEFAULT_ENGINE) || searchEngines[0];

export function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  
  // Get custom engines from localStorage
  const customEngines = JSON.parse(localStorage.getItem("custom-engines") || "[]");
  
  // Check if the bang is a search engine bang first
  const searchEngine = searchEngines.find(engine => engine.bang === bangCandidate);
  const customEngine = customEngines.find((engine: any) => engine.bang === bangCandidate);
  const selectedBang = bangs.find((b) => b.t === bangCandidate);
  
  // Priority: custom engine > built-in search engine > bang > default engine
  let finalBang;
  if (customEngine) {
    finalBang = { u: customEngine.url };
  } else if (searchEngine) {
    finalBang = { u: searchEngine.url };
  } else if (selectedBang) {
    finalBang = { u: selectedBang.u };
  } else {
    finalBang = { u: defaultEngine.url };
  }

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
  if (cleanQuery === "") {
    if (customEngine || searchEngine) {
      // For search engines, we still need a query, so we'll return null to show the default page
      noSearchDefaultPageRender();
      return null;
    } else if (selectedBang) {
      return `https://${selectedBang.d}`;
    } else {
      // For default search engine with no query, show the default page
      noSearchDefaultPageRender();
      return null;
    }
  }

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = finalBang.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();
