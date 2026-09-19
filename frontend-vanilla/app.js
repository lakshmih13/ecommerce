const API_URL = "http://localhost:5000/api/products";

const grid = document.getElementById("product-grid");
const statusEl = document.getElementById("status");
const form = document.getElementById("product-form");
const idField = document.getElementById("product-id");
const nameField = document.getElementById("name");
const categoryField = document.getElementById("category");
const priceField = document.getElementById("price");
const stockField = document.getElementById("stock");
const descField = document.getElementById("description");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");

async function loadProducts() {
  statusEl.textContent = "";
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load products");
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}. Is the backend running on port 5000?`;
  }
}

function renderProducts(products) {
  grid.innerHTML = "";
  if (products.length === 0) {
    grid.innerHTML = "<p>No products yet.</p>";
    return;
  }
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${escapeHtml(p.name)}</h3>
      <div class="price">$${Number(p.price).toFixed(2)}</div>
      <div class="meta">${escapeHtml(p.category || "Uncategorized")} · Stock: ${p.stock}</div>
      <p>${escapeHtml(p.description || "")}</p>
      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    card.querySelector(".edit-btn").addEventListener("click", () => startEdit(p));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(p.id));
    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function startEdit(product) {
  idField.value = product.id;
  nameField.value = product.name;
  categoryField.value = product.category || "";
  priceField.value = product.price;
  stockField.value = product.stock;
  descField.value = product.description || "";
  formTitle.textContent = "Edit Product";
  submitBtn.textContent = "Update Product";
  cancelBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  form.reset();
  idField.value = "";
  formTitle.textContent = "Add Product";
  submitBtn.textContent = "Add Product";
  cancelBtn.classList.add("hidden");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: nameField.value.trim(),
    category: categoryField.value.trim(),
    price: parseFloat(priceField.value),
    stock: parseInt(stockField.value || "0", 10),
    description: descField.value.trim(),
  };

  const id = idField.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Request failed");
    }
    resetForm();
    loadProducts();
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
  }
});

cancelBtn.addEventListener("click", resetForm);

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
    loadProducts();
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
  }
}

loadProducts();
