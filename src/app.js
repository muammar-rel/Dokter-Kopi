document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "KOPI SUSU", img: "1.jpg", price: 10000 },
      { id: 2, name: "ESPRESSO", img: "2.jpg", price: 20000 },
      { id: 3, name: "CAPPUCCINO", img: "3.jpg", price: 15000 },
      { id: 4, name: "KOPI SUSU AREN", img: "4.jpg", price: 15000 },
      { id: 5, name: "AMERICANO", img: "5.jpg", price: 20000 },
      { id: 5, name: "teh susu", img: "5.jpg", price: 5000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);
      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const checkoutButton = document.querySelector("#checkout-button");
  const form = document.querySelector("#checkoutForm");

  checkoutButton.addEventListener("click", async function (e) {
    e.preventDefault();

    // Membuat objek FormData dari form
    const formData = new FormData(form);

    // Tambahkan data keranjang dari Alpine.js store
    const cart = Alpine.store("cart");
    formData.append("total", cart.total); // Total transaksi
    formData.append("items", JSON.stringify(cart.items)); // Detail item dalam format JSON

    try {
      const response = await fetch(
        "http://localhost/Dokter-Kopi/php/placeOrder.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.token) {
        // Gunakan token dari response untuk Snap payment
        window.snap.pay(result.token);
      } else if (result.error) {
        console.error(result.error); // Tampilkan pesan error di console
        alert("Gagal mendapatkan token transaksi: " + result.error);
      }
    } catch (error) {
      console.log("Pastikan Folmulirnya Valid: " + error.message);
    }
  });
});

// Konversi ke format Rupiah
function rupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}
