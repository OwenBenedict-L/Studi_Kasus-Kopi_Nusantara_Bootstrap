$(document).ready(function(){
    let cart = [];

    /* Notification */
    function showNotif(message) {
        const $notification =$('<div class="notif-message"></div>').text(message);
        $('#notif-container').append($notification);

        setTimeout(() => $notification.addClass('show'), 10);
        setTimeout(() => {
            $notification.removeClass('show');
            setTimeout(() => $notification.remove(), 300); 
        }, 2500);
    }

    /* Shop Cart*/
    $('.menu-price').on('click', (e) => {
        const $price =$(e.currentTarget);
        const $card =$price.closest('.card-body');
        const name = $card.find('.card-title').text(); 
        
        const priceText = $price.text();
        const price = parseInt(priceText.replace(/[^\d]/g, ''));

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();
        showNotif(`${name} berhasil ditambahkan!`);
    });

    function updateCart() {
        const $cartContainer =$('.content-cart');
        const $totalPrice =$('#price');

        $cartContainer.empty();
        let total = 0;

        if (cart.length === 0) {
            $cartContainer.html('<p class="text-muted message-cart">Tidak ada barang yang dibeli...</p>');
            $cartContainer.addClass('justify-content-center align-items-center flex-column');
        } else {
            $cartContainer.removeClass('justify-content-center flex-column');
            $cartContainer.addClass('flex-column');
            $.each(cart, function(index, item) {
                const itemSubtotal = item.price * item.quantity;
                total += itemSubtotal;

                const itemHTML = `
                    <div class="cart-item w-100">
                        <div class="item-info">
                            <p class="mb-0 text-dark">${item.name}</p>
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

        if (!$btn.hasClass('confirm-mode')) {$btn.addClass('confirm-mode');
            $btn.text('Yakin beli sekarang?');$btn.removeClass('btn-dark').addClass('btn-danger');

            setTimeout(() => {
                $btn.removeClass('confirm-mode btn-danger').addClass('btn-dark');$btn.text('Beli');
            }, 3000);

            return;
        }

        showNotif('Terima kasih telah berbelanja di Kopi Nusantara!');
        cart = [];
        updateCart();

        const cartOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
        if(cartOffcanvas) {
            cartOffcanvas.hide();
        }

        $btn.removeClass('confirm-mode btn-danger').addClass('btn-dark');$btn.text('Beli');
    });

    /* Seacrh */
    $('#search-trigger').on('click', function(e) {
        e.preventDefault(); 
        const $searchBox = $('#search-box');
        
        $searchBox.toggleClass('active');
        
        if ($searchBox.hasClass('active')) {
            setTimeout(() => $searchBox.focus(), 400); 
        } else {
            $searchBox.val('').trigger('input'); 
        }
    });

    $('#search-box').on('input', function() {
        let kataKunci = $(this).val().toLowerCase();
        let jumlahCocok = 0;
            
        $('#menu .row > div').each(function() {
            let namaKopi = $(this).find('.card-title').text().toLowerCase();    
            if (namaKopi.includes(kataKunci)) {
                $(this).show();
                jumlahCocok++;
            } else {
                $(this).hide(); 
            }
        });

        if (jumlahCocok === 0) {
            $('#pesan-kosong').removeClass('d-none');
        } else {
            $('#pesan-kosong').addClass('d-none'); 
        }
    });

    /* Form kontak */
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (nama === '' || email === '' || keperluan === '') {
            alert('Data anda tidak lengkap, silahkan isi terlebih dahulu!');
            return;
        }

        if (!emailRegex.test(email)) {
            alert('Format email tidak valid! Harap masukkan format yang benar.');
            return;
        }

        const $alert =$('#custom-alert');
        $alert.addClass('active').fadeIn(300);
        setTimeout(function() {
            $alert.fadeOut(300, function() {$alert.removeClass('active');
            });
        }, 4000);

        $(this).trigger('reset');$('#char_count').text(`0/${maxChars}`);
    });

    /* Navbar active link */
    $('#navbarNav .nav-link').on('click', function () {
        $('#navbarNav .nav-link').removeClass('active');
        $(this).addClass('active');
    });
});

/* Tombol ke atas */
$(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
        $('#btn-back-to-top').stop(true, false).fadeTo(150, 1);
    } else {
        $('#btn-back-to-top').stop(true, false).fadeTo(150, 0, function() {
            $(this).hide();
        });
    }
});

$('#btn-back-to-top').on('click', function (e) {
    e.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});