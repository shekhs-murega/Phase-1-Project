//declare variable names with a constany
document.addEventListener('DOMContentLoaded', () => {
    const breedList = document.getElementById('breedList');
    const displayFact = document.getElementById('displayfact');

    //The identified breed item
    let identifiedBreedItem = null;
    //The fetched breed data 
    let breedData = null; 

    //Fetching dog breed data from the server
    function fetchDogBreeds() {
        fetch('https://dogapi.dog/api/v2/breeds?page[number]=1')
            .then(response => response.json())
            .then(data => {
                //The fetched breed data
                breedData = data.data;
                // Display each breed in the list
                breedData.forEach(breedData => {
                    const breedsItem = document.createElement('ul');
                    breedsItem.textContent = breedData.attributes.name;

                    breedList.appendChild(breedsItem);

                    // A mouse hover effect
                    breedsItem.addEventListener('mouseenter', () => {
                        breedsItem.style.backgroundColor = 'lightblue';
                    });

                    // Remove the mouse hover effect
                    breedsItem.addEventListener('mouseleave', () => {
                        if (breedsItem !== identifiedBreedItem) {
                            breedsItem.style.backgroundColor = 'transparent';
                        }
                    });

                    // A click event listener to each breed item
                    breedsItem.addEventListener('click', () => {
                        // Remove the mouse hover effect from the previously selected breed item
                        if (identifiedBreedItem !== null) {
                            identifiedBreedItem.style.backgroundColor = 'transparent';
                        }

                        // Get the breed name when clicked
                        let identifiedBreedName = breedData.attributes.name;

                        // Store the selected breed item
                        identifiedBreedItem = breedsItem;

                        // Change the color of the selected breed item
                        breedsItem.style.backgroundColor = 'white';

                        // Call a function to fetch and display dog facts
                        fetchBreedDescription(identifiedBreedName);
                    });
                });
            })
            .catch(error => {
                console.error('Error while fetching dog breeds:', error);
            });
    }

    // Function to fetch breed description and image
    function fetchBreedDescription(identifiedBreedName) {
        // Find the breed by name in the stored data
        const identifiedBreedData = breedData.find(breedData => breedData.attributes.name === identifiedBreedName);

        if (identifiedBreedData) {
            const breedAttributes = identifiedBreedData.attributes;
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
        // Add an event listener to the button(suscribe)
        const subscribeButton = document.getElementById('subscribeButton');
subscribeButton.addEventListener('click', () => {
    // Get the email input value
    const emailInput = document.getElementById('emailInput');
    const conributorEmail = emailInput.value;
    // Make sure the email input is not empty
    if (!conributorEmail) {
        alert('Please enter your email.');
        return;
    }
    // A JSON object with the email
    const emailData = { email: conributorEmail };
    // A POST request to store the email in db.json
    fetch("http://localhost:3000/emails", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
    })
    .then(response => response.json())
    .then(message =>{
      alert('Thanks For Subscribing!')  
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Please try again later.');
    });

    // Clear the email input field
    emailInput.value = '';
});

        
    
    //Initialize the page
    fetchDogBreeds();
});