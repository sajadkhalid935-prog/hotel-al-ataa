document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. LOADING SCREEN
    // ==========================================
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1200);
        });
        // Fallback: hide after 3s even if some resources fail
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 3000);
    }

    // ==========================================
    // 1. MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            const icon = menuToggle ? menuToggle.querySelector('i') : null;
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });

    // ==========================================
    // 2. SMOOTH SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 3. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 4. DARK MODE TOGGLE
    // ==========================================
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const savedDarkMode = localStorage.getItem('ataa-dark-mode');

    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('ataa-dark-mode', isDark);
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                if (isDark) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }

    // ==========================================
    // 5. PARALLAX EFFECT ON HERO
    // ==========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.setProperty('--parallax-offset', `${scrolled * 0.4}px`);
            }
        });
    }

    // ==========================================
    // 6. SCROLL-TRIGGERED ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if it's a statistics item
                if (entry.target.classList.contains('stat-item')) {
                    const numEl = entry.target.querySelector('.stat-number');
                    if (numEl) {
                        const target = parseInt(numEl.getAttribute('data-count')) || 0;
                        animateCounter(numEl, target);
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // 7. FACILITY GALLERY SLIDER
    // ==========================================
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderPrev = document.getElementById('sliderPrev');
    const sliderNext = document.getElementById('sliderNext');
    const sliderDots = document.getElementById('sliderDots');

    if (sliderTrack) {
        const slides = sliderTrack.querySelectorAll('.slide');
        let currentSlide = 0;
        let autoSlideInterval;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            sliderDots.appendChild(dot);
        });

        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentSlide = index;

            sliderTrack.style.transform = `translateX(${-currentSlide * 100}%)`;

            // Update dots
            sliderDots.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        if (sliderPrev) sliderPrev.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
        if (sliderNext) sliderNext.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

        // Auto-slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                resetAutoSlide();
            }
        }, { passive: true });
    }

    // ==========================================
    // 8. SELECT ROOM BUTTON LOGIC
    // ==========================================
    document.querySelectorAll('.select-room-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const price = e.target.getAttribute('data-price');
            const roomSelect = document.getElementById('room-type');

            if (roomSelect) {
                roomSelect.value = price;

                // Set default dates if empty
                const checkin = document.getElementById('checkin');
                const checkout = document.getElementById('checkout');

                if (!checkin.value) {
                    const today = new Date();
                    const tYYYY = today.getFullYear();
                    const tMM = String(today.getMonth() + 1).padStart(2, '0');
                    const tDD = String(today.getDate()).padStart(2, '0');
                    checkin.value = `${tYYYY}-${tMM}-${tDD}`;

                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const tmYYYY = tomorrow.getFullYear();
                    const tmMM = String(tomorrow.getMonth() + 1).padStart(2, '0');
                    const tmDD = String(tomorrow.getDate()).padStart(2, '0');
                    checkout.value = `${tmYYYY}-${tmMM}-${tmDD}`;
                }

                // Dispatch change events to update placeholders
                checkin.dispatchEvent(new Event('change'));
                checkout.dispatchEvent(new Event('change'));

                updateBookingSummary();

                // Scroll to booking
                const bookingSec = document.getElementById('booking');
                window.scrollTo({
                    top: bookingSec.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 9. BOOKING CALCULATION LOGIC
    // ==========================================
    const bookingForm = document.getElementById('main-booking-form');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const roomTypeSelect = document.getElementById('room-type');

    // Manage date inputs: prevent manual typing, open picker on click, and toggle has-value class
    document.querySelectorAll('input[type="date"]').forEach(input => {
        const updateState = () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        };
        
        updateState();
        input.addEventListener('change', updateState);
        input.addEventListener('input', updateState);

        // Prevent keyboard typing (allow navigation/action keys only)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Escape' || e.key === 'Shift') {
                return;
            }
            e.preventDefault();
        });

        // Open calendar picker when clicking anywhere on the input field
        input.addEventListener('click', () => {
            try {
                if (typeof input.showPicker === 'function') {
                    input.showPicker();
                }
            } catch (err) {
                console.log("showPicker failed or not supported: ", err);
            }
        });
    });

    // Set min dates
    const today = new Date().toISOString().split('T')[0];
    if (checkinInput) checkinInput.min = today;

    if (checkinInput && checkoutInput) {
        checkinInput.addEventListener('change', () => {
            checkoutInput.min = checkinInput.value;
            if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
                const nextDay = new Date(checkinInput.value + 'T00:00:00');
                nextDay.setDate(nextDay.getDate() + 1);
                const yyyy = nextDay.getFullYear();
                const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
                const dd = String(nextDay.getDate()).padStart(2, '0');
                checkoutInput.value = `${yyyy}-${mm}-${dd}`;
            }
            updateBookingSummary();
        });

        checkoutInput.addEventListener('change', updateBookingSummary);
    }

    if (roomTypeSelect) {
        roomTypeSelect.addEventListener('change', updateBookingSummary);
    }

    function updateBookingSummary() {
        if (!checkinInput || !checkoutInput || !roomTypeSelect) return;

        const checkinDate = checkinInput.value ? new Date(checkinInput.value + 'T00:00:00') : null;
        const checkoutDate = checkoutInput.value ? new Date(checkoutInput.value + 'T00:00:00') : null;
        const pricePerNight = parseInt(roomTypeSelect.value) || 0;

        const nightsSpan = document.getElementById('summary-nights');
        const priceSpan = document.getElementById('summary-price');
        const totalSpan = document.getElementById('summary-total');

        const currentNightUnit = typeof translations !== 'undefined' ? translations[currentLang]['night_unit'] : ' ليلة';
        const currentIqd = typeof translations !== 'undefined' ? translations[currentLang]['iqd'] : ' د.ع';

        if (checkinInput.value && checkoutInput.value && checkinDate && checkoutDate && checkinDate < checkoutDate) {
            const diffTime = Math.abs(checkoutDate - checkinDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (nightsSpan) nightsSpan.textContent = diffDays + currentNightUnit;

            if (pricePerNight > 0) {
                const formattedPrice = new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : currentLang === 'en' ? 'en-US' : 'ar-IQ').format(pricePerNight);
                if (priceSpan) priceSpan.textContent = formattedPrice + currentIqd;

                const total = diffDays * pricePerNight;
                const formattedTotal = new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : currentLang === 'en' ? 'en-US' : 'ar-IQ').format(total);
                if (totalSpan) totalSpan.textContent = formattedTotal + currentIqd;
            }
        } else {
            if (nightsSpan) nightsSpan.textContent = '0' + currentNightUnit;
            if (priceSpan) priceSpan.textContent = '0' + currentIqd;
            if (totalSpan) totalSpan.textContent = '0' + currentIqd;
        }
    }

    // Helper to normalize phone numbers (convert Arabic/Persian digits and format correctly)
    function normalizePhoneNumber(countryCode, phoneNumber) {
        if (!phoneNumber) return '';
        
        // 1. Convert Arabic and Persian digits to English digits
        const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        
        let cleanPhone = String(phoneNumber);
        for (let i = 0; i < 10; i++) {
            cleanPhone = cleanPhone.replace(new RegExp(arabicDigits[i], 'g'), i)
                                   .replace(new RegExp(persianDigits[i], 'g'), i);
        }
        
        // 2. Remove all non-numeric characters
        cleanPhone = cleanPhone.replace(/[^0-9]/g, '');
        
        // 3. Clean country code
        let cleanCode = String(countryCode).replace(/[^0-9]/g, '');
        
        // 4. Strip leading zeroes from the phone number
        while (cleanPhone.startsWith('0')) {
            cleanPhone = cleanPhone.substring(1);
        }
        
        // 5. If the phone starts with country code (e.g. 964...), strip it
        if (cleanPhone.startsWith(cleanCode)) {
            cleanPhone = cleanPhone.substring(cleanCode.length);
        }
        
        // 6. Strip leading zeroes again (e.g. if they wrote +964 0780...)
        while (cleanPhone.startsWith('0')) {
            cleanPhone = cleanPhone.substring(1);
        }
        
        // 7. Combine them
        return '+' + cleanCode + cleanPhone;
    }

    // ==========================================
    // 10. BOOKING FORM SUBMISSION
    // ==========================================
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const checkin = checkinInput.value;
            const checkout = checkoutInput.value;
            const roomPrice = parseInt(roomTypeSelect.value);
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const countryCode = document.getElementById('country-code').value;
            const guests = document.getElementById('guests').value;
            const payment = document.querySelector('input[name="payment"]:checked');

            if (!checkin || !checkout || !roomPrice || !name || !phone) {
                const errorMsg = typeof translations !== 'undefined' ? translations[currentLang]['error_msg'] : 'يرجى التأكد من اختيار تواريخ صحيحة ونوع الغرفة.';
                showNotification(errorMsg, 'error');
                return;
            }

            const checkinDate = new Date(checkin + 'T00:00:00');
            const checkoutDate = new Date(checkout + 'T00:00:00');

            if (checkinDate >= checkoutDate) {
                const errorMsg = typeof translations !== 'undefined' ? translations[currentLang]['error_msg'] : 'يرجى التأكد من اختيار تواريخ صحيحة.';
                showNotification(errorMsg, 'error');
                return;
            }

            const diffDays = Math.ceil(Math.abs(checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
            const total = diffDays * roomPrice;
            const roomName = roomTypeSelect.options[roomTypeSelect.selectedIndex].text;

            // Normalize phone number
            const normalizedPhone = normalizePhoneNumber(countryCode, phone);

            // Show invoice modal
            showInvoice({
                name,
                phone: normalizedPhone,
                guests,
                payment: payment ? payment.parentElement.querySelector('span').textContent : 'نقداً',
                room: roomName,
                checkin,
                checkout,
                nights: diffDays,
                pricePerNight: roomPrice,
                total
            });

            // Save reservation to localStorage
            saveReservation({
                id: 'ATH-' + Date.now().toString().slice(-6),
                name,
                phone: normalizedPhone,
                guests,
                payment: payment ? payment.parentElement.querySelector('span').textContent : 'نقداً',
                room: roomName,
                checkin,
                checkout,
                nights: diffDays,
                pricePerNight: roomPrice,
                total,
                date: new Date().toISOString(),
                status: 'pending'
            });
        });
    }

    // ==========================================
    // 11. INVOICE MODAL
    // ==========================================
    function showInvoice(data) {
        const modal = document.getElementById('invoiceModal');
        if (!modal) return;

        // Generate invoice number
        const invNum = 'ATH-' + Date.now().toString().slice(-6);
        const invDate = new Date().toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ar-IQ');

        const locale = currentLang === 'fa' ? 'fa-IR' : currentLang === 'en' ? 'en-US' : 'ar-IQ';
        const iqd = typeof translations !== 'undefined' ? translations[currentLang]['iqd'] : ' د.ع';

        document.getElementById('inv-num').textContent = invNum;
        document.getElementById('inv-date').textContent = invDate;
        document.getElementById('inv-name').textContent = data.name;
        document.getElementById('inv-phone').textContent = data.phone;
        document.getElementById('inv-guests').textContent = data.guests;
        document.getElementById('inv-payment').textContent = data.payment;
        document.getElementById('inv-room').textContent = data.room;
        document.getElementById('inv-checkin').textContent = data.checkin;
        document.getElementById('inv-checkout').textContent = data.checkout;
        document.getElementById('inv-nights').textContent = data.nights;
        document.getElementById('inv-table-room').textContent = data.room;
        document.getElementById('inv-table-nights').textContent = data.nights;
        document.getElementById('inv-table-price').textContent = new Intl.NumberFormat(locale).format(data.pricePerNight) + iqd;
        document.getElementById('inv-table-total').textContent = new Intl.NumberFormat(locale).format(data.total) + iqd;
        document.getElementById('inv-grand-total').textContent = new Intl.NumberFormat(locale).format(data.total) + iqd;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.closeInvoice = function () {
        const modal = document.getElementById('invoiceModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.printInvoice = function () {
        window.print();
    };

    window.shareWhatsApp = function () {
        const name = document.getElementById('inv-name').textContent;
        const room = document.getElementById('inv-room').textContent;
        const checkin = document.getElementById('inv-checkin').textContent;
        const checkout = document.getElementById('inv-checkout').textContent;
        const total = document.getElementById('inv-grand-total').textContent;

        const msg = `*حجز فندق مدينة العطاء السياحي*\n\nالاسم: ${name}\nالغرفة: ${room}\nالوصول: ${checkin}\nالمغادرة: ${checkout}\nالإجمالي: ${total}\n\nيرجى تأكيد الحجز. شكراً لكم.`;
        const url = `https://wa.me/9647869347466?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    window.shareInvoice = function () {
        const name = document.getElementById('inv-name').textContent;
        const room = document.getElementById('inv-room').textContent;
        const total = document.getElementById('inv-grand-total').textContent;

        if (navigator.share) {
            navigator.share({
                title: 'حجز فندق مدينة العطاء',
                text: `حجز باسم ${name} - ${room} - المبلغ: ${total}`
            });
        } else {
            const text = `حجز باسم ${name} - ${room} - المبلغ: ${total}`;
            navigator.clipboard.writeText(text).then(() => {
                showNotification('تم نسخ بيانات الحجز', 'success');
            });
        }
    };

    // ==========================================
    // 12. NOTIFICATION SYSTEM
    // ==========================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification-toast').forEach(n => n.remove());

        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after 4s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ==========================================
    // 13. IMAGE LAZY LOADING
    // ==========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imgObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        lazyImages.forEach(img => imgObserver.observe(img));
    }

    // ==========================================
    // 14. BUTTON MICRO-INTERACTIONS
    // ==========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousedown', function () {
            this.style.transform = 'scale(0.97)';
        });
        btn.addEventListener('mouseup', function () {
            this.style.transform = '';
        });
        btn.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ==========================================
    // 15. COUNTER ANIMATION FOR STATS
    // ==========================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString();
            }
        }, 16);
    }

    // ==========================================
    // 16. SMOOTH REVEAL ON SCROLL
    // ==========================================
    const revealElements = document.querySelectorAll('.room-card, .amenity-card, .section-header');
    revealElements.forEach((el, index) => {
        if (!el.classList.contains('fade-in-up')) {
            el.classList.add('fade-in-up');
            el.style.transitionDelay = `${index * 0.1}s`;
        }
        observer.observe(el);
    });

    // ==========================================
    // 17. MY RESERVATIONS MANAGEMENT
    // ==========================================

    function getReservations() {
        try {
            return JSON.parse(localStorage.getItem('ataa-reservations')) || [];
        } catch (e) {
            return [];
        }
    }

    async function saveReservation(data) {
        const reservations = getReservations();
        reservations.unshift(data);
        localStorage.setItem('ataa-reservations', JSON.stringify(reservations));
        renderReservations();

        // Save to Google Sheets if configured
        if (window.googleSheetsClient && window.googleSheetsClient.isEnabled()) {
            try {
                await window.googleSheetsClient.saveReservation(data);
                console.log("Saved successfully to Google Sheets! 🚀");
            } catch (err) {
                console.error("Failed to save to Google Sheets:", err);
                showNotification("تنبيه: تم الحفظ محلياً على جهازك، وتعذر الحفظ السحابي المؤقت.", "error");
            }
        }

        const successMsg = typeof translations !== 'undefined' ? translations[currentLang]['success_msg'] : 'تم استلام طلب الحجز بنجاح.';
        showNotification(successMsg, 'success');
    }

    async function deleteReservation(id) {
        let reservations = getReservations();
        reservations = reservations.filter(r => r.id !== id);
        localStorage.setItem('ataa-reservations', JSON.stringify(reservations));
        renderReservations();

        // Delete from Google Sheets if configured
        if (window.googleSheetsClient && window.googleSheetsClient.isEnabled()) {
            try {
                await window.googleSheetsClient.deleteReservation(id);
                console.log(`Deleted reservation ${id} from Google Sheets!`);
            } catch (err) {
                console.error("Failed to delete from Google Sheets:", err);
            }
        }
    }

    async function clearAllReservations() {
        localStorage.removeItem('ataa-reservations');
        renderReservations();

        // Delete all from Google Sheets if configured
        if (window.googleSheetsClient && window.googleSheetsClient.isEnabled()) {
            try {
                await window.googleSheetsClient.clearAllReservations();
                console.log("Cleared all reservations from Google Sheets!");
            } catch (err) {
                console.error("Failed to clear all from Google Sheets:", err);
            }
        }
    }

    function getReservationStatus(r) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const checkoutDate = new Date(r.checkout + 'T00:00:00');

        if (now >= checkoutDate) return 'past';
        if (r.status === 'rejected') return 'rejected';
        if (r.status === 'accepted') return 'accepted';
        return 'pending';
    }

    function getStatusLabel(status) {
        const t = typeof translations !== 'undefined' ? translations[currentLang] : null;
        if (status === 'pending') return t ? t['status_pending'] : 'قيد المراجعة';
        if (status === 'confirmed') return t ? t['status_confirmed'] : 'إقامة حالية';
        if (status === 'accepted') return t ? t['status_accepted'] : 'تم القبول';
        if (status === 'rejected') return t ? t['status_rejected'] : 'مرفوض';
        if (status === 'past') return t ? t['status_past'] : 'مكتملة';
        return status;
    }

    function getStatusIcon(status) {
        if (status === 'pending') return 'fa-clock';
        if (status === 'confirmed') return 'fa-circle-check';
        if (status === 'accepted') return 'fa-circle-check';
        if (status === 'rejected') return 'fa-circle-xmark';
        if (status === 'past') return 'fa-circle-check';
        return 'fa-circle-info';
    }

    function renderReservations() {
        const list = document.getElementById('reservations-list');
        const empty = document.getElementById('reservations-empty');
        const actions = document.getElementById('reservations-actions');
        if (!list || !empty) return;

        const reservations = getReservations();

        if (reservations.length === 0) {
            empty.style.display = '';
            list.innerHTML = '';
            if (actions) actions.style.display = 'none';
            return;
        }

        empty.style.display = 'none';
        if (actions) actions.style.display = '';

        const t = (typeof translations !== 'undefined' && typeof currentLang !== 'undefined') ? translations[currentLang] : (typeof translations !== 'undefined' ? translations['ar'] : null);
        const iqd = t ? t['iqd'] : ' د.ع';
        const locale = currentLang === 'fa' ? 'fa-IR' : currentLang === 'en' ? 'en-US' : 'ar-IQ';
        const nightUnit = t ? t['night_unit'] : ' ليلة';

        const labelCheckin = t ? t['form_checkin'] : 'تاريخ الوصول';
        const labelCheckout = t ? t['form_checkout'] : 'تاريخ المغادرة';
        const labelNights = t ? t['summary_nights'] : 'عدد الليالي';
        const labelGuests = t ? t['form_guests'] : 'عدد الأفراد';
        const labelName = t ? t['form_name'] : 'الاسم';
        const labelPhone = t ? t['form_phone'] : 'رقم الهاتف';
        const labelTotal = t ? t['summary_total'] : 'الإجمالي';

        list.innerHTML = reservations.map((r, index) => {
            const status = getReservationStatus(r);
            const statusLabel = getStatusLabel(status);
            const statusIcon = getStatusIcon(status);
            const formattedTotal = new Intl.NumberFormat(locale).format(r.total);
            const formattedPrice = new Intl.NumberFormat(locale).format(r.pricePerNight);

            return `
                <div class="reservation-card" style="animation-delay: ${index * 0.1}s">
                    <div class="res-card-header">
                        <div class="res-card-header-info">
                            <span class="res-card-number">${r.id}</span>
                            <span class="res-card-room">${r.room}</span>
                        </div>
                        <span class="res-status-badge status-${status}">
                            <i class="fa-solid ${statusIcon}"></i>
                            ${statusLabel}
                        </span>
                    </div>
                    <div class="res-card-body">
                        <div class="res-details-grid">
                            <div class="res-detail-item">
                                <span class="res-detail-label"><i class="fa-solid fa-right-to-bracket"></i> ${labelCheckin.trim()}</span>
                                <span class="res-detail-value">${r.checkin}</span>
                            </div>
                            <div class="res-detail-item">
                                <span class="res-detail-label"><i class="fa-solid fa-right-from-bracket"></i> ${labelCheckout.trim()}</span>
                                <span class="res-detail-value">${r.checkout}</span>
                            </div>
                            <div class="res-detail-item">
                                <span class="res-detail-label"><i class="fa-solid fa-moon"></i> ${labelNights.trim()}</span>
                                <span class="res-detail-value">${r.nights}${nightUnit}</span>
                            </div>
                            <div class="res-detail-item">
                                <span class="res-detail-label"><i class="fa-solid fa-users"></i> ${labelGuests.trim()}</span>
                                <span class="res-detail-value">${r.guests}</span>
                            </div>
                            <div class="res-detail-item">
                                <span class="res-detail-label"><i class="fa-solid fa-user"></i> ${labelName.trim()}</span>
                                <span class="res-detail-value">${r.name}</span>
                            </div>
                            <div class="res-detail-item">
                                <span class="res-detail-label"><i class="fa-solid fa-phone"></i> ${labelPhone.trim()}</span>
                                <span class="res-detail-value" dir="ltr">${r.phone}</span>
                            </div>
                        </div>
                    </div>
                    <div class="res-card-footer">
                        <div class="res-total-price">
                            <span class="res-total-label">${labelTotal.trim()}</span>
                            <span class="res-total-amount">${formattedTotal}${iqd}</span>
                        </div>
                        <div class="res-card-actions">
                            <button class="res-action-btn btn-whatsapp" onclick="shareReservationWhatsApp('${r.id}')" title="WhatsApp">
                                <i class="fa-brands fa-whatsapp"></i>
                            </button>
                            <button class="res-action-btn btn-delete" onclick="confirmDeleteReservation('${r.id}')" title="حذف">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Confirm delete modal
    let pendingDeleteId = null;
    let pendingDeleteAll = false;

    window.confirmDeleteReservation = function(id) {
        pendingDeleteId = id;
        pendingDeleteAll = false;
        showConfirmModal();
    };

    function showConfirmModal() {
        // Create modal if not exists
        let modal = document.getElementById('confirm-delete-modal');
        if (!modal) {
            const t = typeof translations !== 'undefined' ? translations[currentLang] : null;
            const title = t ? t['confirm_delete_title'] : 'تأكيد الحذف';
            const desc = t ? t['confirm_delete_desc'] : 'هل أنت متأكد من حذف هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.';
            const btnDelete = t ? t['btn_delete'] : 'حذف';
            const btnCancel = t ? t['btn_cancel'] : 'إلغاء';

            modal = document.createElement('div');
            modal.id = 'confirm-delete-modal';
            modal.className = 'confirm-modal-overlay';
            modal.innerHTML = `
                <div class="confirm-modal-box">
                    <div class="confirm-icon">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <div class="confirm-modal-actions">
                        <button class="btn-confirm-delete" onclick="executeDelete()">${btnDelete}</button>
                        <button class="btn-confirm-cancel" onclick="closeConfirmModal()">${btnCancel}</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.closeConfirmModal = function() {
        const modal = document.getElementById('confirm-delete-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        pendingDeleteId = null;
        pendingDeleteAll = false;
    };

    window.executeDelete = function() {
        if (pendingDeleteAll) {
            clearAllReservations();
            const t = typeof translations !== 'undefined' ? translations[currentLang] : null;
            showNotification(t ? t['all_deleted_msg'] : 'تم حذف جميع الحجوزات.', 'success');
        } else if (pendingDeleteId) {
            deleteReservation(pendingDeleteId);
            const t = typeof translations !== 'undefined' ? translations[currentLang] : null;
            showNotification(t ? t['deleted_msg'] : 'تم حذف الحجز بنجاح.', 'success');
        }
        closeConfirmModal();
    };

    window.shareReservationWhatsApp = function(id) {
        const reservations = getReservations();
        const r = reservations.find(res => res.id === id);
        if (!r) return;

        const locale = currentLang === 'fa' ? 'fa-IR' : currentLang === 'en' ? 'en-US' : 'ar-IQ';
        const t = typeof translations !== 'undefined' ? translations[currentLang] : null;
        const iqd = t ? t['iqd'] : ' د.ع';
        const formattedTotal = new Intl.NumberFormat(locale).format(r.total);

        const msg = `*حجز فندق مدينة العطاء السياحي*\n\nرقم الحجز: ${r.id}\nالاسم: ${r.name}\nالغرفة: ${r.room}\nالوصول: ${r.checkin}\nالمغادرة: ${r.checkout}\nعدد الليالي: ${r.nights}\nالإجمالي: ${formattedTotal}${iqd}\n\nيرجى تأكيد الحجز. شكراً لكم.`;
        const url = `https://wa.me/9647869347466?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    // Clear all button handler
    const clearAllBtn = document.getElementById('clear-all-reservations');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            pendingDeleteAll = true;
            pendingDeleteId = null;
            showConfirmModal();
        });
    }

    // ==========================================
    // 18. VIDEO TOUR PLAYER
    // ==========================================
    const hotelVideo = document.getElementById('hotelVideo');
    const videoWrapper = document.getElementById('videoWrapper');
    const videoPlayOverlay = document.getElementById('videoPlayOverlay');
    const videoPlayBtn = document.getElementById('videoPlayBtn');

    if (hotelVideo && videoWrapper && videoPlayOverlay) {
        function toggleVideo() {
            if (hotelVideo.paused || hotelVideo.ended) {
                hotelVideo.play();
                videoWrapper.classList.add('playing');
                videoPlayOverlay.classList.add('hidden');
                // Change icon to pause
                const icon = videoPlayBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                }
            } else {
                hotelVideo.pause();
                videoWrapper.classList.remove('playing');
                videoPlayOverlay.classList.remove('hidden');
                // Change icon back to play
                const icon = videoPlayBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            }
        }

        // Click on play button
        videoPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleVideo();
        });

        // Click on overlay text
        videoPlayOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleVideo();
        });

        // Click on video wrapper (when playing, to pause)
        videoWrapper.addEventListener('click', () => {
            if (!hotelVideo.paused) {
                toggleVideo();
            }
        });

        // When video ends, show overlay again
        hotelVideo.addEventListener('ended', () => {
            videoWrapper.classList.remove('playing');
            videoPlayOverlay.classList.remove('hidden');
            const icon = videoPlayBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    // ==========================================
    // 19. FAQ ACCORDION TOGGLE
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            if (item) {
                const isActive = item.classList.contains('active');
                
                // Close other items
                document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            }
        });
    });

    // Initial render
    renderReservations();

    // Make renderReservations accessible for language switch
    window.renderReservations = renderReservations;

    // Sync room prices from Google Sheets on load if configured
    if (window.googleSheetsClient && window.googleSheetsClient.isEnabled()) {
        window.googleSheetsClient.getSettings()
            .then((data) => {
                const priceSetting = data.find(s => s.key === 'room_prices');
                if (priceSetting && priceSetting.value) {
                    // Only overwrite if admin hasn't saved recently (check timestamp)
                    const lastSaveTime = parseInt(localStorage.getItem('ataa-room-prices-timestamp') || '0');
                    if ((Date.now() - lastSaveTime) < 60000) {
                        console.log("Skipping cloud price sync on index - admin saved prices recently.");
                    } else {
                        localStorage.setItem('ataa-room-prices', JSON.stringify(priceSetting.value));
                        if (typeof applyRoomPrices === 'function') {
                            applyRoomPrices();
                            if (typeof updateBookingSummary === 'function') {
                                updateBookingSummary();
                            }
                        }
                    }
                }
            })
            .catch(err => console.log("Google Sheets pricing sync ignored:", err));
    }

    // Real-time synchronization when database changes in another tab
    window.addEventListener('storage', (e) => {
        if (e.key === 'ataa-reservations') {
            renderReservations();
        }
        if (e.key === 'ataa-room-prices') {
            if (typeof applyRoomPrices === 'function') {
                applyRoomPrices();
                // Dynamically update the booking summary calculator if dates/rooms are already selected
                if (typeof updateBookingSummary === 'function') {
                    updateBookingSummary();
                }
                // Refresh language-dependent option text & elements
                if (typeof switchLanguage === 'function' && typeof currentLang !== 'undefined') {
                    switchLanguage(currentLang);
                }
            }
        }
    });

});

