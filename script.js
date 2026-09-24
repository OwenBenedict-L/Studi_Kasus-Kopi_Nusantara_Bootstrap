// Nav menu
$('.fas.fa-bars.fa-2x').on('click', () => {
    $('.left-menu-show').toggleClass('show');
});

// Shop cart
$(document).ready(function(){
    let cart = [];

    function showNotif(message) {
        const $notification =$('<div class="notif-message"></div>').text(message);
        $('#notif-container').append($notification);

        setTimeout(() => $notification.addClass('show'), 10);
        setTimeout(() => {
            $notification.removeClass('show');
            setTimeout(() => $notification.remove(), 300); 
        }, 2500);
    }

    $('#shopping-cart').on('click', (e) => {
        e.preventDefault();
        $('.shopping-cart-button').toggleClass('active');
        $('.search-button').removeClass('active');
    });

    $('.menu-price').on('click', (e) => {
        const $price = $(e.currentTarget);
        const $card = $price.closest('.menu-card');

        const name = $card.find('h3').text();
        const priceText = $price.text();
        const price = parseInt(priceText.replace(/[^\d]/g, ''));

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        }
        else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();
        $('#shopping-cart').addClass('active');
        showNotif(`${name} berhasil ditambahkan!`);
    });

    function updateCart() {
        const $cartContainer = $('.content-cart');
        const $totalPrice = $('#price');

        $cartContainer.empty();
        let total = 0;

        if (cart.length === 0) {
            $cartContainer.html('<p class="message-cart">Tidak ada barang yang dibeli...</p>');
        } else {
            $.each(cart, function(index, item) {
                const itemSubtotal = item.price * item.quantity;
                total += itemSubtotal;

                const itemHTML = `
                    <div class="cart-item">
                        <div class="item-info">
                            <p>${item.name}</p>
                            <span>Rp ${itemSubtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div class="qty-controls">
                            <button type="button" class="btn-qty btn-minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" class="btn-qty btn-plus" data-index="${index}">+</button>
                        </div>
                    </div>
                `;
                $cartContainer.append(itemHTML);
            });
        }

        $totalPrice.text(`Rp ${total.toLocaleString('id-ID')}`);
    }

    $('.content-cart').on('click', '.btn-plus', function() {
        const index = $(this).data('index');
        cart[index].quantity += 1;
        updateCart();
    });

    $('.content-cart').on('click', '.btn-minus', function() {
        const index = $(this).data('index');
        cart[index].quantity -= 1;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCart();
    });

    $('#submit-cart').on('click', function(e) {
        e.preventDefault();
        const $btn =$(this);

        if (cart.length === 0) {
            showNotif('Keranjang kamu kosong!');
            return;
        }

        if (!$btn.hasClass('confirm-mode')) {
            $btn.addClass('confirm-mode');
            $btn.text('Yakin beli sekarang?');

            setTimeout(() => {
                $btn.removeClass('confirm-mode');
                $btn.text('Beli');
            }, 3000);

            return;
        }

        showNotif('Terima kasih telah berbelanja di Kopi Nusantara!');
        cart = [];
        updateCart();
        $('.shopping-cart-button').removeClass('active');

        $btn.removeClass('confirm-mode');
        $btn.text('Beli');
    });
});

/* search button */
$('#searching').on('click', function(e) {
    e.preventDefault(); 
    $('.search-button').toggleClass('active');
    $('#search-box').focus();
});

$('#search-box').on('input', function() {
    let kataKunci = $(this).val().toLowerCase();
    let jumlahCocok = 0;
        
    $('.menu-card').each(function() {
        let namaKopi = $(this).find('h3').text().toLowerCase();    
        if (namaKopi.includes(kataKunci)) {
            $(this).show();
            jumlahCocok++;
        } else {
            $(this).hide(); 
        }
    });

    if (jumlahCocok === 0) {
        $('#pesan-kosong').show(); 
    } else {
        $('#pesan-kosong').hide(); 
    }
});

// SCRIPT KONTAK
$(document).ready(function() {
    const maxChars = 999;

    $('#keperluan').on('input', function() {
        const currentLength = $(this).val().length;
        $('#char_count').text(`${currentLength}/${maxChars}`);
    });

    $('#kontakform').on('submit', function(e) {
        e.preventDefault();

        const nama = $('#nama').val().trim();
        const email = $('#email').val().trim();
        const keperluan = $('#keperluan').val().trim();
        const $pesanError = $('#pesan-error');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (nama === '' || email === '' || keperluan === '') {
            $pesanError.text('Data anda tidak lengkap, silahkan isi berlebih dahulu!').show();
            return;
        }

        if (!emailRegex.test(email)) {
            $pesanError.text('Format email tidak valid! Harap masukkan format yang benar (contoh: nama@email.com).').show();
            return;
        }

        $pesanError.hide();

        const $alert =$('#custom-alert');
        $alert.addClass('active').fadeIn(300);
        setTimeout(function() {
            $alert.fadeOut(300, function() {$alert.removeClass('active');
            });
        }, 4000);

        $(this).trigger('reset');$('#char-count').text(`0/${maxChars}`);
    });
});

/* FAQ */
$('.faq-question').on('click', function () {
            $(this).next('.faq-answer').slideToggle();
            $(this).toggleClass('open');
            $('.faq-answer').not($(this).next()).slideUp();
            $('.faq-question').not($(this)).removeClass('open');
});