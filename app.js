document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navWrapper = document.querySelector('.nav-wrapper');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && navWrapper && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle active classes
            mobileMenuBtn.classList.toggle('active');
            navWrapper.classList.toggle('active');
            mainNav.classList.toggle('active');

            // Calculate the full height of the menu for smooth transition
            if (navWrapper.classList.contains('active')) {
                const menuHeight = mainNav.scrollHeight + 'px';
                navWrapper.style.maxHeight = menuHeight;
            } else {
                navWrapper.style.maxHeight = '0px';
            }
        });

        // Close menu when a nav link is clicked (improves UX on mobile)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add active class to current page link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Close the mobile menu with a slight delay for smooth transition
                if (mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    navWrapper.classList.remove('active');
                    mainNav.classList.remove('active');

                    // Add a small delay to ensure the transition completes before navigation
                    setTimeout(() => {
                        navWrapper.style.maxHeight = '0px';
                    }, 100); // 100ms delay to allow transition to start

                    // If this is the "Offers" link, ensure smooth navigation
                    if (this.textContent.trim().toLowerCase() === 'offers') {
                        e.preventDefault(); // Prevent immediate navigation
                        setTimeout(() => {
                            window.location.href = this.href; // Navigate after menu closes
                        }, 300); // Match the CSS transition duration (0.3s)
                    }
                }
            });
        });

        // Handle window resize to reset menu state on larger screens
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                mobileMenuBtn.classList.remove('active');
                navWrapper.classList.remove('active');
                mainNav.classList.remove('active');
                navWrapper.style.maxHeight = null; // Reset max-height for desktop
            }
        });
    }

    // Casino card hover effect enhancement
    const casinoCards = document.querySelectorAll('.casino-card');
    casinoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.btn-bonus').style.transform = 'translateY(-3px)';
        });

        card.addEventListener('mouseleave', function() {
            this.querySelector('.btn-bonus').style.transform = '';
        });

        // Track clicks on casino cards (analytics)
        card.addEventListener('click', function(e) {
            if (e.target.closest('.promo-code') || e.target.closest('.btn-signup')) {
                return;
            }
            const casinoName = this.querySelector('.casino-bonus h3').textContent;
            console.log('Casino card clicked:', casinoName);
        });
    });

    // Promo code copy functionality
    const promoCodeElements = document.querySelectorAll('.promo-code');
    promoCodeElements.forEach(element => {
        element.addEventListener('click', function() {
            const code = this.getAttribute('data-code') || 'EXOTIC';
            copyToClipboard(code);
            showCopyNotification(code);
        });
    });

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy:', err);
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                console.log('Fallback copy successful');
            } catch (err) {
                console.error('Fallback copy failed:', err);
            }
            document.body.removeChild(textarea);
        });
    }

    function showCopyNotification(code) {
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = `Copied: ${code}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Leaderboard API integration
    if (document.querySelector('#leaderboard-grid')) {
        fetchLeaderboardData();
    }

    function fetchLeaderboardData() {
        const apiUrl = 'https://cheersino.com/api/leaderboard/getrank?affiliate=6838b924273084ca931b9df0';
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('API Response Status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response Data:', JSON.stringify(data, null, 2));
            renderLeaderboard(data);
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error);
            const leaderboardGrid = document.querySelector('#leaderboard-grid');
            leaderboardGrid.innerHTML = '<p class="leaderboard-error">Unable to load leaderboard data. Please try again later.</p>';
        });
    }

    function renderLeaderboard(data) {
        const leaderboardGrid = document.querySelector('#leaderboard-grid');
        leaderboardGrid.innerHTML = '';

        let leaderboardData = [];
        if (Array.isArray(data.data)) {
            leaderboardData = data.data;
        } else if (Array.isArray(data)) {
            leaderboardData = data;
        } else {
            console.warn('Unexpected API response structure:', JSON.stringify(data, null, 2));
            leaderboardGrid.innerHTML = '<p class="leaderboard-error">No valid leaderboard data found.</p>';
            return;
        }

        if (leaderboardData.length === 0) {
            console.warn('Leaderboard data is empty');
            leaderboardGrid.innerHTML = '<p class="leaderboard-error">No leaderboard data available for this affiliate. Please check back later or contact support.</p>';
            return;
        }

        leaderboardData.forEach((entry, index) => {
            const rank = entry.rank || entry.position || index + 1;
            const playerName = entry.playerName || entry.username || entry.name || 'Anonymous';
            const score = entry.score || entry.points || entry.value || 'N/A';
            const details = entry.details || entry.info || entry.detailData || '';

            const entryElement = document.createElement('div');
            entryElement.className = `leaderboard-entry ${index < 3 ? 'top-rank' : ''}`;
            entryElement.innerHTML = `
                <div class="leaderboard-header">
                    <span class="leaderboard-rank">${rank}</span>
                    <span class="leaderboard-player">${playerName}</span>
                </div>
                <div class="leaderboard-body">
                    <div class="leaderboard-score">Score: ${score}</div>
                    <div class="leaderboard-details">${details}</div>
                </div>
            `;
            leaderboardGrid.appendChild(entryElement);
        });
    }
});
  // Casino card hover effect enhancement
    const casinoCards = document.querySelectorAll('.casino-card');
    casinoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const signupButton = this.querySelector('.btn-signup');
            if (signupButton) {
                signupButton.style.transform = 'scale(1.05) translateY(-5px)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const signupButton = this.querySelector('.btn-signup');
            if (signupButton) {
                signupButton.style.transform = '';
            }
        });

        // Track clicks on casino cards (analytics)
        card.addEventListener('click', function(e) {
            if (e.target.closest('.promo-code') || e.target.closest('.btn-signup')) {
                return;
            }
            const casinoName = this.querySelector('.casino-bonus h3').textContent;
            console.log('Casino card clicked:', casinoName);
        });
    });

    // Promo code copy functionality
    const promoCodeElements = document.querySelectorAll('.promo-code');
    promoCodeElements.forEach(element => {
        element.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            if (code) {
                copyToClipboard(code);
                showCopyNotification(code);
            } else {
                console.error('No data-code attribute found for promo code element:', this);
                showCopyNotification('Error: Code not found');
            }
        });
    });

    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard:', text);
            }).catch(err => {
                console.error('Clipboard API failed:', err);
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            console.log('Fallback copy successful:', text);
        } catch (err) {
            console.error('Fallback copy failed:', err);
            alert('Copy failed. Please copy manually: ' + text);
        }
        document.body.removeChild(textarea);
    }

    function showCopyNotification(code) {
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = `Copied: ${code}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});
