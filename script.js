// ==========================================
// 1. STATE & DATA KERANJANG BELANJA
// ==========================================
let keranjang = [];

// ==========================================
// 2. FITUR FILTER MENU BERDASARKAN KATEGORI
// ==========================================
function filterMenu(kategori) {
  const semuaCard = document.querySelectorAll('.menu-card');
  const tombolFilter = document.querySelectorAll('.filter-btn');

  // Mengatur tombol aktif (opsional styling)
  tombolFilter.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  semuaCard.forEach(card => {
    const kategoriCard = card.getAttribute('data-category');
    if (kategori === 'all' || kategoriCard === kategori) {
      card.style.display = 'flex'; // Tampilkan
    } else {
      card.style.display = 'none'; // Sembunyikan
    }
  });
}

// ==========================================
// 3. FUNGSI KERANJANG BELANJA (SHOPPING CART)
// ==========================================
function tambahKeKeranjang(namaMenu, harga) {
  // Cek apakah item sudah ada di keranjang
  let itemAda = keranjang.find(item => item.nama === namaMenu);
  
  if (itemAda) {
    itemAda.jumlah += 1;
  } else {
    keranjang.push({ nama: namaMenu, harga: harga, jumlah: 1 });
  }

  updateTampilanKeranjang();
  
  // Notifikasi kecil interaktif
  alert(`✨ Sukses! "${namaMenu}" telah ditambahkan ke keranjang.`);
}

function ubahJumlah(index, aksi) {
  if (aksi === 'tambah') {
    keranjang[index].jumlah += 1;
  } else if (aksi === 'kurang') {
    keranjang[index].jumlah -= 1;
    if (keranjang[index].jumlah <= 0) {
      keranjang.splice(index, 1); // Hapus jika jumlah 0
    }
  }
  updateTampilanKeranjang();
}

function hapusItem(index) {
  keranjang.splice(index, 1);
  updateTampilanKeranjang();
}

// ==========================================
// 4. UPDATE TAMPILAN DOM HTML KERANJANG
// ==========================================
function updateTampilanKeranjang() {
  const cartList = document.getElementById('cartList');
  const cartTotalSection = document.getElementById('cartTotalSection');
  const grandTotal = document.getElementById('grandTotal');
  const cartCount = document.getElementById('cartCount');

  // Hitung total item untuk badge di navbar
  let totalItemCount = keranjang.reduce((sum, item) => sum + item.jumlah, 0);
  
  if (totalItemCount > 0) {
    cartCount.style.display = 'inline-block';
    cartCount.innerText = totalItemCount;
  } else {
    cartCount.style.display = 'none';
  }

  // Jika keranjang kosong
  if (keranjang.length === 0) {
    cartList.innerHTML = `<p style="color: #888; text-align: center; padding: 20px 0;">Keranjang masih kosong. Yuk pilih kue favoritmu!</p>`;
    cartTotalSection.style.display = 'none';
    return;
  }

  // Jika ada isinya
  cartTotalSection.style.display = 'block';
  let html = '';
  let totalSemua = 0;

  keranjang.forEach((item, index) => {
    let subtotal = item.harga * item.jumlah;
    totalSemua += subtotal;
    
    html += `
      <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
        <div>
          <h4 style="margin: 0; font-size: 0.95rem;">${item.nama}</h4>
          <p style="margin: 2px 0 0 0; font-size: 0.85rem; color: #666;">Rp ${item.harga.toLocaleString('id-ID')} x ${item.jumlah} = <strong>Rp ${subtotal.toLocaleString('id-ID')}</strong></p>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button type="button" onclick="ubahJumlah(${index}, 'kurang')" style="padding: 2px 8px; cursor: pointer;">-</button>
          <span>${item.jumlah}</span>
          <button type="button" onclick="ubahJumlah(${index}, 'tambah')" style="padding: 2px 8px; cursor: pointer;">+</button>
          <button type="button" onclick="hapusItem(${index})" style="background: #ff4d4d; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer;">Hapus</button>
        </div>
      </div>
    `;
  });

  cartList.innerHTML = html;
  grandTotal.innerText = 'Rp ' + totalSemua.toLocaleString('id-ID');
}

// ==========================================
// 5. KIRIM PESAN KE WHATSAPP TOKO
// ==========================================
function kirimWhatsApp(e) {
  e.preventDefault();

  if (keranjang.length === 0) {
    alert("Keranjang belanjaan kamu masih kosong! Silakan pilih minimal 1 menu kue.");
    return;
  }

  const nama = document.getElementById('nama').value;
  const metode = document.getElementById('metode').value;
  const catatan = document.getElementById('catatan').value;
  
  // Ganti nomor di bawah dengan nomor WhatsApp admin bakery kamu (Awali dengan 62 tanpa tanda + atau 0 di depan)
  const nomorWa = "6281234567890"; 

  let daftarPesananStr = "";
  let totalSemua = 0;

  keranjang.forEach((item, i) => {
    let subtotal = item.harga * item.jumlah;
    totalSemua += subtotal;
    daftarPesananStr += `%0A${i + 1}. ${item.nama} (${item.jumlah}x) - Rp ${subtotal.toLocaleString('id-ID')}`;
  });

  const pesan = `Halo Choco Cloud Bakery, saya ingin memesan:%0A` +
                `---------------------------------------` +
                `${daftarPesananStr}%0A` +
                `---------------------------------------` +
                `%0A*Total Pembayaran: Rp ${totalSemua.toLocaleString('id-ID')}*` +
                `%0A%0A- Nama Pemesan: ${nama}` +
                `%0A- Metode: ${metode}` +
                `%0A- Catatan: ${catatan ? catatan : '-'}`;

  window.open(`https://wa.me/${nomorWa}?text=${pesan}`, '_blank');
}