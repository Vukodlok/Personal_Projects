// Connect elements to variables
const input = document.getElementById('search-input');
const pokemonName = document.getElementById('pokemon-name');
const imageContainer = document.getElementById('image');
const id = document.getElementById('pokemon-id');
const weight = document.getElementById('weight');
const height = document.getElementById('height');
const types = document.getElementById('types');
const hp = document.getElementById('hp');
const attack = document.getElementById('attack');
const defense = document.getElementById('defense');
const specialAttack= document.getElementById('special-attack');
const specialDefense = document.getElementById('special-defense');
const speed = document.getElementById('speed');
const button = document.getElementById('search-button');

// Color coded box colors for types
const typeColors = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#F0B6BC',
  normal: '#DDDDDD'
};

// Fetch the data for a pokemon from the endpoint
function fetchData(nameOrId) {
  fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${nameOrId}`)
  .then(response => {
    if (!response.ok) {
    alert('Pokémon not found');
    throw new Error('Pokémon not found');
    }
    return response.json();
  })
  .then(data => {
    // Set the stat values
    pokemonName.textContent = data.name.toUpperCase();
    id.textContent = `#${data.id}`;
    height.textContent = `Height: ${data.height}`;
    weight.textContent = `Weight: ${data.weight}`;
    hp.textContent = data.stats.find(stat => stat.stat.name === 'hp').base_stat;
    speed.textContent = data.stats.find(stat => stat.stat.name === 'speed').base_stat;
    attack.textContent = data.stats.find(stat => stat.stat.name === 'attack').base_stat;
    defense.textContent = data.stats.find(stat => stat.stat.name === 'defense').base_stat;
    specialAttack.textContent = data.stats.find(stat => stat.stat.name === 'special-attack').base_stat;
    specialDefense.textContent = data.stats.find(stat => stat.stat.name === 'special-defense').base_stat;

    // Remove any existing image with id "sprite" to prevent duplicates
      const existingImage = document.getElementById("sprite");
      if (existingImage) {
        existingImage.remove();
      }

      // Create a new img element
      const newImage = document.createElement("img");
      newImage.id = "sprite";
      newImage.src = data.sprites.front_default;
      newImage.alt = `Image of ${data.name}`;

      // Append the new image to the container
      imageContainer.appendChild(newImage);
    
    // Get types and create elements with color-coded boxes
      types.innerHTML = data.types.map(typeInfo => {
        const typeName = typeInfo.type.name;
        // Default color if not found
        const color = typeColors[typeName] || '#FFFFFF';
        return `<span class="type-box" style="background-color: ${color};">${typeName}</span>`;
      }).join(' '); // Join types with a space, not a comma
    })
    .catch(error => console.log('Error: could not fetch data', error));
}

// Call fetchData with button
button.addEventListener("click", () => {
  const inputValue = input.value.trim().toLowerCase();
  fetchData(inputValue);
});
