document.addEventListener('DOMContentLoaded', () => {
    const breedList = document.getElementById('breedList');
    const displayFact = document.getElementById('displayfact');
    let selectedBreedItem = null; // Store the selected breed item

    // Function to fetch dog breed data from the server
    function fetchDogBreeds() {
        fetch('https://dog.ceo/api/breeds/list/all')
            .then(response => response.json())
            .then(data => {
                const breeds = Object.keys(data.message);
                // Display each breed in the list
                breeds.forEach(breed => {
                    const breedItem = document.createElement('li');
                    breedItem.textContent = breed;
                    breedList.appendChild(breedItem);

                    // Add a mouse hover effect
                    breedItem.addEventListener('mouseenter', () => {
                        breedItem.style.backgroundColor = 'lightgray';
                    });

                    // Remove the mouse hover effect
                    breedItem.addEventListener('mouseleave', () => {
                        if (breedItem !== selectedBreedItem) {
                            breedItem.style.backgroundColor = 'transparent';
                        }
                    });

                    // Add a click event listener to each breed item
                    breedItem.addEventListener('click', () => {
                        // Remove the mouse hover effect from previously selected breed item
                        if (selectedBreedItem !== null) {
                            selectedBreedItem.style.backgroundColor = 'transparent';
                        }

                        // Get the breed name when clicked
                        const selectedBreed = breedItem.textContent;

                        // Store the selected breed item
                        selectedBreedItem = breedItem;

                        // Change the color of the selected breed item
                        breedItem.style.backgroundColor = 'lightblue';

                        // Call a function to fetch and display dog facts
                        fetchBreedDescription(selectedBreed);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
            });
    }

    // Function to fetch breed description and image
    function fetchBreedDescription(breed) {
        fetch(`https://dog.ceo/api/breeds/image/random`)
            .then(response => response.json())
            .then(data => {
                const imageUrl = data.message;

                // Fetch additional dog facts or description from another source
                fetch(`https://dog.ceo/api/breeds/${breed}/list`)
                    .then(response => response.json())
                    .then(data => {
                        const description = data.message[0] || 'Description not available.';
                        
                        // Display the breed image and description
                        displayFact.innerHTML = `
                            <img src="${imageUrl}" alt="${breed}" width="500" height="500">
                            <h2 id="title">BREED: ${breed}</h2>
                            <p id="description">Description: ${description}</p>
                        `;
                    })
                    .catch(error => {
                        console.error('Error fetching breed description:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching breed image:', error);
            });
    }

    // Fetch dog breeds and initialize the page
    fetchDogBreeds();
});
