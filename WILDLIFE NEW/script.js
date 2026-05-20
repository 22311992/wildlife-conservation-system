(function() {

    // =========================
    // GUEST LOGIN
    // =========================

    function handleGuestLogin() {

        const sessionUser = {
            id: 0,
            name: "Guest",
            email: "guest@wildlife.com",
            role: "Guest",
            avatar: "👤"
        };

        setStoredUser(sessionUser);

        window.location.href = "dashboard.html";
    }

    // =========================
    // LOCAL STORAGE
    // =========================

    function getStoredUser() {
        try {
            const raw = localStorage.getItem("wildlife_conservation_user");

            if (raw) {
                return JSON.parse(raw);
            }

        } catch (e) {}

        return null;
    }

    function setStoredUser(user) {
        localStorage.setItem(
            "wildlife_conservation_user",
            JSON.stringify(user)
        );
    }

    function clearStoredUser() {
        localStorage.removeItem("wildlife_conservation_user");
    }

    // =========================
    // SUPABASE LOGIN
    // =========================

   async function authenticateUser(email, password) {

    const { data, error } = await supabaseClient
        .from('users')
        .select(`
            user_id,
            username,
            email,
            password_hash,
            role_id,
            roles (
                role_name
            )
        `)
        .eq('email', email)
        .eq('password_hash', password)
        .single();

    if (error || !data) {

        console.error("LOGIN ERROR:", error);

        return {
            success: false,
            error: "Invalid email or password"
        };
    }

    let avatar = "👤";

    if (data.roles.role_name === 'Administrator') {
        avatar = "👑";
    }
    else if (data.roles.role_name === 'Researcher') {
        avatar = "🔬";
    }
    else if (data.roles.role_name === 'Field Ranger') {
        avatar = "🛡️";
    }

    return {
        success: true,
        user: {
            id: data.user_id,
            name: data.username,
            email: data.email,
            role: data.roles.role_name,
            avatar: avatar
        }
    };
}

    // =========================
    // REDIRECT
    // =========================

    function redirectToDashboard() {
        window.location.href = "dashboard.html";
    }

    // =========================
    // ERROR MESSAGE
    // =========================

    function showError(message) {

        const errorDiv = document.getElementById("errorMsg");

        if (errorDiv) {

            errorDiv.textContent = message;

            errorDiv.style.display = "block";

            setTimeout(() => {

                if (errorDiv) {
                    errorDiv.style.display = "none";
                }

            }, 3200);
        }
    }

    // =========================
    // BUTTON RESET
    // =========================

    function resetButtonState(btn, originalHtml) {

        if (btn) {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    }

    // =========================
    // LOGIN SUBMIT
    // =========================

    async function handleLoginSubmit(event) {

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

        loginButton.innerHTML =
            `<span>⏳</span> Verifying credentials <span>🔍</span>`;

        loginButton.disabled = true;

        const errorContainer =
            document.getElementById("errorMsg");

        if (errorContainer) {
            errorContainer.style.display = "none";
        }

        setTimeout(async () => {

            const authResult =
                await authenticateUser(email, password);

            if (authResult.success) {

                setStoredUser(authResult.user);

                redirectToDashboard();

            } else {

                showError(
                    authResult.error ||
                    "Login failed. Try again."
                );

                resetButtonState(
                    loginButton,
                    originalButtonHtml
                );

                passwordInput.value = "";

                passwordInput.focus();

                emailInput.style.borderColor =
                    "rgba(229, 80, 70, 0.7)";

                setTimeout(() => {

                    if (emailInput) {
                        emailInput.style.borderColor = "";
                    }

                }, 1000);
            }

        }, 580);
    }

    // =========================
    // DEMO AUTOFILL
    // =========================

    function autoFillDemoCredentials(email, password) {

        const emailField =
            document.getElementById("email");

        const passField =
            document.getElementById("password");

        const errorDiv =
            document.getElementById("errorMsg");

        if (emailField && passField) {

            emailField.value = email;

            passField.value = password;

            if (errorDiv) {
                errorDiv.style.display = "none";
            }

            if (emailField.style) {
                emailField.style.borderColor = "";
            }
        }
    }

    // =========================
    // DEMO BUTTONS
    // =========================

    function attachDemoClickHandlers() {

        const demoRows =
            document.querySelectorAll(".cred-row");

        demoRows.forEach(row => {

            row.addEventListener("click", () => {

                const demoEmail =
                    row.getAttribute("data-email");

                const demoPass =
                    row.getAttribute("data-pass");

                if (demoEmail && demoPass) {

                    autoFillDemoCredentials(
                        demoEmail,
                        demoPass
                    );
                }
            });
        });
    }

    // =========================
    // GUEST BUTTON
    // =========================

    function attachGuestButtonHandler() {

        const guestBtn =
            document.getElementById("guestBtn");

        if (guestBtn) {

            guestBtn.addEventListener(
                "click",
                function() {

                    handleGuestLogin();
                }
            );
        }
    }

    // =========================
    // CLEAR ERROR
    // =========================

    function clearErrorOnInput() {

        const emailInput =
            document.getElementById("email");

        const passInput =
            document.getElementById("password");

        const errorDiv =
            document.getElementById("errorMsg");

        if (emailInput) {

            emailInput.addEventListener(
                "input",
                () => {

                    if (errorDiv) {
                        errorDiv.style.display = "none";
                    }

                    emailInput.style.borderColor = "";
                }
            );
        }

        if (passInput) {

            passInput.addEventListener(
                "input",
                () => {

                    if (errorDiv) {
                        errorDiv.style.display = "none";
                    }
                }
            );
        }
    }

    // =========================
    // INIT PAGE
    // =========================

    function initLoginPage() {

        const loginForm =
            document.getElementById("loginForm");

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                handleLoginSubmit
            );
        }

        attachDemoClickHandlers();

        attachGuestButtonHandler();

        clearErrorOnInput();
    }

    // =========================
    // START
    // =========================

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initLoginPage
        );

    } else {

        initLoginPage();
    }

})();