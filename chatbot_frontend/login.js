import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://gadkbmitzafzlxapjaoq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZGtibWl0emFmemx4YXBqYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTI2MzAsImV4cCI6MjA4NTE4ODYzMH0.AxfotpfEpTXCVjSDELNwDZ0m-FXi1U0UuljxlQZ_mGw'; 
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const guestBtn = document.getElementById("guest-btn");
    const signBtn = document.getElementById("sign-btn");

    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Please fill in both fields!");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert("Login failed: " + error.message);
        } else {
            window.location.href = "chatbot.html";
        }
    });

    signBtn.addEventListener("click", () => {
        window.location.href = "signup.html";
    });
});

