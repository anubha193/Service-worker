const loginBtn = document.getElementById("btn");
const email = document.getElementById("email");
const password = document.getElementById("password");

const checkServiceWorker = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No support for service worker');
    }
};

const registerServiceWorker = async () => {
    try {
        const register = await navigator.serviceWorker.register('./service-worker.js');
        console.log('Service Worker registered');
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                registration.update();
            }
        }
        return register;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
    }
};

const subscribeUser = async (register) => {
    try {
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array("BGCOvhGtv8aUncRP-YVpc5nRFKUih7HVaGcaRFQ7jyRuMa9BMKFIG7V7cIYU1jFkOCBqutdcqzSG7bM0cSw59iw")
        });
        console.log('Subscription:', subscription);

        await fetch('http://localhost:5500/subscribe', { 
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
          .then(data => console.log('Server response:', data))
          .catch(error => console.error('HTTP error:', error));
    } catch (error) {
        console.error('Subscription error:', error);
    }
};

const sendNotification = async () => {
    checkServiceWorker();
    const register = await registerServiceWorker();

    Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
            await subscribeUser(register);
        }
    }).catch(error => console.error('Notification permission error:', error));
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

sendNotification();

loginBtn.addEventListener("click", async () => {
    const obj = {
        email: email.value,
        password: password.value
    };
    console.log(obj);
    await fetch("http://localhost:5500/login", {
        method: 'GET',
    }).then(response => response.json())
      .then(data => console.log("Server data:", data))
      .catch(error => console.error("Fetch error:", error));
});
