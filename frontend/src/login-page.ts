import { hasErrors, validateLoginFields } from "./validation.js";
import "./styles/login.css";

/**
 * Renders the login screen into `root`.
 * Isolated module so the shell can later swap in a router or framework root.
 */
export function mountLoginPage(root: HTMLElement): void {
  root.innerHTML = `
    <div class="login-shell">
      <main class="login-card" aria-labelledby="login-title">
        <header class="login-header">
          <div class="login-mark" aria-hidden="true">H</div>
          <div class="login-header-text">
            <h1 id="login-title">Habit Tracker</h1>
            <p class="subtitle">Sign in to your account</p>
          </div>
        </header>
        <form id="login-form" novalidate>
          <div class="field">
            <label for="username">Username or email</label>
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              aria-describedby="username-error"
            />
            <p id="username-error" class="field-error" role="alert" aria-live="polite"></p>
          </div>
          <div class="field field-password">
            <div class="field-label-row">
              <label for="password">Password</label>
              <button
                type="button"
                class="text-btn"
                id="toggle-password"
                aria-pressed="false"
                aria-controls="password"
                aria-label="Show password"
              >
                Show
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              aria-describedby="password-error"
            />
            <p id="password-error" class="field-error" role="alert" aria-live="polite"></p>
          </div>
          <div class="form-meta">
            <a href="#" class="login-link" id="forgot-password">Forgot password?</a>
          </div>
          <div class="form-actions">
            <button type="submit">Sign in</button>
          </div>
        </form>
        <p class="login-footer">Build habits, one day at a time.</p>
      </main>
    </div>
  `;

  const form = root.querySelector<HTMLFormElement>("#login-form");
  const usernameInput = root.querySelector<HTMLInputElement>("#username");
  const passwordInput = root.querySelector<HTMLInputElement>("#password");
  const usernameErrorEl = root.querySelector<HTMLElement>("#username-error");
  const passwordErrorEl = root.querySelector<HTMLElement>("#password-error");
  const togglePasswordBtn = root.querySelector<HTMLButtonElement>("#toggle-password");
  const forgotLink = root.querySelector<HTMLAnchorElement>("#forgot-password");

  if (
    !form ||
    !usernameInput ||
    !passwordInput ||
    !usernameErrorEl ||
    !passwordErrorEl
  ) {
    return;
  }

  const userField = usernameInput;
  const passField = passwordInput;
  const userError = usernameErrorEl;
  const passError = passwordErrorEl;

  forgotLink?.addEventListener("click", (event) => {
    event.preventDefault();
    // Placeholder until reset flow exists.
  });

  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const show = passField.type === "password";
      passField.type = show ? "text" : "password";
      togglePasswordBtn.setAttribute("aria-pressed", show ? "true" : "false");
      togglePasswordBtn.setAttribute(
        "aria-label",
        show ? "Hide password" : "Show password",
      );
      togglePasswordBtn.textContent = show ? "Hide" : "Show";
    });
  }

  function clearFieldErrors(): void {
    userError.textContent = "";
    passError.textContent = "";
    userField.removeAttribute("aria-invalid");
    passField.removeAttribute("aria-invalid");
  }

  function applyErrors(username: string, password: string): boolean {
    clearFieldErrors();
    const errors = validateLoginFields(username, password);
    if (!hasErrors(errors)) {
      return false;
    }
    if (errors.username) {
      userError.textContent = errors.username;
      userField.setAttribute("aria-invalid", "true");
    }
    if (errors.password) {
      passError.textContent = errors.password;
      passField.setAttribute("aria-invalid", "true");
    }
    return true;
  }

  userField.addEventListener("input", () => {
    if (userError.textContent) {
      userError.textContent = "";
      userField.removeAttribute("aria-invalid");
    }
  });

  passField.addEventListener("input", () => {
    if (passError.textContent) {
      passError.textContent = "";
      passField.removeAttribute("aria-invalid");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyErrors(userField.value, passField.value);
    // Backend integration can hook here later.
  });
}
