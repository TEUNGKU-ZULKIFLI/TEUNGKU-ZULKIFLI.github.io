// loader.js
async function loadPartial(id, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to load ${file}`);
    const content = await response.text();
    document.getElementById(id).innerHTML = content;
  } catch (err) {
    console.error(err);
  }
}

// jalankan setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
  loadPartial("navbar", "partials/navbar.html");
  loadPartial("footer", "partials/footer.html");
});
