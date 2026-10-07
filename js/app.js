const cafes = [
    { nombre: "Cafe de grano tostado", descripcion: "Un cafe natural", imagen: "images/coffee1.jpg" },
    { nombre: "Cafe Americano Cortado", descripcion: "un cafe americano cortado", imagen: "images/coffee2.jpg" },
    { nombre: "Cafe Americano Clasico", descripcion: "Un cafe Americano Clsico", imagen: "images/coffee3.jpg" },
    { nombre: "Cafe de grano", descripcion: "Cafe pequeño", imagen: "images/coffee4.jpg" },
    { nombre: "Cafe tradicional", descripcion: "Cafe tradicional natual", imagen: "images/coffee5.jpg" },
    { nombre: "Cafe Macciato", descripcion: "Un macciato decorado", imagen: "images/coffee6.jpg" },
    { nombre: "Cafe Latte", descripcion: "Cafe Late clasico", imagen: "images/coffee7.jpg" },
    { nombre: "Cafe Latte 2", descripcion: "Cafe Late diferene forma", imagen: "images/coffee8.jpg" },
    { nombre: "Cafe con Espuma", descripcion: "Cafe con Espuma clasico", imagen: "images/coffee9.jpg" },
    { nombre: "Cafe Latte 3", descripcion: "Cafe late con otra figura ", imagen: "images/coffee10.jpg" }
];


const container = document.querySelector(".container");

const parametros = new URLSearchParams(window.location.search);
const cafeId = Number(parametros.get("cafe"));

if (window.location.pathname.endsWith("cafe.html")) {
    const cafe = cafes[cafeId];
    if (cafe) {
        document.title = `${cafe.nombre} | Coffee PWA`;
        container.classList.add("detail-container");
        container.innerHTML = `
            <a class="back-link" href="index.html">← Volver a todos los cafés</a>
            <article class="detail-card">
                <img src="${cafe.imagen}" alt="${cafe.nombre}">
                <div class="detail-body">
                    <p class="eyebrow">CAFÉ DESTACADO</p>
                    <h2>${cafe.nombre}</h2>
                    <p>${cafe.descripcion}</p>
                    <h3>Sobre este café</h3>
                    <p>Una preparación de café cuidadosamente elaborada, ideal para disfrutar en cualquier momento del día.</p>
                </div>
            </article>`;
    } else {
        container.innerHTML = '<p>No encontramos ese café. <a href="index.html">Volver al menú</a></p>';
    }
} else cafes.forEach((cafe, indice) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
        <a class="card-link" href="cafe.html?cafe=${indice}" aria-label="Ver detalles de ${cafe.nombre}">
            <img src="${cafe.imagen}" alt="${cafe.nombre}">
            <div class="card-body">
                <h2>${cafe.nombre}</h2>
                <p>${cafe.descripcion}</p>
            </div>
        </a>
    `;
    container.appendChild(card);
});


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("serviceworker.js")
            .then(registro => console.log("Service Worker registrado en:", registro.scope))
            .catch(error => console.log("Fallo el registro del Service Worker:", error));
    });
}
