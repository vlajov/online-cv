const counter = document.querySelector(".counter-number");
async function updateCounter() {
    let response = await fetch(CONFIG.COUNTER_URL);
    let data = await response.json();
    counter.innerHTML = data;
}

updateCounter();