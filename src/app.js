document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "KOPI SUSU", img: "1.jpg", price: 10000 },
      { id: 2, name: "ESPRESSO", img: "2.jpg", price: 20000 },
      { id: 3, name: "CAPPUCCINO", img: "3.jpg", price: 15000 },
      { id: 4, name: "KOPI SUSU AREN", img: "4.jpg", price: 15000 },
      { id: 5, name: "AMERICANO", img: "5.jpg", price: 20000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada/masi kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada, cek apakah barang beda atau sama dengan yang di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, maka tambah quantity dan total nya
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
      // ambil item yang mau di remove berdasarkan idnya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id != id) {
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
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.Disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.add("disabled");
});

// kirim data setelah tombol checkout di klik
document.addEventListener("DOMContentLoaded", function () {
  const checkoutButton = document.querySelector("#checkout-button");
  const form = document.querySelector("#checkoutForm");

  checkoutButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Membuat objek FormData dari form
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);

    // Format pesan untuk WhatsApp
    const message = formatMessage(objData);
    window.open(
      "https://wa.me/6282296764765?text=" + encodeURIComponent(message),
      "_blank"
    );
  });

  // Fungsi untuk memformat pesan
  const formatMessage = (obj) => {
    return `Data Customer:
    Nama : ${obj.name}
    Email : ${obj.email}
    No HP : ${obj.phone}
    Alamat : ${obj.address}
    
Data Pesanan:
    ${JSON.parse(obj.items)
      .map(
        (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`
      )
      .join("")}

Total Bayar: ${rupiah(obj.total)}`;
  };

  // Fungsi untuk memformat angka menjadi mata uang (rupiah)
  const rupiah = (angka) => {
    let reverse = angka.toString().split("").reverse().join("");
    let ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join(".").split("").reverse().join("");
    return "Rp " + ribuan;
  };
});

// konversi ke rupiah
function rupiah(amount) {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
  return formatted;
}
