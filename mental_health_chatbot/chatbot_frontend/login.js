import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mqclrsjpbvdabybuzixp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xY2xyc2pwYnZkYWJ5YnV6aXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODU4ODYsImV4cCI6MjA1OTc2MTg4Nn0.gOjAhuMD6fE58MdGXAYLwEvLWV_Gztxx0IVtxfSuGms';
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

