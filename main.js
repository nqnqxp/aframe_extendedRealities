import 'aframe';

console.log('A-Frame version:', AFRAME.version);

// Pet Simulator Game State
const petState = {
  name: 'Whiskers',
  happiness: 80,
  hunger: 60,
  lastFed: Date.now(),
  lastPlayed: Date.now()
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
}

// Feed the pet
function feedPet() {
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
    this.el.addEventListener('click', () => {
      console.log('Toy ball clicked!');
      playWithPet();
      
      // Make ball bounce
      this.el.setAttribute('animation__bounce', {
        property: 'position',
        from: this.el.getAttribute('position'),
        to: `${this.el.getAttribute('position').x} 2 ${this.el.getAttribute('position').z}`,
        dur: 800,
        dir: 'alternate',
        loop: 3,
        easing: 'easeInOutQuad'
      });
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

// Cat Walker Component - Makes cat walk around freely with random waypoints
AFRAME.registerComponent('cat-walker', {
  init: function() {
    this.isWalking = true;
    this.bounds = {
      minX: -20,
      maxX: 20,
      minZ: -20,
      maxZ: 5
    };
    
    // Start walking to first random waypoint
    this.walkToRandomWaypoint();
  },
  
  getRandomWaypoint: function() {
    // Generate a random point within bounds
    return {
      x: Math.random() * (this.bounds.maxX - this.bounds.minX) + this.bounds.minX,
      z: Math.random() * (this.bounds.maxZ - this.bounds.minZ) + this.bounds.minZ
    };
  },
  
  walkToRandomWaypoint: function() {
    if (!this.isWalking) return;
    
    const nextPoint = this.getRandomWaypoint();
    const currentPos = this.el.getAttribute('position');
    
    // Calculate direction to face
    const dx = nextPoint.x - currentPos.x;
    const dz = nextPoint.z - currentPos.z;
    const angle = Math.atan2(dx, dz) * (180 / Math.PI);
    
    // Calculate distance for duration (speed of movement)
    const distance = Math.sqrt(dx * dx + dz * dz);
    const duration = distance * 1500; // 1.5 seconds per unit (slower walking)
    
    // Rotate to face direction
    this.el.setAttribute('animation__rotate', {
      property: 'rotation',
      to: `0 ${angle} 0`,
      dur: 500,
      easing: 'easeInOutQuad'
    });
    
    // Walk to position
    setTimeout(() => {
      this.el.setAttribute('animation__walk', {
        property: 'position',
        to: `${nextPoint.x} 0.5 ${nextPoint.z}`,
        dur: duration,
        easing: 'linear'
      });
      
      // Add walking bob animation
      this.el.setAttribute('animation__bob', {
        property: 'position',
        from: `${currentPos.x} 0.5 ${currentPos.z}`,
        to: `${nextPoint.x} 0.55 ${nextPoint.z}`,
        dur: 400,
        dir: 'alternate',
        loop: Math.ceil(duration / 800),
        easing: 'easeInOutSine'
      });
      
      // After reaching waypoint, pick a new random destination
      setTimeout(() => {
        // Random pause before next walk (cat is thinking where to go next!)
        const pauseTime = Math.random() * 3000 + 1000; // 1-4 seconds
        setTimeout(() => {
          this.walkToRandomWaypoint();
        }, pauseTime);
      }, duration);
    }, 500);
  }
});

console.log('🐾 Pet Simulator Loaded! Click on the food bowl or toy ball to interact!');

