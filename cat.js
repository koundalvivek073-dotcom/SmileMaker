// cat.js - Interactive SVG Pastel Cat with Dynamic Animations & Expressions

class AnimatedCat {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentHat = 'none'; // 'none', 'frog', 'chef', 'strawberry', 'wizard', 'party'
        this.currentExpression = 'worried'; // 'worried', 'squish', 'happy', 'party'
        this.currentPawState = 'idle'; // 'idle', 'pointing', 'raised'
        this.isSquishing = false;
        this.render();
    }

    render() {
        this.container.innerHTML = `
        <div class="cat-character-wrapper" id="catWrapper">
            <!-- Pulsing Tummy Indicator (Visible when poke is prompted) -->
            <div class="tummy-prompt-badge" id="tummyBadge">
                <span class="badge-sparkle">✨</span>
                <span>Poke Belly!</span>
                <span class="badge-hand">👇</span>
            </div>

            <svg viewBox="0 0 320 360" class="cat-svg" id="catSvg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Body Gradient: Marshmallow pastel cream -->
                    <linearGradient id="catBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#FFF5EC" />
                        <stop offset="60%" stop-color="#FFEADE" />
                        <stop offset="100%" stop-color="#FFDCC8" />
                    </linearGradient>

                    <!-- Tummy Gradient: Soft cloud white -->
                    <linearGradient id="tummyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#FFFFFF" />
                        <stop offset="100%" stop-color="#FFF2E8" />
                    </linearGradient>

                    <!-- Ear Inner Gradient -->
                    <linearGradient id="earPinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#FFAAA6" />
                        <stop offset="100%" stop-color="#FF8B94" />
                    </linearGradient>

                    <!-- Glow filter for squish and victory -->
                    <filter id="pastelGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <!-- Soft Shadow -->
                <ellipse cx="160" cy="342" rx="90" ry="14" fill="rgba(199, 178, 192, 0.35)" class="cat-shadow" />

                <!-- Tail (Wagging) -->
                <g class="cat-tail" id="catTail">
                    <path d="M 90 270 C 50 280, 20 250, 30 210 C 35 190, 55 195, 50 215 C 42 245, 75 260, 100 255 Z" 
                          fill="#FFD2BC" stroke="#FFBFA3" stroke-width="2" stroke-linecap="round"/>
                </g>

                <!-- Body Base (Squashes and stretches) -->
                <g class="cat-body-group" id="catBodyGroup">
                    <!-- Left Ear -->
                    <g class="cat-ear cat-ear-left" id="earLeft">
                        <path d="M 85 105 Q 60 30, 120 60 Z" fill="#FFEADE" stroke="#FFCBB5" stroke-width="3" stroke-linejoin="round"/>
                        <path d="M 90 95 Q 75 48, 115 68 Z" fill="url(#earPinkGrad)"/>
                    </g>

                    <!-- Right Ear -->
                    <g class="cat-ear cat-ear-right" id="earRight">
                        <path d="M 235 105 Q 260 30, 200 60 Z" fill="#FFEADE" stroke="#FFCBB5" stroke-width="3" stroke-linejoin="round"/>
                        <path d="M 230 95 Q 245 48, 205 68 Z" fill="url(#earPinkGrad)"/>
                    </g>

                    <!-- Main Head & Body Combined (Chubby Marshmallow Silhouette) -->
                    <path d="M 95 90 
                             C 60 130, 50 240, 75 295 
                             C 90 325, 230 325, 245 295 
                             C 270 240, 260 130, 225 90 
                             C 195 65, 125 65, 95 90 Z" 
                          fill="url(#catBodyGrad)" 
                          stroke="#FFCBB5" 
                          stroke-width="3.5" 
                          stroke-linejoin="round"
                          class="cat-torso"/>

                    <!-- Chubby Feet -->
                    <ellipse cx="105" cy="318" rx="26" ry="15" fill="#FFEFE5" stroke="#FFCBB5" stroke-width="2.5" />
                    <ellipse cx="215" cy="318" rx="26" ry="15" fill="#FFEFE5" stroke="#FFCBB5" stroke-width="2.5" />
                    <!-- Tiny toe marks -->
                    <path d="M 98 322 L 98 328 M 112 322 L 112 328" stroke="#FFAAA6" stroke-width="2" stroke-linecap="round" />
                    <path d="M 208 322 L 208 328 M 222 322 L 222 328" stroke="#FFAAA6" stroke-width="2" stroke-linecap="round" />

                    <!-- Rosy Cheeks -->
                    <ellipse cx="100" cy="165" rx="16" ry="11" fill="#FFAAA6" opacity="0.65" class="cat-blush" />
                    <ellipse cx="220" cy="165" rx="16" ry="11" fill="#FFAAA6" opacity="0.65" class="cat-blush" />
                    <!-- Cheek highlights -->
                    <circle cx="95" cy="163" r="3" fill="#FFFFFF" opacity="0.8" />
                    <circle cx="215" cy="163" r="3" fill="#FFFFFF" opacity="0.8" />

                    <!-- Cat Whisker Accents -->
                    <g stroke="#D4A390" stroke-width="1.8" stroke-linecap="round" opacity="0.7">
                        <line x1="60" y1="158" x2="88" y2="162" />
                        <line x1="58" y1="172" x2="87" y2="170" />
                        <line x1="260" y1="158" x2="232" y2="162" />
                        <line x1="262" y1="172" x2="233" y2="170" />
                    </g>

                    <!-- Interactive Squishy Tummy Area -->
                    <g class="cat-tummy-target" id="tummyButton" role="button" aria-label="Poke the cat's belly">
                        <!-- Belly Outline -->
                        <ellipse cx="160" cy="245" rx="55" ry="46" fill="url(#tummyGrad)" stroke="#FFE3D3" stroke-width="2.5" class="tummy-oval" />
                        
                        <!-- Little Belly Heart / Belly Button Symbol -->
                        <path d="M 160 252 
                                 C 157 248, 150 248, 150 254 
                                 C 150 259, 157 264, 160 268 
                                 C 163 264, 170 259, 170 254 
                                 C 170 248, 163 248, 160 252 Z" 
                              fill="#FF9AA2" class="tummy-heart" />

                        <!-- Soft tummy swirls -->
                        <circle cx="160" cy="245" r="48" fill="transparent" stroke="rgba(255, 183, 178, 0.3)" stroke-width="2" stroke-dasharray="4 6" class="tummy-pulse-ring" />
                    </g>

                    <!-- Dynamic Expressions Container -->
                    <g class="cat-face" id="catFace">
                        <!-- Worried Eyes (Default intro) -->
                        <g id="faceWorried" class="face-layer">
                            <!-- Eyebrows (worried tilt) -->
                            <path d="M 108 122 Q 124 116, 134 125" stroke="#8C6E63" stroke-width="3" stroke-linecap="round" fill="none"/>
                            <path d="M 212 122 Q 196 116, 186 125" stroke="#8C6E63" stroke-width="3" stroke-linecap="round" fill="none"/>
                            
                            <!-- Big Glossy Worried Eyes -->
                            <ellipse cx="124" cy="142" rx="15" ry="18" fill="#3D3136" />
                            <circle cx="120" cy="136" r="6.5" fill="#FFFFFF" />
                            <circle cx="129" cy="147" r="3" fill="#FFFFFF" />
                            <ellipse cx="126" cy="153" rx="4" ry="2" fill="#80DEEA" opacity="0.85" /> <!-- Teary shimmer -->

                            <ellipse cx="196" cy="142" rx="15" ry="18" fill="#3D3136" />
                            <circle cx="192" cy="136" r="6.5" fill="#FFFFFF" />
                            <circle cx="201" cy="147" r="3" fill="#FFFFFF" />
                            <ellipse cx="198" cy="153" rx="4" ry="2" fill="#80DEEA" opacity="0.85" /> <!-- Teary shimmer -->

                            <!-- Tiny Worried Cat Nose and Mouth -->
                            <polygon points="160,158 156,153 164,153" fill="#FF8B94" />
                            <path d="M 154 163 Q 160 160, 166 163" stroke="#5D4037" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                        </g>

                        <!-- Squish / Purring Eyes (^ _ ^) -->
                        <g id="faceSquish" class="face-layer" style="display: none;">
                            <!-- Closed happy curved eye lines -->
                            <path d="M 110 144 Q 124 128, 138 144" stroke="#4A3731" stroke-width="4.5" stroke-linecap="round" fill="none"/>
                            <path d="M 182 144 Q 196 128, 210 144" stroke="#4A3731" stroke-width="4.5" stroke-linecap="round" fill="none"/>

                            <!-- Happy Cat Nose and Purring W-mouth -->
                            <polygon points="160,157 156,152 164,152" fill="#FF7080" />
                            <path d="M 150 162 Q 155 168, 160 162 Q 165 168, 170 162" stroke="#4A3731" stroke-width="3" stroke-linecap="round" fill="none"/>
                        </g>

                        <!-- Joyful / Happy Eyes (:D) -->
                        <g id="faceHappy" class="face-layer" style="display: none;">
                            <!-- Star sparkle in eyes -->
                            <ellipse cx="124" cy="142" rx="15" ry="18" fill="#3D3136" />
                            <circle cx="120" cy="136" r="7" fill="#FFFFFF" />
                            <polygon points="128,146 130,142 134,144 131,148 133,152 129,149 125,152 127,148" fill="#FFEB3B" />

                            <ellipse cx="196" cy="142" rx="15" ry="18" fill="#3D3136" />
                            <circle cx="192" cy="136" r="7" fill="#FFFFFF" />
                            <polygon points="200,146 202,142 206,144 203,148 205,152 201,149 197,152 199,148" fill="#FFEB3B" />

                            <polygon points="160,157 156,152 164,152" fill="#FF8B94" />
                            <!-- Open smile with tongue -->
                            <path d="M 152 163 Q 160 178, 168 163 Z" fill="#FF6B81" stroke="#4A3731" stroke-width="2.5"/>
                        </g>

                        <!-- Party Glasses Face (Victory breakout) -->
                        <g id="faceParty" class="face-layer" style="display: none;">
                            <!-- Cool Star Sunglasses -->
                            <g fill="#2D2B55" stroke="#FFE66D" stroke-width="3">
                                <!-- Left Star Glass -->
                                <polygon points="124,124 131,139 146,140 134,150 138,165 124,155 110,165 114,150 102,140 117,139" />
                                <!-- Right Star Glass -->
                                <polygon points="196,124 203,139 218,140 206,150 210,165 196,155 182,165 186,150 174,140 189,139" />
                                <!-- Bridge -->
                                <line x1="145" y1="142" x2="175" y2="142" stroke="#FFE66D" stroke-width="4" stroke-linecap="round"/>
                            </g>
                            <!-- Big Cool Grin -->
                            <path d="M 148 170 Q 160 184, 172 170" stroke="#3D2C2E" stroke-width="3.5" stroke-linecap="round" fill="none"/>
                        </g>
                    </g>

                    <!-- Paws Layer -->
                    <!-- Idle Resting Paws -->
                    <g id="pawsIdle" class="cat-paws-layer">
                        <ellipse cx="108" cy="205" rx="16" ry="13" fill="#FFF5EC" stroke="#FFCBB5" stroke-width="2.5" />
                        <ellipse cx="212" cy="205" rx="16" ry="13" fill="#FFF5EC" stroke="#FFCBB5" stroke-width="2.5" />
                        <!-- Tiny paw beans -->
                        <circle cx="108" cy="205" r="4" fill="#FFAAA6" />
                        <circle cx="212" cy="205" r="4" fill="#FFAAA6" />
                    </g>

                    <!-- Pointing Paw (points directly at tummy) -->
                    <g id="pawsPointing" class="cat-paws-layer" style="display: none;">
                        <ellipse cx="108" cy="205" rx="16" ry="13" fill="#FFF5EC" stroke="#FFCBB5" stroke-width="2.5" />
                        <!-- Right Paw pointing inwards to belly with cute pointing toe -->
                        <g class="paw-pointing-anim">
                            <path d="M 220 205 Q 200 215, 180 235 Q 185 242, 195 238 Q 215 220, 230 210 Z" 
                                  fill="#FFF5EC" stroke="#FFCBB5" stroke-width="2.5" stroke-linejoin="round"/>
                            <ellipse cx="182" cy="237" rx="8" ry="7" fill="#FFAAA6" />
                        </g>
                    </g>

                    <!-- Raised High Paws (Victory / Joy) -->
                    <g id="pawsRaised" class="cat-paws-layer" style="display: none;">
                        <g class="paw-waving-left">
                            <path d="M 92 140 Q 65 100, 78 85 Q 92 85, 105 125 Z" fill="#FFF5EC" stroke="#FFCBB5" stroke-width="2.5"/>
                            <circle cx="83" cy="92" r="7" fill="#FFAAA6" />
                        </g>
                        <g class="paw-waving-right">
                            <path d="M 228 140 Q 255 100, 242 85 Q 228 85, 215 125 Z" fill="#FFF5EC" stroke="#FFCBB5" stroke-width="2.5"/>
                            <circle cx="237" cy="92" r="7" fill="#FFAAA6" />
                        </g>
                    </g>

                    <!-- Dynamic Hats / Accessories Layer -->
                    <g id="catHats" class="cat-hats-layer">
                        <!-- Frog Hat 🐸 -->
                        <g id="hatFrog" class="hat-item" style="display: none;">
                            <!-- Green Beanie Dome -->
                            <path d="M 100 85 C 100 35, 220 35, 220 85 Z" fill="#88D49E" stroke="#5EAA74" stroke-width="3" />
                            <!-- Frog Big Eye Left -->
                            <circle cx="120" cy="40" r="16" fill="#88D49E" stroke="#5EAA74" stroke-width="3"/>
                            <circle cx="120" cy="40" r="11" fill="#FFFFFF" />
                            <circle cx="121" cy="40" r="5" fill="#2E4057" />
                            <!-- Frog Big Eye Right -->
                            <circle cx="200" cy="40" r="16" fill="#88D49E" stroke="#5EAA74" stroke-width="3"/>
                            <circle cx="200" cy="40" r="11" fill="#FFFFFF" />
                            <circle cx="199" cy="40" r="5" fill="#2E4057" />
                            <!-- Frog Cheeks & Tiny Smile -->
                            <circle cx="135" cy="72" r="6" fill="#FFAAA6" opacity="0.7"/>
                            <circle cx="185" cy="72" r="6" fill="#FFAAA6" opacity="0.7"/>
                            <path d="M 152 72 Q 160 78, 168 72" stroke="#2E4057" stroke-width="2" stroke-linecap="round" fill="none"/>
                        </g>

                        <!-- Chef Hat 🧑‍🍳 -->
                        <g id="hatChef" class="hat-item" style="display: none;">
                            <!-- White Pleated Puffs -->
                            <path d="M 112 65 
                                     C 95 30, 130 10, 145 25 
                                     C 155 5, 175 5, 185 25 
                                     C 200 10, 230 30, 215 65 Z" 
                                  fill="#FFFFFF" stroke="#D1D8E0" stroke-width="3" />
                            <!-- Hat Band -->
                            <rect x="110" y="62" width="102" height="20" rx="4" fill="#F8F9FA" stroke="#D1D8E0" stroke-width="2.5"/>
                            <!-- Tiny cute wooden spoon tucked in -->
                            <line x1="210" y1="35" x2="228" y2="75" stroke="#C89666" stroke-width="4" stroke-linecap="round" />
                            <ellipse cx="210" cy="35" rx="6" ry="8" fill="#C89666" transform="rotate(-30 210 35)"/>
                        </g>

                        <!-- Strawberry Beret 🍓 -->
                        <g id="hatStrawberry" class="hat-item" style="display: none;">
                            <path d="M 105 85 C 95 35, 225 35, 215 85 Z" fill="#FF6B6B" stroke="#EE5253" stroke-width="3"/>
                            <!-- Green stem and leaves -->
                            <path d="M 160 38 Q 163 20, 170 18" stroke="#10AC84" stroke-width="4" stroke-linecap="round" fill="none"/>
                            <path d="M 160 38 Q 145 32, 140 40 Q 155 42, 160 38 Z" fill="#1DD1A1"/>
                            <path d="M 160 38 Q 175 32, 180 40 Q 165 42, 160 38 Z" fill="#1DD1A1"/>
                            <!-- Tiny strawberry seeds -->
                            <circle cx="125" cy="60" r="2.5" fill="#FFEAA7"/>
                            <circle cx="145" cy="52" r="2.5" fill="#FFEAA7"/>
                            <circle cx="170" cy="54" r="2.5" fill="#FFEAA7"/>
                            <circle cx="190" cy="62" r="2.5" fill="#FFEAA7"/>
                            <circle cx="158" cy="68" r="2.5" fill="#FFEAA7"/>
                        </g>

                        <!-- Wizard Hat 🧙 -->
                        <g id="hatWizard" class="hat-item" style="display: none;">
                            <!-- Purple brim -->
                            <ellipse cx="160" cy="80" rx="62" ry="14" fill="#6C5CE7" stroke="#4834D4" stroke-width="3"/>
                            <!-- Cone curving back -->
                            <path d="M 115 78 Q 160 15, 205 10 Q 185 45, 205 78 Z" fill="#5F27CD" stroke="#341F97" stroke-width="3"/>
                            <!-- Yellow glowing stars -->
                            <polygon points="160,45 163,52 170,53 165,58 166,65 160,61 154,65 155,58 150,53 157,52" fill="#FECA57"/>
                        </g>

                        <!-- Party Cone Hat 🎉 -->
                        <g id="hatParty" class="hat-item" style="display: none;">
                            <polygon points="160,18 120,78 200,78" fill="#FF9FF3" stroke="#F368E0" stroke-width="3"/>
                            <!-- Colorful stripes -->
                            <path d="M 133 60 L 187 60" stroke="#54A0FF" stroke-width="5" stroke-linecap="round"/>
                            <path d="M 145 42 L 175 42" stroke="#FECA57" stroke-width="5" stroke-linecap="round"/>
                            <!-- Top Pompom -->
                            <circle cx="160" cy="16" r="9" fill="#FEEAA7" stroke="#FECA57" stroke-width="2"/>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
        `;

        this.bodyGroup = document.getElementById('catBodyGroup');
        this.tummyBtn = document.getElementById('tummyButton');
        this.tummyBadge = document.getElementById('tummyBadge');
        this.wrapper = document.getElementById('catWrapper');
    }

    setExpression(expr) {
        this.currentExpression = expr;
        const faces = ['faceWorried', 'faceSquish', 'faceHappy', 'faceParty'];
        faces.forEach(fId => {
            const el = document.getElementById(fId);
            if (el) el.style.display = 'none';
        });

        if (expr === 'worried') {
            document.getElementById('faceWorried').style.display = 'block';
        } else if (expr === 'squish') {
            document.getElementById('faceSquish').style.display = 'block';
        } else if (expr === 'happy') {
            document.getElementById('faceHappy').style.display = 'block';
        } else if (expr === 'party') {
            document.getElementById('faceParty').style.display = 'block';
        }
    }

    setPaws(state) {
        this.currentPawState = state;
        const paws = ['pawsIdle', 'pawsPointing', 'pawsRaised'];
        paws.forEach(pId => {
            const el = document.getElementById(pId);
            if (el) el.style.display = 'none';
        });

        if (state === 'idle') {
            document.getElementById('pawsIdle').style.display = 'block';
        } else if (state === 'pointing') {
            document.getElementById('pawsPointing').style.display = 'block';
        } else if (state === 'raised') {
            document.getElementById('pawsRaised').style.display = 'block';
        }
    }

    setHat(hatName) {
        this.currentHat = hatName;
        const hats = ['hatFrog', 'hatChef', 'hatStrawberry', 'hatWizard', 'hatParty'];
        hats.forEach(hId => {
            const el = document.getElementById(hId);
            if (el) el.style.display = 'none';
        });

        const targetMap = {
            'frog': 'hatFrog',
            'chef': 'hatChef',
            'strawberry': 'hatStrawberry',
            'wizard': 'hatWizard',
            'party': 'hatParty'
        };

        if (targetMap[hatName]) {
            const hatEl = document.getElementById(targetMap[hatName]);
            if (hatEl) {
                hatEl.style.display = 'block';
                hatEl.classList.add('hat-pop-in');
                setTimeout(() => hatEl.classList.remove('hat-pop-in'), 600);
            }
        }
    }

    showTummyPrompt(show = true) {
        if (this.tummyBadge) {
            this.tummyBadge.style.display = show ? 'flex' : 'none';
            if (show) {
                this.tummyBadge.classList.add('tummy-badge-pulse');
            }
        }
    }

    // Marshmallow squash-and-stretch dynamic physics on tummy poke
    triggerSquish(onComplete) {
        if (this.isSquishing) return;
        this.isSquishing = true;

        this.setExpression('squish');
        this.wrapper.classList.add('cat-squishing');

        // Play purr/meow audio
        if (window.soundCtrl) {
            window.soundCtrl.playSquish();
            setTimeout(() => window.soundCtrl.playPurr(), 100);
            setTimeout(() => window.soundCtrl.playMeow(), 280);
        }

        setTimeout(() => {
            this.wrapper.classList.remove('cat-squishing');
            this.isSquishing = false;
            if (onComplete) onComplete();
        }, 550);
    }

    // Playful wobbly dance for loop continuation
    triggerWobblyDance() {
        this.wrapper.classList.remove('cat-wobbly-dance');
        // Force reflow
        void this.wrapper.offsetWidth;
        this.wrapper.classList.add('cat-wobbly-dance');
    }

    // Victory backflip and party celebration
    triggerVictory() {
        this.setHat('party');
        this.setExpression('party');
        this.setPaws('raised');
        this.showTummyPrompt(false);

        this.wrapper.classList.remove('cat-backflip');
        void this.wrapper.offsetWidth;
        this.wrapper.classList.add('cat-backflip');

        if (window.soundCtrl) {
            window.soundCtrl.playVictoryMusic();
        }
    }

    resetToIntro() {
        this.setHat('none');
        this.setExpression('worried');
        this.setPaws('idle');
        this.showTummyPrompt(false);
        this.wrapper.className = 'cat-character-wrapper';
    }
}

window.AnimatedCat = AnimatedCat;
