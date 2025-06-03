document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const headerActions = document.querySelector('.header-actions');
    
    mobileMenuBtn.addEventListener('click', function() {
        const isNavVisible = mainNav.style.display === 'block';
        
        if (isNavVisible) {
            mainNav.style.display = 'none';
            headerActions.style.display = 'none';
            this.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            mainNav.style.display = 'block';
            headerActions.style.display = 'flex';
            mainNav.style.position = 'absolute';
            mainNav.style.top = '100%';
            mainNav.style.left = '0';
            mainNav.style.width = '100%';
            mainNav.style.backgroundColor = 'var(--dark-color)';
            mainNav.style.padding = '20px';
            mainNav.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            
            mainNav.querySelector('ul').style.flexDirection = 'column';
            mainNav.querySelectorAll('li').forEach(li => {
                li.style.margin = '10px 0';
            });
            
            headerActions.style.position = 'absolute';
            headerActions.style.top = 'calc(100% + 120px)';
            headerActions.style.left = '0';
            headerActions.style.width = '100%';
            headerActions.style.padding = '20px';
            headerActions.style.backgroundColor = 'var(--dark-color)';
            headerActions.style.justifyContent = 'center';
            headerActions.style.gap = '20px';
            
            this.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
    
    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth > 992) {
            mainNav.style.display = '';
            headerActions.style.display = '';
            mainNav.querySelector('ul').style.flexDirection = '';
            mainNav.querySelectorAll('li').forEach(li => {
                li.style.margin = '';
            });
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Add active class to current page link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Casino card hover effect enhancement
    const casinoCards = document.querySelectorAll('.casino-card');
    
    casinoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.btn-bonus').style.transform = 'translateY(-3px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.btn-bonus').style.transform = '';
        });
    });
    
    // You'll add your actual links later like this:
    // document.querySelectorAll('.btn-bonus').forEach((btn, index) => {
    //     btn.href = yourLinksArray[index];
    // });
});
document.addEventListener('DOMContentLoaded', function() {

    const promoCodeElements = document.querySelectorAll('.promo-code');
    
    promoCodeElements.forEach(element => {
        element.addEventListener('click', function() {
            const code = this.getAttribute('data-code') || 'EXOTIC';
            copyToClipboard(code);
            
        
            showCopyNotification(code);
        });
    });
    
    // Function to copy text to clipboard
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
    
    // Function to show copy notification
    function showCopyNotification(code) {
        
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
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
    
    // Track clicks on casino cards (analytics)
    document.querySelectorAll('.casino-card').forEach(card => {
        card.addEventListener('click', function(e) {
           
            if (e.target.closest('.promo-code') || e.target.closest('.btn-signup')) {
                return;
            }
            
            const casinoName = this.querySelector('.casino-bonus h3').textContent;
            console.log('Casino card clicked:', casinoName);
            
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
  

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
document.addEventListener('DOMContentLoaded', () => {
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
                const menuHeight = mainNav.scrollHeight + 'px'; // Get the full height of the menu content
                navWrapper.style.maxHeight = menuHeight; // Set max-height dynamically
            } else {
                navWrapper.style.maxHeight = '0px'; // Collapse the menu
            }
        });

        // Close menu when a nav link is clicked (optional, improves UX on mobile)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navWrapper.classList.remove('active');
                mainNav.classList.remove('active');
                navWrapper.style.maxHeight = '0px';
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
});