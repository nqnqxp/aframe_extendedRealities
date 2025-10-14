import 'aframe';

console.log('A-Frame version:', AFRAME.version);

// Pet Simulator Game State
const petState = {
  name: 'Whiskers',
  happiness: 80,
  hunger: 60,
  lastFed: Date.now(),
  lastPlayed: Date.now(),
  isDead: false
};

// Handle cat name changes
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('cat-name-input');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      petState.name = e.target.value || 'Whiskers';
      console.log(`🐱 Cat name changed to: ${petState.name}`);
    });
    
    // Load saved name from localStorage if available
    const savedName = localStorage.getItem('catName');
    if (savedName) {
      petState.name = savedName;
      nameInput.value = savedName;
    }
    
    // Save name to localStorage when changed
    nameInput.addEventListener('blur', () => {
      localStorage.setItem('catName', petState.name);
    });
  }
  
  // Hidden debug shortcut: Press 'k' to decrease stats
  document.addEventListener('keydown', (e) => {
    if (e.key === 'k' || e.key === 'K') {
      petState.hunger = Math.max(0, petState.hunger - 30);
      petState.happiness = Math.max(0, petState.happiness - 20);
      updateUI();
      console.log(`⚡ Debug (K): Decreased stats! Hunger: ${petState.hunger}, Happiness: ${petState.happiness}`);
    }
  });
});

// Update UI
function updateUI() {
  const happinessBar = document.getElementById('happiness-bar');
  const hungerBar = document.getElementById('hunger-bar');
  
  if (happinessBar) {
    happinessBar.style.width = `${petState.happiness}%`;
  }
  if (hungerBar) {
    hungerBar.style.width = `${petState.hunger}%`;
  }
  
  // Check if cat should die
  if (!petState.isDead && (petState.happiness <= 0 || petState.hunger <= 0)) {
    killCat();
  }
}

// Kill the cat (sad!)
function killCat() {
  petState.isDead = true;
  console.log('💀 Oh no! Your cat has died...');
  
  const pet = document.getElementById('pet');
  const leftEye = document.getElementById('left-eye');
  const rightEye = document.getElementById('right-eye');
  const deathMarkers = document.getElementById('death-markers');
  
  if (pet && leftEye && rightEye && deathMarkers) {
    // Hide the regular eyes
    leftEye.setAttribute('visible', false);
    rightEye.setAttribute('visible', false);
    
    // Show X marks
    deathMarkers.setAttribute('visible', true);
    
    // Fall over on side (rotate 90 degrees on Z axis)
    pet.setAttribute('animation__death', {
      property: 'rotation',
      to: '0 180 90',
      dur: 2000,
      easing: 'easeInOutQuad'
    });
    
    // Slight drop
    const currentPos = pet.getAttribute('position');
    pet.setAttribute('animation__drop', {
      property: 'position',
      to: `${currentPos.x} 0.3 ${currentPos.z}`,
      dur: 2000,
      easing: 'easeInOutQuad'
    });
    
    // Stop the cat walker
    const catWalker = pet.components['cat-walker'];
    if (catWalker) {
      catWalker.walking = false;
      catWalker.rotating = false;
      catWalker.paused = true;
    }
    
    // Show revival message after a moment
    setTimeout(() => {
      alert('💀 Your cat has died from neglect!\n\nFeed and play with your cat to keep it alive.\n\nRefresh the page to get a new cat.');
    }, 2500);
  }
}

// Revive the cat (for future use)
function reviveCat() {
  petState.isDead = false;
  petState.happiness = 50;
  petState.hunger = 50;
  
  const pet = document.getElementById('pet');
  const leftEye = document.getElementById('left-eye');
  const rightEye = document.getElementById('right-eye');
  const deathMarkers = document.getElementById('death-markers');
  
  if (pet && leftEye && rightEye && deathMarkers) {
    // Show regular eyes
    leftEye.setAttribute('visible', true);
    rightEye.setAttribute('visible', true);
    
    // Hide X marks
    deathMarkers.setAttribute('visible', false);
    
    // Stand back up
    pet.setAttribute('rotation', '0 180 0');
    const currentPos = pet.getAttribute('position');
    pet.setAttribute('position', `${currentPos.x} 0.5 ${currentPos.z}`);
    
    // Restart walker
    const catWalker = pet.components['cat-walker'];
    if (catWalker) {
      catWalker.paused = false;
    }
  }
  
  updateUI();
  console.log('✨ Your cat has been revived!');
}

// Feed the pet
function feedPet() {
  if (petState.isDead) return;
  
  petState.hunger = Math.min(100, petState.hunger + 30);
  petState.happiness = Math.min(100, petState.happiness + 10);
  petState.lastFed = Date.now();
  updateUI();
  
  // Play eating sound (visual feedback)
  const pet = document.getElementById('pet');
  if (pet) {
    // Jump animation
    pet.setAttribute('animation__jump', {
      property: 'position',
      from: pet.getAttribute('position'),
      to: `${pet.getAttribute('position').x} ${pet.getAttribute('position').y + 0.5} ${pet.getAttribute('position').z}`,
      dur: 300,
      dir: 'alternate',
      loop: 2
    });
  }
  
  console.log(`🍖 ${petState.name} fed! Hunger:`, petState.hunger, 'Happiness:', petState.happiness);
}

// Play with the pet
function playWithPet() {
  if (petState.isDead) return;
  
  petState.happiness = Math.min(100, petState.happiness + 25);
  petState.hunger = Math.max(0, petState.hunger - 10);
  petState.lastPlayed = Date.now();
  updateUI();
  
  const pet = document.getElementById('pet');
  if (pet) {
    // Spin animation
    pet.setAttribute('animation__spin', {
      property: 'rotation',
      from: pet.getAttribute('rotation'),
      to: `0 ${pet.getAttribute('rotation').y + 360} 0`,
      dur: 1000,
      easing: 'easeInOutQuad'
    });
  }
  
  console.log(`🎾 Playing with ${petState.name}! Happiness:`, petState.happiness, 'Hunger:', petState.hunger);
}

// Decrease stats over time
function updatePetNeeds() {
  const now = Date.now();
  const timeSinceLastFed = now - petState.lastFed;
  const timeSinceLastPlayed = now - petState.lastPlayed;
  
  // Decrease hunger over time (every 10 seconds in real-time, decrease by 1)
  if (timeSinceLastFed > 10000) {
    petState.hunger = Math.max(0, petState.hunger - 1);
    petState.lastFed = now;
  }
  
  // Decrease happiness over time
  if (timeSinceLastPlayed > 15000) {
    petState.happiness = Math.max(0, petState.happiness - 1);
    petState.lastPlayed = now;
  }
  
  updateUI();
}

// Update pet needs every 2 seconds
setInterval(updatePetNeeds, 2000);

// Food Bowl Component
AFRAME.registerComponent('food-bowl', {
  init: function() {
    this.el.addEventListener('click', () => {
      console.log('Food bowl clicked!');
      const food = document.getElementById('food');
      if (food && food.getAttribute('visible')) {
        feedPet();
        // Hide food temporarily
        food.setAttribute('visible', false);
        setTimeout(() => {
          food.setAttribute('visible', true);
        }, 3000);
      }
    });
    
    // Add hover effect
    this.el.addEventListener('mouseenter', () => {
      this.el.setAttribute('scale', '1.1 1.1 1.1');
    });
    
    this.el.addEventListener('mouseleave', () => {
      this.el.setAttribute('scale', '1 1 1');
    });
  }
});

// Toy Ball Component
AFRAME.registerComponent('toy-ball', {
  init: function() {
    this.originalPosition = { x: 3, y: 0.3, z: -2 };
    this.isBouncing = false;
    
    // Add idle floating animation
    this.el.setAttribute('animation__idle', {
      property: 'position',
      from: '3 0.3 -2',
      to: '3 0.5 -2',
      dur: 1000,
      dir: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
    
    this.el.addEventListener('click', () => {
      if (this.isBouncing) return;
      
      console.log('Toy ball clicked!');
      playWithPet();
      
      this.isBouncing = true;
      
      // Stop idle animation
      this.el.removeAttribute('animation__idle');
      
      // Reset to ground position first
      this.el.setAttribute('position', this.originalPosition);
      
      // Make ball bounce
      this.el.setAttribute('animation__bounce', {
        property: 'position',
        from: '3 0.3 -2',
        to: '3 2 -2',
        dur: 400,
        dir: 'alternate',
        loop: 3,
        easing: 'easeInOutQuad'
      });
      
      // Restart idle animation after bounce completes
      setTimeout(() => {
        this.el.removeAttribute('animation__bounce');
        this.el.setAttribute('position', this.originalPosition);
        
        // Restart idle floating
        this.el.setAttribute('animation__idle', {
          property: 'position',
          from: '3 0.3 -2',
          to: '3 0.5 -2',
          dur: 1000,
          dir: 'alternate',
          loop: true,
          easing: 'easeInOutSine'
        });
        
        this.isBouncing = false;
      }, 2400); // 400ms * 6 (3 loops * 2 for alternate)
    });
    
    // Add hover effect
    this.el.addEventListener('mouseenter', () => {
      this.el.setAttribute('scale', '1.2 1.2 1.2');
    });
    
    this.el.addEventListener('mouseleave', () => {
      this.el.setAttribute('scale', '1 1 1');
    });
  }
});

// Pet Animations Component
AFRAME.registerComponent('pet-animations', {
  init: function() {
    // Random idle animations
    setInterval(() => {
      const random = Math.random();
      if (random > 0.7) {
        // Occasionally meow (head bob)
        const head = this.el.querySelector('a-sphere');
        if (head) {
          head.setAttribute('animation__meow', {
            property: 'position',
            from: head.getAttribute('position'),
            to: `${head.getAttribute('position').x} ${head.getAttribute('position').y + 0.1} ${head.getAttribute('position').z}`,
            dur: 200,
            dir: 'alternate',
            loop: 2
          });
        }
      }
    }, 5000);
  }
});

// Bell Component - Calls the cat to come
AFRAME.registerComponent('cat-bell', {
  init: function() {
    this.el.addEventListener('click', () => {
      console.log('🔔 Bell rung! Calling cat...');
      
      // Ring animation
      const bellCone = document.getElementById('bell-cone');
      if (bellCone) {
        // Remove old animation first to reset it
        bellCone.removeAttribute('animation__ring');
        
        // Small delay to ensure removal is processed
        setTimeout(() => {
          bellCone.setAttribute('animation__ring', {
            property: 'rotation',
            from: '0 0 -15',
            to: '0 0 15',
            dur: 100,
            dir: 'alternate',
            loop: 6,
            easing: 'easeInOutQuad'
          });
          
          // Reset rotation after animation completes
          setTimeout(() => {
            bellCone.setAttribute('rotation', '0 0 0');
            bellCone.removeAttribute('animation__ring');
          }, 1200); // 100ms * 6 loops * 2 (alternate)
        }, 10);
      }
      
      // Call the cat
      callCatToBell();
    });
    
    // Add hover effect
    this.el.addEventListener('mouseenter', () => {
      this.el.setAttribute('scale', '1.1 1.1 1.1');
    });
    
    this.el.addEventListener('mouseleave', () => {
      this.el.setAttribute('scale', '1 1 1');
    });
  }
});

// Function to call cat to the bell
function callCatToBell() {
  const pet = document.getElementById('pet');
  const bell = document.getElementById('cat-bell');
  
  if (!pet || !bell || petState.isDead) return;
  
  const bellPos = bell.getAttribute('position');
  const catWalker = pet.components['cat-walker'];
  
  if (catWalker) {
    // Interrupt current walk
    catWalker.walking = false;
    catWalker.rotating = false;
    catWalker.paused = true;
    
    // Set bell as target
    catWalker.isCalled = true;
    catWalker.targetPosition = { x: bellPos.x, z: bellPos.z };
    catWalker.startPosition = { x: catWalker.currentPosition.x, z: catWalker.currentPosition.z };
    
    // Calculate direction to face the bell
    const dx = bellPos.x - catWalker.currentPosition.x;
    const dz = bellPos.z - catWalker.currentPosition.z;
    let targetAngle = Math.atan2(dx, dz) * (180 / Math.PI) - 180;
    
    // Normalize angle
    while (targetAngle > 180) targetAngle -= 360;
    while (targetAngle < -180) targetAngle += 360;
    
    catWalker.targetRotation = targetAngle;
    
    // Calculate walk duration
    const distance = Math.sqrt(dx * dx + dz * dz);
    catWalker.walkDuration = distance * 2000; // Faster when called (2 sec per unit)
    
    // Start rotation
    catWalker.rotating = true;
    catWalker.rotateProgress = 0;
    
    console.log(`🐱 ${petState.name} is coming!`);
  }
}

// Cat Walker Component - Makes cat walk around naturally with random paths and stops
AFRAME.registerComponent('cat-walker', {
  init: function() {
    this.walking = false;
    this.rotating = false;
    this.paused = false;
    this.isCalled = false; // Whether cat is being called by bell
    
    // Get initial position from the entity
    const startPos = this.el.getAttribute('position');
    this.currentPosition = { x: startPos.x, y: 0.5, z: startPos.z };
    this.targetPosition = null;
    this.startPosition = null;
    this.currentRotation = 180;
    this.targetRotation = 180;
    
    this.walkProgress = 0;
    this.rotateProgress = 0;
    this.walkDuration = 0;
    this.rotateDuration = 800;
    
    this.bobTime = 0;
    
    this.bounds = {
      minX: -12,
      maxX: 12,
      minZ: -12,
      maxZ: 0
    };
    
    // Obstacle positions (objects to avoid)
    this.obstacles = [
      { x: -3, z: -2, radius: 1.2 },  // Food bowl
      { x: 3, z: -2, radius: 1.2 },   // Toy ball
      { x: -3, z: -4, radius: 1.2 },  // Water bowl
      { x: 4, z: -5, radius: 1.5 },   // Pet bed
      { x: -6, z: -6, radius: 2 },    // Cat tower
      { x: 2, z: -4, radius: 0.8 },   // Small ball
      { x: -2, z: -5, radius: 0.8 },  // Crinkle toy
      { x: 1, z: -6, radius: 0.8 },   // Ring toy
      { x: 0, z: -1, radius: 0.8 }    // Bell
    ];
    
    // Wait a bit before starting
    setTimeout(() => {
      this.startNewWalk();
    }, 2000);
  },
  
  isValidWaypoint: function(x, z) {
    // Check if waypoint is too close to any obstacle
    for (let obstacle of this.obstacles) {
      const dx = x - obstacle.x;
      const dz = z - obstacle.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < obstacle.radius) {
        return false;
      }
    }
    return true;
  },
  
  getRandomWaypoint: function() {
    let attempts = 0;
    let newX, newZ;
    
    // Try to find a valid waypoint (avoid obstacles)
    do {
      // Pick a point within 2-4 units away for more natural movement
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 2 + 2; // 2-4 units (even shorter)
      
      newX = this.currentPosition.x + Math.cos(angle) * distance;
      newZ = this.currentPosition.z + Math.sin(angle) * distance;
      
      // Keep within bounds
      newX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, newX));
      newZ = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, newZ));
      
      attempts++;
      
      if (attempts > 20) {
        // If we can't find a good spot, just pick something safe
        newX = Math.random() * 10 - 5;
        newZ = Math.random() * 6 - 8;
        break;
      }
    } while (!this.isValidWaypoint(newX, newZ));
    
    return { x: newX, z: newZ };
  },
  
  startNewWalk: function() {
    if (this.paused || this.walking || this.rotating || petState.isDead) return;
    
    this.targetPosition = this.getRandomWaypoint();
    this.startPosition = { x: this.currentPosition.x, z: this.currentPosition.z };
    
    // Calculate direction to face
    const dx = this.targetPosition.x - this.currentPosition.x;
    const dz = this.targetPosition.z - this.currentPosition.z;
    
    // Subtract 180 because the cat's head faces -z direction in local space
    let targetAngle = Math.atan2(dx, dz) * (180 / Math.PI) - 180;
    
    // Normalize angle
    while (targetAngle > 180) targetAngle -= 360;
    while (targetAngle < -180) targetAngle += 360;
    
    this.targetRotation = targetAngle;
    
    // Calculate walk duration based on distance
    const distance = Math.sqrt(dx * dx + dz * dz);
    this.walkDuration = distance * 3000; // 3 seconds per unit (slower)
    
    // Start rotation first
    this.rotating = true;
    this.rotateProgress = 0;
    
    console.log(`Cat walking from (${this.currentPosition.x.toFixed(1)}, ${this.currentPosition.z.toFixed(1)}) to (${this.targetPosition.x.toFixed(1)}, ${this.targetPosition.z.toFixed(1)})`);
  },
  
  tick: function(time, deltaTime) {
    if (!deltaTime || deltaTime > 100) return; // Skip large deltas
    
    // Handle rotation
    if (this.rotating) {
      this.rotateProgress += deltaTime;
      const t = Math.min(this.rotateProgress / this.rotateDuration, 1);
      
      // Smooth interpolation
      const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      // Interpolate rotation smoothly
      const rotDiff = this.targetRotation - this.currentRotation;
      this.currentRotation += rotDiff * easedT * (deltaTime / this.rotateDuration);
      this.el.object3D.rotation.y = this.currentRotation * Math.PI / 180;
      
      if (t >= 1) {
        this.rotating = false;
        this.currentRotation = this.targetRotation;
        this.el.object3D.rotation.y = this.currentRotation * Math.PI / 180;
        
        // Start walking after rotation completes
        this.walking = true;
        this.walkProgress = 0;
        this.bobTime = 0;
      }
    }
    
    // Handle walking
    if (this.walking && this.targetPosition && this.startPosition) {
      this.walkProgress += deltaTime;
      const t = Math.min(this.walkProgress / this.walkDuration, 1);
      
      // Smooth linear interpolation from start to target
      this.currentPosition.x = this.startPosition.x + (this.targetPosition.x - this.startPosition.x) * t;
      this.currentPosition.z = this.startPosition.z + (this.targetPosition.z - this.startPosition.z) * t;
      
      // Add walking bob
      this.bobTime += deltaTime * 0.005;
      const bob = Math.sin(this.bobTime) * 0.03;
      
      // Set position directly
      this.el.object3D.position.set(
        this.currentPosition.x,
        0.5 + bob,
        this.currentPosition.z
      );
      
      if (t >= 1) {
        this.walking = false;
        this.currentPosition.x = this.targetPosition.x;
        this.currentPosition.z = this.targetPosition.z;
        this.el.object3D.position.set(this.currentPosition.x, 0.5, this.currentPosition.z);
        
        // Check if cat was called by bell
        if (this.isCalled) {
          this.isCalled = false;
          console.log('🐱 Cat arrived at bell!');
          // Increase happiness for coming when called
          petState.happiness = Math.min(100, petState.happiness + 5);
          updateUI();
        }
        
        // Pause before next walk
        this.paused = true;
        const pauseTime = Math.random() < 0.3 ? 
          Math.random() * 4000 + 3000 : // Long pause
          Math.random() * 2000 + 1000;  // Short pause
        
        setTimeout(() => {
          this.paused = false;
          this.startNewWalk();
        }, pauseTime);
      }
    }
  }
});

console.log('🐾 Pet Simulator Loaded! Click on the food bowl or toy ball to interact!');

