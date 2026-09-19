// app.js - Main Application Logic for Happiness Loop

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Animated Cat
    const cat = new AnimatedCat('catMount');

    // 2. DOM Elements
    const speechBubble = document.getElementById('speechBubble');
    const loopIndicator = document.getElementById('loopIndicator');
    const loopRoundNum = document.getElementById('loopRoundNum');
    const complimentCard = document.getElementById('complimentCard');
    const complimentText = document.getElementById('complimentText');
    const particlesCanvas = document.getElementById('particlesCanvas');
    const victoryModal = document.getElementById('victoryModal');
    const hugsCountEl = document.getElementById('hugsCount');

    // Opening letter elements
    const introLetterScreen = document.getElementById('introLetterScreen');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('waxSeal');
    const swipePrompt = document.getElementById('swipePrompt');
    const screenFlash = document.getElementById('screenFlash');
    const appContainer = document.querySelector('.app-container');

    // Initialize main content as hidden/waiting for reveal
    if (appContainer) {
        appContainer.classList.add('app-reveal-init');
    }

    // Action button containers
    const introButtons = document.getElementById('introButtons');
    const pokeButtons = document.getElementById('pokeButtons');
    const loopCheckButtons = document.getElementById('loopCheckButtons');

    // Buttons
    const btnYesSad = document.getElementById('btnYesSad');
    const btnFeelingGood = document.getElementById('btnFeelingGood');
    const btnPokeHint = document.getElementById('btnPokeHint');
    const btnStillSad = document.getElementById('btnStillSad');
    const btnHappierNow = document.getElementById('btnHappierNow');
    const btnClaimMoreHugs = document.getElementById('btnClaimMoreHugs');
    const btnPlayAgain = document.getElementById('btnPlayAgain');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const soundText = document.getElementById('soundText');

    // Header & Victory share buttons
    const btnCreateCustomLink = document.getElementById('btnCreateCustomLink');
    const btnShareFriend = document.getElementById('btnShareFriend');

    // Name Generator Modal DOM Elements
    const nameGeneratorModal = document.getElementById('nameGeneratorModal');
    const btnCloseNameModal = document.getElementById('btnCloseNameModal');
    const nameInputStep = document.getElementById('nameInputStep');
    const targetNameInput = document.getElementById('targetNameInput');
    const btnGenerateLink = document.getElementById('btnGenerateLink');
    const btnPlayWithCurrentName = document.getElementById('btnPlayWithCurrentName');
    const linkOutputStep = document.getElementById('linkOutputStep');
    const linkRecipientLabel = document.getElementById('linkRecipientLabel');
    const generatedLinkInput = document.getElementById('generatedLinkInput');
    const btnCopyLink = document.getElementById('btnCopyLink');
    const copyBtnIcon = document.getElementById('copyBtnIcon');
    const copyBtnText = document.getElementById('copyBtnText');
    const btnShareWhatsapp = document.getElementById('btnShareWhatsapp');
    const btnOpenPersonalizedLink = document.getElementById('btnOpenPersonalizedLink');
    const btnCreateAnother = document.getElementById('btnCreateAnother');

    let isLetterOpened = false;

    // 3. Game State
    let loopCount = 0;
    let complimentsIndex = 0;
    let hugsTotal = 10000;
    let isConfettiActive = false;
    let currentPokesNeeded = 1;
    let currentPokesDone = 0;

    // Hats for continuous loop progression
    const loopHats = ['frog', 'chef', 'strawberry', 'wizard'];

    // Dynamic Recipient & Personalized Compliments
    let recipientName = 'Komal';
    let activeCompliments = [];

    function getComplimentsFor(name) {
        return [
            `${name}, you have the absolute sweetest heart in the whole world! 🌸`,
            `Reminder for ${name}: You are literally the prettiest and smartest person alive! 💖`,
            `Hey ${name}, even on bad days, you are still my absolute favorite human! 🐾`,
            `${name} + Me = Best Friends Forever! No sad thoughts allowed! ✨`,
            `${name}'s smile has enough warmth to light up the darkest room in an instant! ☀️`,
            `Sending ${name} 100 cuddly kitten purrs and unlimited snuggle points! 🐱`,
            `${name}, take a deep breath. You are gentle, resilient, brilliant, and so deeply loved! 🌷`,
            `Whenever ${name} feels down, remember this pastel cat would do 10,000 backflips just to see you smile! 💖`
        ];
    }

    function sanitizeName(raw) {
        if (!raw) return '';
        let clean = raw.trim().replace(/[<>"/\\&]/g, '');
        if (clean.length > 30) clean = clean.substring(0, 30);
        return clean;
    }

    function getNameFromURL() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            let name = urlParams.get('name');
            if (!name && window.location.hash) {
                const hash = window.location.hash.substring(1);
                const hashParams = new URLSearchParams(hash);
                name = hashParams.get('name');
            }
            return name ? sanitizeName(name) : null;
        } catch (e) {
            return null;
        }
    }

    function generateShareableLink(name) {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('name', name);
            url.hash = '';
            return url.toString();
        } catch (e) {
            const base = window.location.href.split('?')[0].split('#')[0];
            return `${base}?name=${encodeURIComponent(name)}`;
        }
    }

    function updateRecipientDOM(name) {
        recipientName = name || 'Komal';
        activeCompliments = getComplimentsFor(recipientName);

        // Update document title and meta description
        document.title = `${recipientName}'s Happiness Loop 🐾 | Animated Squishy Cat`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', `An interactive heartwarming animated pastel cat experience designed especially for ${recipientName} to absorb sadness with tummy pokes, funny hats, and personalized compliments!`);
        }

        // Update all elements with .recipient-name class
        document.querySelectorAll('.recipient-name').forEach(el => {
            el.textContent = recipientName;
        });

        // Update victory screen name
        const victoryName = document.getElementById('victoryRecipientName');
        if (victoryName) victoryName.textContent = recipientName;

        // Update header brand title
        const brandTitle = document.getElementById('brandTitle');
        if (brandTitle) brandTitle.innerHTML = `<span class="recipient-name">${recipientName}</span>'s Happiness Loop`;

        // Update generator label
        if (linkRecipientLabel) linkRecipientLabel.textContent = recipientName;

        // Update initial compliment text if at start
        if (complimentsIndex === 0 && complimentText) {
            complimentText.textContent = `"${activeCompliments[0]}"`;
        }

        // Update speech bubble if it's currently at intro
        if (introButtons && introButtons.style.display !== 'none') {
            speechBubble.textContent = `Aww, ${recipientName}... Are u sad today? 🥺`;
        }
    }

    // 4. Particle Engine (Canvas)
    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, type = 'paw') {
            this.x = x;
            this.y = y;
            this.type = type; // 'paw', 'heart', 'sparkle', 'confetti'
            this.size = type === 'confetti' ? Math.random() * 8 + 6 : Math.random() * 18 + 14;

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - (type === 'confetti' ? 2 : 3);

            this.opacity = 1;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 8;
            this.gravity = type === 'confetti' ? 0.15 : 0.08;
            this.decay = Math.random() * 0.015 + 0.012;

            const confettiColors = ['#FF6B8B', '#FF8E53', '#FFAAA6', '#70A1FF', '#48C78E', '#FECA57', '#FF9FF3'];
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];

            const pawIcons = ['🐾', '🐾'];
            const heartIcons = ['💖', '🌸', '💕', '✨', '😻'];
            this.icon = type === 'paw' ? pawIcons[Math.floor(Math.random() * pawIcons.length)]
                : type === 'heart' ? heartIcons[Math.floor(Math.random() * heartIcons.length)]
                    : '✨';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.rotation += this.rotSpeed;
            this.opacity -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);

            if (this.type === 'confetti') {
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            } else {
                ctx.font = `${this.size}px 'Nunito', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.icon, 0, 0);
            }

            ctx.restore();
        }
    }

    function spawnBurst(x, y, count = 18, type = 'paw') {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, type));
            // Mix in a few hearts
            if (i % 2 === 0) {
                particles.push(new Particle(x, y, 'heart'));
            }
        }
    }

    function loopParticles() {
        ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

        // If continuous victory confetti is active, spawn streamers at top
        if (isConfettiActive && Math.random() < 0.45) {
            for (let i = 0; i < 4; i++) {
                const x = Math.random() * particlesCanvas.width;
                particles.push(new Particle(x, -10, 'confetti'));
                if (Math.random() < 0.2) {
                    particles.push(new Particle(x, -10, 'heart'));
                }
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            if (p.opacity <= 0 || p.y > particlesCanvas.height + 50) {
                particles.splice(i, 1);
            }
        }

        animationFrameId = requestAnimationFrame(loopParticles);
    }
    loopParticles();

    // =========================================================
    // 5. OPENING LETTER & SWIPE-TO-OPEN CONTROLLER
    // =========================================================
    function triggerOpenLetter() {
        if (isLetterOpened) return;
        isLetterOpened = true;

        try {
            if (window.soundCtrl) {
                window.soundCtrl.init();
                window.soundCtrl.playLetterOpen();
            }
        } catch (err) {
            console.warn('Audio play error:', err);
        }

        // 1. Unfold flap, remove wax seal, slide letter card up
        if (envelope) {
            envelope.style.transform = '';
            envelope.classList.add('envelope-opened');
        }

        // Particle burst of hearts and sparkles from envelope
        try {
            const rect = envelope ? envelope.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            spawnBurst(centerX, centerY, 28, 'heart');
        } catch (e) { }

        // 2. Whole screen turns bright (Screen Flash Bloom)
        setTimeout(() => {
            if (screenFlash) {
                screenFlash.classList.add('flash-bright');
            }
        }, 500);

        // 3. While screen is at peak brightness, hide letter screen & reveal main cat content
        setTimeout(() => {
            if (introLetterScreen) {
                introLetterScreen.classList.add('fade-out');
                setTimeout(() => {
                    introLetterScreen.style.display = 'none';
                }, 500);
            }

            if (appContainer) {
                appContainer.classList.remove('app-reveal-init');
                appContainer.classList.add('app-revealed');
            }

            // Slowly fade out the bright bloom so the cat and all content become visible!
            if (screenFlash) {
                screenFlash.classList.remove('flash-bright');
                screenFlash.classList.add('flash-fade-out');
            }

            // Gentle welcoming purr
            setTimeout(() => {
                try {
                    if (window.soundCtrl) {
                        window.soundCtrl.playPurr();
                    }
                } catch (e) { }
            }, 300);
        }, 800);

        // 4. Cleanup flash after transition completes
        setTimeout(() => {
            if (screenFlash) {
                screenFlash.style.display = 'none';
            }
        }, 2400);
    }

    // Unified Touch & Pointer Swipe Handling
    let swipeStartY = null;
    let swipeStartX = null;
    let isSwiping = false;

    function handleStart(clientY, clientX) {
        if (isLetterOpened) return;
        swipeStartY = clientY;
        swipeStartX = clientX;
        isSwiping = true;
    }

    function handleMove(clientY, clientX) {
        if (!isSwiping || isLetterOpened || swipeStartY === null) return;
        const deltaY = swipeStartY - clientY;
        const deltaX = Math.abs((swipeStartX || clientX) - clientX);

        // Visual drag feedback: upward translation on the envelope
        if (envelope && deltaY > 0 && deltaY < 120) {
            envelope.style.transform = `translateY(${-deltaY * 0.45}px) rotateX(${deltaY * 0.15}deg)`;
        }

        // Low, responsive threshold: swipe up by 35px or quick diagonal flick
        if (deltaY > 35 || (deltaY > 20 && deltaX > 40)) {
            isSwiping = false;
            swipeStartY = null;
            triggerOpenLetter();
        }
    }

    function handleEnd() {
        if (!isSwiping || isLetterOpened) return;
        isSwiping = false;
        swipeStartY = null;
        if (envelope) {
            envelope.style.transform = '';
        }
    }

    // Attach to introLetterScreen so swiping ANYWHERE on the screen works seamlessly
    if (introLetterScreen) {
        // Touch events
        introLetterScreen.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                handleStart(e.touches[0].clientY, e.touches[0].clientX);
            }
        }, { passive: true });

        introLetterScreen.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                handleMove(e.touches[0].clientY, e.touches[0].clientX);
            }
        }, { passive: true });

        introLetterScreen.addEventListener('touchend', handleEnd, { passive: true });
        introLetterScreen.addEventListener('touchcancel', handleEnd, { passive: true });

        // Mouse drag events
        introLetterScreen.addEventListener('mousedown', (e) => {
            handleStart(e.clientY, e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            handleMove(e.clientY, e.clientX);
        });

        window.addEventListener('mouseup', handleEnd);

        // Direct tap/click triggers on the envelope elements
        if (waxSeal) waxSeal.addEventListener('click', triggerOpenLetter);
        if (swipePrompt) swipePrompt.addEventListener('click', triggerOpenLetter);
        if (envelope) {
            envelope.addEventListener('click', () => {
                if (!isLetterOpened) triggerOpenLetter();
            });
        }
    }

    // 6. Sound Toggle Controller
    soundToggleBtn.addEventListener('click', () => {
        window.soundCtrl.init();
        const isMuted = window.soundCtrl.toggleMute();
        soundIcon.textContent = isMuted ? '🔇' : '🔊';
        soundText.textContent = isMuted ? 'Muted' : 'Sound On';
    });

    // 6. Dialogue Update Helper with bounce
    function updateSpeech(text) {
        speechBubble.style.opacity = '0';
        speechBubble.style.transform = 'scale(0.92) translateY(5px)';

        setTimeout(() => {
            speechBubble.textContent = text;
            speechBubble.style.opacity = '1';
            speechBubble.style.transform = 'scale(1) translateY(0)';
        }, 180);
    }

    // 7. Handlers for Game Flow

    // A) Intro: "Yes, I'm sad..." tapped
    btnYesSad.addEventListener('click', () => {
        window.soundCtrl.init();
        window.soundCtrl.playMeow();

        introButtons.style.display = 'none';
        pokeButtons.style.display = 'flex';
        complimentCard.style.display = 'none';

        // Cat points to its squishy tummy
        cat.setExpression('worried');
        cat.setPaws('pointing');
        cat.showTummyPrompt(true);

        updateSpeech(`Oh no! ${recipientName}, quick! Poke my squishy tummy to absorb the sadness!`);
    });

    // B) Intro: "I'm feeling good!" tapped
    btnFeelingGood.addEventListener('click', () => {
        window.soundCtrl.init();
        window.soundCtrl.playGiggle();

        introButtons.style.display = 'none';
        cat.setExpression('happy');
        cat.setPaws('raised');

        const rect = cat.wrapper.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22, 'heart');

        updateSpeech(`Yay!! Seeing ${recipientName} happy makes my day! 🥰 But you can still poke my squishy belly anytime!`);

        pokeButtons.style.display = 'flex';
        cat.showTummyPrompt(true);
    });

    // C) Interactive Tummy Poke Handler
    function handleTummyPoke(e) {
        window.soundCtrl.init();

        // Coordinates for particle burst
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        if (e && e.clientX) {
            x = e.clientX;
            y = e.clientY;
        } else if (cat.tummyBtn) {
            const rect = cat.tummyBtn.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        // Trigger squish animation & audio
        cat.triggerSquish(() => {
            currentPokesDone++;

            if (currentPokesDone < currentPokesNeeded) {
                // Multi-poke loop mode
                const remaining = currentPokesNeeded - currentPokesDone;
                updateSpeech(`Double poke power! ${remaining} more squish needed, ${recipientName}! 🐾`);
                return;
            }

            // Pokes satisfied! Reveal Compliment
            cat.showTummyPrompt(false);
            pokeButtons.style.display = 'none';

            // Compliment card display
            const comp = activeCompliments[complimentsIndex % activeCompliments.length];
            complimentsIndex++;
            complimentText.textContent = `"${comp}"`;
            complimentCard.style.display = 'block';

            if (window.soundCtrl) {
                window.soundCtrl.playChime();
            }

            cat.setExpression('happy');
            cat.setPaws('idle');

            // After a sweet reading moment, present the Loop Check question
            setTimeout(() => {
                updateSpeech(`Are u still sad, ${recipientName}? 🥺`);
                loopCheckButtons.style.display = 'flex';
            }, 2200);
        });

        // Particle burst
        spawnBurst(x, y, 20, 'paw');
    }

    // Attach poke to both SVG belly target and the hint button
    if (cat.tummyBtn) {
        cat.tummyBtn.addEventListener('click', handleTummyPoke);
        cat.tummyBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTummyPoke(e.touches[0]);
        }, { passive: false });
    }
    btnPokeHint.addEventListener('click', handleTummyPoke);

    // D) Loop Check: "Still a little sad... 😿"
    btnStillSad.addEventListener('click', () => {
        window.soundCtrl.init();
        window.soundCtrl.playMeow();

        loopCount++;
        loopRoundNum.textContent = loopCount + 1;
        loopIndicator.style.display = 'flex';

        // Select funny hat for this loop
        const hatIndex = (loopCount - 1) % loopHats.length;
        const hat = loopHats[hatIndex];
        cat.setHat(hat);

        // Trigger silly wobbly dance
        cat.triggerWobblyDance();
        cat.setExpression('squish');
        cat.setPaws('pointing');
        cat.showTummyPrompt(true);

        complimentCard.style.display = 'none';
        loopCheckButtons.style.display = 'none';
        pokeButtons.style.display = 'flex';

        currentPokesNeeded = 2; // "Double poke required!"
        currentPokesDone = 0;

        const hatNames = {
            'frog': 'frog hat 🐸',
            'chef': 'chef hat 🧑‍🍳',
            'strawberry': 'strawberry beret 🍓',
            'wizard': 'magic wizard hat 🧙'
        };

        const chosenHatName = hatNames[hat] || 'funny hat 🎩';
        updateSpeech(`Double poke required! I put on my ${chosenHatName}! Poke my belly again ${recipientName}! 😸`);
    });

    // E) Loop Check: "I feel happier now! 😸" -> Victory Breakout!
    btnHappierNow.addEventListener('click', () => {
        window.soundCtrl.init();

        loopCheckButtons.style.display = 'none';
        complimentCard.style.display = 'none';
        pokeButtons.style.display = 'none';
        loopIndicator.style.display = 'none';

        updateSpeech(`Yay! ${recipientName} is happy again! You win 10,000 cat hugs! 🎉💖`);

        // Cat does backflip & celebratory state
        cat.triggerVictory();

        // Massive confetti explosion
        isConfettiActive = true;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        spawnBurst(centerX, centerY, 45, 'heart');
        spawnBurst(centerX, centerY, 50, 'confetti');

        // Show Fullscreen Victory Celebration Modal
        setTimeout(() => {
            victoryModal.style.display = 'flex';
        }, 1600);
    });

    // F) Claim More Hugs Button (Interactive Hugs Shower)
    btnClaimMoreHugs.addEventListener('click', (e) => {
        window.soundCtrl.init();
        window.soundCtrl.playGiggle();

        hugsTotal += 1000;
        hugsCountEl.textContent = hugsTotal.toLocaleString();

        // Pop heart particles from button
        const rect = btnClaimMoreHugs.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24, 'heart');
    });

    // G) Play Again / Restart Button
    btnPlayAgain.addEventListener('click', () => {
        victoryModal.style.display = 'none';
        isConfettiActive = false;

        loopCount = 0;
        currentPokesNeeded = 1;
        currentPokesDone = 0;
        complimentsIndex = 0;

        cat.resetToIntro();
        updateSpeech(`Aww, ${recipientName}... Are u sad today? 🥺`);

        introButtons.style.display = 'flex';
        pokeButtons.style.display = 'none';
        loopCheckButtons.style.display = 'none';
        loopIndicator.style.display = 'none';
        complimentCard.style.display = 'none';

        if (window.soundCtrl) {
            window.soundCtrl.stopVictoryMusic();
        }
    });

    // H) Reopen Letter Button
    const btnReopenLetter = document.getElementById('btnReopenLetter');
    if (btnReopenLetter) {
        btnReopenLetter.addEventListener('click', () => {
            victoryModal.style.display = 'none';
            isConfettiActive = false;
            isLetterOpened = false;

            if (window.soundCtrl) {
                window.soundCtrl.stopVictoryMusic();
            }

            loopCount = 0;
            currentPokesNeeded = 1;
            currentPokesDone = 0;
            complimentsIndex = 0;

            // Reset envelope & letter screen
            envelope.classList.remove('envelope-opened');
            introLetterScreen.classList.remove('fade-out');
            introLetterScreen.style.display = 'flex';

            if (appContainer) {
                appContainer.classList.add('app-reveal-init');
                appContainer.classList.remove('app-revealed');
            }

            cat.resetToIntro();
            updateSpeech(`Aww, ${recipientName}... Are u sad today? 🥺`);

            introButtons.style.display = 'flex';
            pokeButtons.style.display = 'none';
            loopCheckButtons.style.display = 'none';
            loopIndicator.style.display = 'none';
            complimentCard.style.display = 'none';
        });
    }

    // =========================================================
    // 8. NAME GENERATOR & SHAREABLE LINK MODAL CONTROLLER
    // =========================================================

    function openNameGeneratorModal(prefill = '') {
        nameGeneratorModal.style.display = 'flex';
        nameInputStep.style.display = 'flex';
        linkOutputStep.style.display = 'none';
        targetNameInput.value = prefill || (recipientName !== 'Komal' ? recipientName : '');
        setTimeout(() => {
            targetNameInput.focus();
        }, 120);
    }

    function closeNameGeneratorModal() {
        nameGeneratorModal.style.display = 'none';
    }

    function handleGenerateLink() {
        const inputVal = sanitizeName(targetNameInput.value) || recipientName || 'Komal';
        const link = generateShareableLink(inputVal);

        generatedLinkInput.value = link;
        linkRecipientLabel.textContent = inputVal;

        nameInputStep.style.display = 'none';
        linkOutputStep.style.display = 'flex';

        // Reset copy button state
        copyBtnText.textContent = 'Copy';
        copyBtnIcon.textContent = '📋';
        btnCopyLink.classList.remove('copied');

        // Apply recipient name to application state
        updateRecipientDOM(inputVal);

        // Pop hearts
        const rect = btnGenerateLink.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, 'heart');
    }

    function copyLinkToClipboard() {
        const text = generatedLinkInput.value;
        if (!text) return;

        function onCopiedSuccess() {
            btnCopyLink.classList.add('copied');
            copyBtnText.textContent = 'Copied! 💖';
            copyBtnIcon.textContent = '✓';
            const rect = btnCopyLink.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16, 'heart');
            setTimeout(() => {
                btnCopyLink.classList.remove('copied');
                copyBtnText.textContent = 'Copy';
                copyBtnIcon.textContent = '📋';
            }, 2500);
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(onCopiedSuccess).catch(() => {
                fallbackCopy();
                onCopiedSuccess();
            });
        } else {
            fallbackCopy();
            onCopiedSuccess();
        }
    }

    function fallbackCopy() {
        generatedLinkInput.focus();
        generatedLinkInput.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.warn('Clipboard execCommand copy fallback error:', err);
        }
    }

    function shareOnWhatsApp() {
        const link = generatedLinkInput.value;
        const name = linkRecipientLabel.textContent || recipientName || 'you';
        const message = `Aww, a cute little kitten has a heartwarming surprise waiting just for ${name}! 🐾💖 Open it here: ${link}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    function openPersonalizedExperience() {
        const name = linkRecipientLabel.textContent || recipientName;
        updateRecipientDOM(name);

        try {
            const url = generateShareableLink(name);
            window.history.pushState({ name }, '', url);
        } catch (e) {
            console.warn('Could not push history state:', e);
        }

        closeNameGeneratorModal();
    }

    // Modal Action Listeners
    btnGenerateLink.addEventListener('click', handleGenerateLink);

    targetNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleGenerateLink();
        }
    });

    btnPlayWithCurrentName.addEventListener('click', () => {
        const inputVal = sanitizeName(targetNameInput.value) || recipientName || 'Komal';
        updateRecipientDOM(inputVal);
        try {
            const url = generateShareableLink(inputVal);
            window.history.pushState({ name: inputVal }, '', url);
        } catch (e) {}
        closeNameGeneratorModal();
    });

    btnCopyLink.addEventListener('click', copyLinkToClipboard);
    btnShareWhatsapp.addEventListener('click', shareOnWhatsApp);
    btnOpenPersonalizedLink.addEventListener('click', openPersonalizedExperience);

    btnCreateAnother.addEventListener('click', () => {
        nameInputStep.style.display = 'flex';
        linkOutputStep.style.display = 'none';
        targetNameInput.value = '';
        targetNameInput.focus();
    });

    btnCloseNameModal.addEventListener('click', closeNameGeneratorModal);

    nameGeneratorModal.addEventListener('click', (e) => {
        if (e.target === nameGeneratorModal) {
            closeNameGeneratorModal();
        }
    });

    // Header "Make Someone Happy" button
    if (btnCreateCustomLink) {
        btnCreateCustomLink.addEventListener('click', () => {
            openNameGeneratorModal(recipientName !== 'Komal' ? recipientName : '');
        });
    }

    // Victory Screen "Send Happiness to a Friend" button
    if (btnShareFriend) {
        btnShareFriend.addEventListener('click', () => {
            openNameGeneratorModal();
        });
    }

    // =========================================================
    // 9. INITIAL APP STARTUP & URL PARAMETER HANDLING
    // =========================================================
    const initialName = getNameFromURL();
    if (initialName) {
        // Recipient opened customized link directly!
        updateRecipientDOM(initialName);
    } else {
        // Direct visit: prompt who they want to make happy!
        updateRecipientDOM('Komal');
        openNameGeneratorModal();
    }
});

