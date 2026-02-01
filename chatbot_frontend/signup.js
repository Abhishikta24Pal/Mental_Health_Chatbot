//DATABASE INTEGRATION
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://gadkbmitzafzlxapjaoq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZGtibWl0emFmemx4YXBqYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTI2MzAsImV4cCI6MjA4NTE4ODYzMH0.AxfotpfEpTXCVjSDELNwDZ0m-FXi1U0UuljxlQZ_mGw'; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUp() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const message = document.getElementById("message");

    if (!email || !password || !confirmPassword) {
        message.innerText = "All fields are required!";
        return;
    }

    if (password !== confirmPassword) {
        message.innerText = "Passwords do not match!";
        return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        message.style.color = "red";
        message.innerText = "Sign-up failed: " + error.message;
    } else {
        message.style.color = "green";
        message.innerText = "Sign-up successful! Redirecting...";

        setTimeout(() => {
            window.location.href = "chatbot.html";
        }, 1500);
    }
}

window.goToLogin = function () {
    window.location.href = "login.html";
};


window.signUp = signUp;
window.goToLogin = goToLogin;

