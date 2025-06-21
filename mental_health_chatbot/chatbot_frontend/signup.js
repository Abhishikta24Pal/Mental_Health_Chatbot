//DATABASE INTEGRATION
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mqclrsjpbvdabybuzixp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xY2xyc2pwYnZkYWJ5YnV6aXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODU4ODYsImV4cCI6MjA1OTc2MTg4Nn0.gOjAhuMD6fE58MdGXAYLwEvLWV_Gztxx0IVtxfSuGms';
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
        message.innerText = "Sign-up successful! Confirmation Email Sent Redirecting...";

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

