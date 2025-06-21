//DATABASE INTEGRATION
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'; 
const supabaseUrl = 'https://mqclrsjpbvdabybuzixp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xY2xyc2pwYnZkYWJ5YnV6aXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODU4ODYsImV4cCI6MjA1OTc2MTg4Nn0.gOjAhuMD6fE58MdGXAYLwEvLWV_Gztxx0IVtxfSuGms'; 
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = "index.html"; // REDIRECT
    } else {
        console.log("User logged in:", user.email);
    }
})();
//CHAT-HISTORY
document.addEventListener("DOMContentLoaded", function () {
    let chatHistory = document.getElementById("chat-history");
    for (let i = 0; i < 7; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        let dateElement = document.createElement("div");
        dateElement.classList.add("chat-dates");
        dateElement.textContent = date.toDateString();
        dateElement.dataset.date = date.toISOString().split("T")[0]; 
        dateElement.addEventListener("click", function () {
            loadChatHistoryForDate(this.dataset.date);
        });
        chatHistory.appendChild(dateElement);
    }
});

//API KEY INTEGRATION
const API_KEY = "AIzaSyCSy7Pnf0W1-tvrPArck1EzFzEkm6--YaQ"; // GEMINI API KEY
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${API_KEY}`;

async function sendMessage() {
    let inputField = document.getElementById("chat-input");
    let message = inputField.value.trim();
    if (!message) return;



//CHATBOX
    let chatBox = document.getElementById("chat-box");
//USER-MESSAGE
    let userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);
//BOT-MESSAGE
    let botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerHTML = `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
    botMessage.setAttribute("id", "temp-bot");
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    inputField.value = "";
//GEMINI API JSON REQUEST
try {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `You are a concise and empathetic mental health assistant. Please respond in no more than 9 short sentences and keep it easy to understand.\nUser: ${message}`
                        }
                    ]
                }
            ]
        }) 
    });

    const data = await response.json();

        let botReply = "Sorry, I couldn't respond right now.";

        if (data && data.candidates && data.candidates.length > 0) {
            botReply = data.candidates[0].content.parts[0].text;
        }

        const tempBot = document.getElementById("temp-bot");
        if (tempBot) {
            tempBot.textContent = botReply;
            tempBot.removeAttribute("id");
        }

        chatBox.scrollTop = chatBox.scrollHeight;
//CHAT-HISTORY(SUPABASE)
        const { data: sessionData } = await supabase.auth.getUser();
        const user = sessionData.user;
        if (user) {
            await supabase.from("chats").insert([
                {
                    user_id: user.id,
                    sender: "user",
                    message: message,
                    created_at: new Date().toISOString()
                },
                {
                    user_id: user.id,
                    sender: "bot",
                    message: botReply,
                    created_at: new Date().toISOString()
                }
            ]);
        }

    } catch (error) {
        console.error("Error:", error);
        const tempBot = document.getElementById("temp-bot");
        if (tempBot) {
            tempBot.textContent = "Oops! Something went wrong.";
            tempBot.removeAttribute("id");
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("chat-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
//FETCH CHAT-HISTORY
async function loadChatHistoryForDate(dateString) {
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData.user;

    const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", `${dateString}T00:00:00Z`)
        .lte("created_at", `${dateString}T23:59:59Z`)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching chat history:", error.message);
        return;
    }

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = ""; 

    data.forEach(entry => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(entry.sender === "user" ? "user-message" : "bot-message");
        messageDiv.textContent = entry.message;
        chatBox.appendChild(messageDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

//SIDEBAR-PANEL

// USER-INFO
(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const emailField = document.getElementById("user-email");
    if (user) {
        emailField.textContent = user.email;

//THOUGHT OF THE DAY
        const thoughtResponse = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Give me one positive, short empathetic quote for a day." }]
                }]
            })
        });
        const thoughtData = await thoughtResponse.json();
        const thoughtText = thoughtData?.candidates?.[0]?.content?.parts?.[0]?.text || "Stay positive!";
        document.getElementById("thought").textContent = thoughtText;
    } else {
        emailField.textContent = "Not logged in";
    }
})();

//LOGOUT BUTTON
function logout() {
    supabase.auth.signOut()
        .then(() => {
            alert("You have been logged out.");
            window.location.href = "index.html"; 
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
            alert("Logout failed. Please try again.");
        });
}

window.logout = logout;

