document.addEventListener('DOMContentLoaded', () => {
    const breedList = document.getElementById('breedList');
    const displayFact = document.getElementById('displayfact');

    // Store the selected breed item
    let selectedBreedItem = null;
    // Store the fetched breeds data 
    let breedsData = null; 

    // Function to fetch dog breed data from the server
    function fetchDogBreeds() {
        fetch('https://dogapi.dog/api/v2/breeds?page[number]=1')
            .then(response => response.json())
            .then(data => {
                // Store the fetched breeds data
                breedsData = data.data;
                // Display each breed in the list
                breedsData.forEach(breedData => {
                    const breedItem = document.createElement('ul');
                    breedItem.textContent = breedData.attributes.name;

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
                        let selectedBreedName = breedData.attributes.name;

                        // Store the selected breed item
                        selectedBreedItem = breedItem;

                        // Change the color of the selected breed item
                        breedItem.style.backgroundColor = 'lightblue';

                        // Call a function to fetch and display dog facts
                        fetchBreedDescription(selectedBreedName);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
            });
    }

    // Function to fetch breed description and image
    function fetchBreedDescription(selectedBreedName) {
        // Find the breed by name in the stored data
        const selectedBreedData = breedsData.find(breedData => breedData.attributes.name === selectedBreedName);

        if (selectedBreedData) {
            const breedAttributes = selectedBreedData.attributes;
            displayFact.innerHTML = `
                <h2 id="title">${breedAttributes.name}</h2>
                <p id="description">Description: ${breedAttributes.description}</p>
                <p id="maxage"> Maximum age: ${breedAttributes.life.max} years</p>
                <p id="minage"> Minimum age: ${breedAttributes.life.min} years</p>
                <p id="maleweight"> Male Weight: ${breedAttributes.male_weight.min} - ${breedAttributes.male_weight.max} kg</p>
                <p id="femaleweight"> Female Weight: ${breedAttributes.female_weight.min} - ${breedAttributes.female_weight.max} kg</p>
            `;
        } else {
            console.error('Breed not found in the stored data.');
        }
    } 
        // Add an event listener to the Subscribe button
        const subscribeButton = document.getElementById('subscribeButton');
subscribeButton.addEventListener('click', () => {
    // Get the email input value
    const emailInput = document.getElementById('emailInput');
    const userEmail = emailInput.value;
    // Make sure the email input is not empty
    if (!userEmail) {
        alert('Please enter your email.');
        return;
    }
    // Create a JSON object with the email
    const emailData = { email: userEmail };
    // Send a POST request to store the email in db.json
    fetch("http://localhost:3000/emails", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
    })
    .then(response => response.json())
    .then(message =>{
      alert('Thank You For Subscribing!')  
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while subscribing. Please try again later.');
    });

    // Clear the email input field
    emailInput.value = '';
});

        
    
    // Fetch dog breeds and initialize the page
    fetchDogBreeds();
});