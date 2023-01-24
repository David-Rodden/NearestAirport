async function getAirports() {
    const response = await fetch("/airports");
    return await response.json();
}