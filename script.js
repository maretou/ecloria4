// Catalogue ÉCLORIA : ajoutez ou modifiez les articles dans cette liste.
const produits = [
  {id:1,nom:"Lait corporel douceur",categorie:"corps",prix:6500,description:"Une touche de douceur pour votre peau.",tag:"BEST-SELLER",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85"},
  {id:2,nom:"Huile éclat satinée",categorie:"corps",prix:5500,description:"Pour une peau lumineuse et soyeuse.",tag:"ÉCLAT",image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=85"},
  {id:3,nom:"Gommage douceur",categorie:"corps",prix:6000,description:"Un rituel exfoliant tout en douceur.",tag:"RITUEL",image:"photos/gommage douceur.jpg"},
  {id:4,nom:"Crème mains velours",categorie:"corps",prix:3500,description:"Des mains douces au quotidien.",tag:"ESSENTIEL",image:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=85"},
  {id:5,nom:"Brume parfumée",categorie:"corps",prix:5000,description:"Une note fraîche et délicate.",tag:"NOUVEAUTÉ",image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=85"},
  {id:6,nom:"Coffret soin quotidien",categorie:"corps",prix:12000,description:"Une jolie routine à offrir ou à garder.",tag:"COUP DE CŒUR",image:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=85"},
  {id:7,nom:"Collier doré fin",categorie:"bijoux",prix:7500,description:"Une touche lumineuse et raffinée.",tag:"ÉLÉGANT",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85"},
  {id:8,nom:"Bracelet minimaliste",categorie:"bijoux",prix:6000,description:"Le détail délicat qui fait la différence.",tag:"INTEMPOREL",image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=85"},
  {id:9,nom:"Boucles d'oreilles dorées",categorie:"bijoux",prix:5500,description:"Pour illuminer vos tenues.",tag:"BEST-SELLER",image:"photos/boucle d'oreille doré.jpg"},
  {id:10,nom:"Bague élégance",categorie:"bijoux",prix:4500,description:"Une finition chic et discrète.",tag:"CHIC",image:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85"},
  {id:11,nom:"Parure délicate",categorie:"bijoux",prix:9500,description:"Un ensemble pour vos belles occasions.",tag:"COLLECTION",image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85"},
  {id:12,nom:"Bracelet perlé",categorie:"bijoux",prix:5000,description:"Une note douce et féminine.",tag:"NOUVEAUTÉ",image:"https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=85"}
];

const productsContainer = document.getElementById("products-container");
const cartCount = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const searchInput = document.getElementById("search-input");
const resultCount = document.getElementById("result-count");
const emptyMessage = document.getElementById("empty-message");

let filtreActif = "tout";
let panier = JSON.parse(localStorage.getItem("ecloriaPanier") || "[]");

function prixFCFA(prix) {
  return new Intl.NumberFormat("fr-FR").format(prix) + " FCFA";
}

function afficherProduits() {
  const recherche = searchInput.value.trim().toLocaleLowerCase("fr");
  const selection = produits.filter(p => {
    const bonFiltre = filtreActif === "tout" || p.categorie === filtreActif;
    const bonNom = (p.nom + " " + p.description).toLocaleLowerCase("fr").includes(recherche);
    return bonFiltre && bonNom;
  });

  productsContainer.innerHTML = selection.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.nom}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${p.categorie === "corps" ? "Soin du corps" : "Bijou"}</span>
        <h3>${p.nom}</h3>
        <p class="product-description">${p.description}</p>
        <div class="product-bottom">
          <span class="product-price">${prixFCFA(p.prix)}</span>
          <button class="add-button" data-add="${p.id}">Ajouter au panier +</button>
        </div>
      </div>
    </article>
  `).join("");

  resultCount.textContent = `${selection.length} article${selection.length > 1 ? "s" : ""}`;
  emptyMessage.hidden = selection.length !== 0;
}

function sauvegarderPanier() {
  localStorage.setItem("ecloriaPanier", JSON.stringify(panier));
  afficherPanier();
}

function ajouterAuPanier(id) {
  const article = panier.find(p => p.id === id);
  if (article) article.quantite += 1;
  else panier.push({id, quantite:1});
  sauvegarderPanier();
}

function afficherPanier() {
  const nombre = panier.reduce((total, p) => total + p.quantite, 0);
  cartCount.textContent = nombre;

  if (panier.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Votre panier est encore vide.<br>Découvrez nos jolies sélections ♡</p>';
    cartTotal.textContent = prixFCFA(0);
    return;
  }

  let total = 0;
  cartItems.innerHTML = panier.map(item => {
    const p = produits.find(produit => produit.id === item.id);
    if (!p) return "";
    total += p.prix * item.quantite;
    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.nom}">
        <div>
          <h4>${p.nom}</h4><small>${prixFCFA(p.prix)}</small>
          <div class="quantity-controls">
            <button data-minus="${p.id}" aria-label="Diminuer">−</button>
            <span>${item.quantite}</span>
            <button data-plus="${p.id}" aria-label="Augmenter">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${p.id}">Retirer</button>
      </div>`;
  }).join("");
  cartTotal.textContent = prixFCFA(total);
}

function ouvrirPanier() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
}
function fermerPanier() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
}

productsContainer.addEventListener("click", event => {
  const bouton = event.target.closest("[data-add]");
  if (bouton) ajouterAuPanier(Number(bouton.dataset.add));
});

document.querySelectorAll(".filter-btn").forEach(bouton => {
  bouton.addEventListener("click", () => {
    filtreActif = bouton.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === bouton));
    afficherProduits();
  });
});

document.querySelectorAll("[data-category-link]").forEach(lien => {
  lien.addEventListener("click", () => {
    filtreActif = lien.dataset.categoryLink;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.filter === filtreActif));
    afficherProduits();
  });
});

searchInput.addEventListener("input", afficherProduits);
document.getElementById("open-cart").addEventListener("click", ouvrirPanier);
document.getElementById("close-cart").addEventListener("click", fermerPanier);
overlay.addEventListener("click", fermerPanier);

cartItems.addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const moins = event.target.closest("[data-minus]");
  const retirer = event.target.closest("[data-remove]");
  if (plus) {
    const item = panier.find(p => p.id === Number(plus.dataset.plus));
    if (item) item.quantite++;
  }
  if (moins) {
    const item = panier.find(p => p.id === Number(moins.dataset.minus));
    if (item) item.quantite--;
    panier = panier.filter(p => p.quantite > 0);
  }
  if (retirer) panier = panier.filter(p => p.id !== Number(retirer.dataset.remove));
  sauvegarderPanier();
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (panier.length === 0) {
    alert("Votre panier est vide. Ajoutez d'abord un article.");
    return;
  }
  const lignes = panier.map(item => {
    const p = produits.find(produit => produit.id === item.id);
    return `- ${p.nom} x ${item.quantite} : ${prixFCFA(p.prix * item.quantite)}`;
  });
  const total = panier.reduce((somme, item) => {
    const p = produits.find(produit => produit.id === item.id);
    return somme + p.prix * item.quantite;
  }, 0);
  const message = `Bonjour ÉCLORIA ! Je souhaite commander :\n${lignes.join("\n")}\n\nTotal estimé : ${prixFCFA(total)}\n\nMerci de me confirmer la disponibilité et la livraison.`;
  // Remplacez le numéro ci-dessous par le numéro WhatsApp réel de la boutique, avec indicatif pays, sans + ni espaces.
  const numeroBoutique = "221770000000";
  window.open(`https://wa.me/${numeroBoutique}?text=${encodeURIComponent(message)}`, "_blank");
});

document.getElementById("contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const nom = document.getElementById("contact-name").value.trim();
  const telephone = document.getElementById("contact-phone").value.trim();
  const message = document.getElementById("contact-message").value.trim();
  const texte = `Bonjour ÉCLORIA ! Je m'appelle ${nom}. Mon numéro : ${telephone}.\n${message}`;
  const numeroBoutique = "221770000000"; // À remplacer par le vrai numéro WhatsApp.
  window.open(`https://wa.me/${numeroBoutique}?text=${encodeURIComponent(texte)}`, "_blank");
});

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("navigation").classList.toggle("show");
});
document.querySelectorAll(".navigation a").forEach(lien => {
  lien.addEventListener("click", () => document.getElementById("navigation").classList.remove("show"));
});
document.getElementById("year").textContent = new Date().getFullYear();

afficherProduits();
afficherPanier();
