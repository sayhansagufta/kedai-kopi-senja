document.addEventListener("alpine:init", () => {
  Alpine.data("product", () => ({
    items: [
      { id: 1, name: "Roti Bakar", img: "produk7.jpg", price: 15000 },
      { id: 2, name: "Indomie", img: "produk6.jpg", price: 15000 },
      { id: 3, name: "Gorengan", img: "produk2.jpg", price: 15000 },
      { id: 4, name: "Martabak", img: "produk5.jpeg", price: 5000 },
      { id: 5, name: "Donat", img: "produk4.jpg", price: 10000 },
      { id: 6, name: "Pisang Goreng", img: "produk3.jpg", price: 20000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah item sudah ada di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada item di cart
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
        console.log(this.total);
      } else {
        // jika sudah ada item di cart, cek apakah barang beda atau sama dengan yang di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sama, tambahkan quantity dan total
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
      // ambil item yang ingin di remove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // cari 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
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
        // jika item hanya 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

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
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6288223761814?text=" + encodeURIComponent(message));
});

// format pesan message
const formatMessage = (obj) => {
  return ` Data Customer:
    Nama: ${obj.name}
    Email: ${obj.email}
    No Hp: ${obj.phone}
Data Pesanan:
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
TOTAL: ${rupiah(obj.total)}

Terima Kasih.
  `;
};

// konversi rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
