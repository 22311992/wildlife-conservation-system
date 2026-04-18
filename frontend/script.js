(function() {
    // Guest login handler
    function handleGuestLogin() {
        const result = guestLogin();
        if (result.success) {
            window.location.href = "dashboard.html";
        }
    }

    function getStoredUser() {
        try {
            const raw = localStorage.getItem("wildlife_conservation_user");
            if (raw) {
                return JSON.parse(raw);
            }
        } catch(e) {}
        return null;
    }

    function setStoredUser(user) {
        localStorage.setItem("wildlife_conservation_user", JSON.stringify(user));
    }

    function clearStoredUser() {
        localStorage.removeItem("wildlife_conservation_user");
    }

    function authenticateUser(email, password) {
        if (typeof login !== 'undefined') {
            return login(email, password);
        }
        return { success: false, error: "Login function not available" };
    }

    function redirectToDashboard() {
        window.location.href = "dashboard.html";
    }

    function showError(message) {
        const errorDiv = document.getElementById("errorMsg");
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = "block";
            setTimeout(() => {
                if (errorDiv) errorDiv.style.display = "none";
            }, 3200);
        }
    }

    function resetButtonState(btn, originalHtml) {
        if (btn) {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    }

    function handleLoginSubmit(event) {
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const loginButton = document.getElementById("loginBtn");

        if (!emailInput || !passwordInput || !loginButton) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showError("Please fill in both email and password.");
            return;
        }

        const originalButtonHtml = loginButton.innerHTML;
        loginButton.innerHTML = `<span>⏳</span> Verifying credentials <span>🔍</span>`;
        loginButton.disabled = true;

        const errorContainer = document.getElementById("errorMsg");
        if (errorContainer) errorContainer.style.display = "none";

        setTimeout(() => {
            const authResult = authenticateUser(email, password);

            if (authResult.success) {
                setStoredUser(authResult.user);
                redirectToDashboard();
            } else {
                showError(authResult.error || "Login failed. Try again.");
                resetButtonState(loginButton, originalButtonHtml);
                passwordInput.value = "";
                passwordInput.focus();
                emailInput.style.borderColor = "rgba(229, 80, 70, 0.7)";
                setTimeout(() => {
                    if (emailInput) emailInput.style.borderColor = "";
                }, 1000);
            }
        }, 580);
    }

    function autoFillDemoCredentials(email, password) {
        const emailField = document.getElementById("email");
        const passField = document.getElementById("password");
        const errorDiv = document.getElementById("errorMsg");

        if (emailField && passField) {
            emailField.value = email;
            passField.value = password;
            if (errorDiv) errorDiv.style.display = "none";
            if (emailField.style) emailField.style.borderColor = "";
        }
    }

    function attachDemoClickHandlers() {
        const demoRows = document.querySelectorAll(".cred-row");
        demoRows.forEach(row => {
            row.addEventListener("click", (e) => {
                const demoEmail = row.getAttribute("data-email");
                const demoPass = row.getAttribute("data-pass");
                if (demoEmail && demoPass) {
                    autoFillDemoCredentials(demoEmail, demoPass);
                }
            });
        });
    }

    function attachGuestButtonHandler() {
        const guestBtn = document.getElementById("guestBtn");
        if (guestBtn) {
            guestBtn.addEventListener("click", function() {
                handleGuestLogin();
            });
        }
    }

    function clearErrorOnInput() {
        const emailInput = document.getElementById("email");
        const passInput = document.getElementById("password");
        const errorDiv = document.getElementById("errorMsg");

        if (emailInput) {
            emailInput.addEventListener("input", () => {
                if (errorDiv) errorDiv.style.display = "none";
                if (emailInput) emailInput.style.borderColor = "";
            });
        }
        if (passInput) {
            passInput.addEventListener("input", () => {
                if (errorDiv) errorDiv.style.display = "none";
            });
        }
    }

    function checkAlreadyLoggedIn() {
        const user = getStoredUser();
        if (user && window.location.pathname.includes("index.html") === false && !window.location.pathname.endsWith("index.html")) {
            const currentPage = window.location.pathname.split("/").pop();
            if (currentPage === "" || currentPage === "index.html" || currentPage === "login.html") {
                window.location.href = "dashboard.html";
            }
        }
        if (user && (window.location.pathname === "/" || window.location.pathname.includes("index.html"))) {
            window.location.href = "dashboard.html";
        }
    }

    function initLoginPage() {
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", handleLoginSubmit);
        }
        attachDemoClickHandlers();
        attachGuestButtonHandler();
        clearErrorOnInput();

        const stored = getStoredUser();
        if (stored) {
            const isLoginPage = window.location.pathname.endsWith("index.html") || 
                                window.location.pathname === "/" || 
                                window.location.pathname.endsWith("login.html");
            if (!isLoginPage) {
                return;
            }
            if (isLoginPage) {
                const emailField = document.getElementById("email");
                const passField = document.getElementById("password");
                if (emailField && passField) {
                    emailField.value = "";
                    passField.value = "";
                }
                clearStoredUser();
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLoginPage);
    } else {
        initLoginPage();
    }
})();