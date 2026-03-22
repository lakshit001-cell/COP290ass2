export const loginUser = async (email, pass) => {
    // MOCK LOGIC: Currently returns true if the fields aren't empty.
    // When the backend is ready, your teammate will replace this with:
    // return await fetch('your-backend-api.com/login', { ... });
    return new Promise((resolve) => {
        setTimeout(() => {
            if (email.includes("@") && pass.length > 7) {
                resolve({ success: true, user: { name: "Test User", email } });
            }
            else {
                resolve({ success: false, message: "Invalid credentials" });
            }
        }, 500); // Simulates a 0.5s network delay
    });
};
