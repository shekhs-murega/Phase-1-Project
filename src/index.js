// Dog Breed App

// Wait for the DOM content to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault(); // Prevent the default action of the event

    // Get references to various elements in the HTML document
    const breedList = document.getElementById('breedList');
    const displayFact = document.getElementById('displayfact');
    const subscribeButton = document.getElementById('subscribeButton');
    const commentInput = document.getElementById('comment-input');
    const commentList = document.getElementById('comment-list');
    const commentSubmitButton = document.getElementById('comment-submit');

    // Initialize selected breed item and fetched breeds data
    let selectedBreedItem = null;
    let breedsData = null;

    // Use fetch to GET the dog breeds from a public API
    function fetchDogBreeds() {
        fetch('https://dogapi.dog/api/v2/breeds?page[number]=1')
            .then(response => response.json())
            .then(data => {
                breedsData = data.data;
                // Display each breed in the list
                breedsData.forEach(breedData => {
                    const breedItem = document.createElement('ul');
                    breedItem.textContent = breedData.attributes.name;
                    breedList.appendChild(breedItem);

                    // Event listeners for mouse hover and click
                    breedItem.addEventListener('mouseenter', (e) => {
                        e.preventDefault();
                        breedItem.style.backgroundColor = 'gray';
                    });

                    breedItem.addEventListener('mouseleave', (e) => {
                        e.preventDefault();
                        if (breedItem !== selectedBreedItem) {
                            breedItem.style.backgroundColor = 'transparent';
                        }
                    });

                    breedItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (selectedBreedItem !== null) {
                            selectedBreedItem.style.backgroundColor = 'transparent';
                        }
                        // Adding a style color to the clicked breed
                        selectedBreedItem = breedItem;
                        breedItem.style.backgroundColor = 'blue';
                        // Invoke the fetchBreedDescription to display facts for a selected breed
                        fetchBreedDescription(breedData.attributes.name);
                    });
                });
            })
            // When the fetch is not successful from the server, this is displayed.
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
            });
    }

    // Function to fetch and display breed facts
    function fetchBreedDescription(selectedBreedName) {
        // Find a specific breed in the breedsData array based on the condition.
        const selectedBreedData = breedsData.find(breedData => breedData.attributes.name === selectedBreedName);
        if (selectedBreedData) {
            const breedAttributes = selectedBreedData.attributes;
            displayFact.innerHTML = `
                <h2 id="title">${breedAttributes.name}</h2>
                <p id="description">${breedAttributes.description}</p>
                <p id="maxage"> Maximum age: ${breedAttributes.life.max} years</p>
                <p id="minage"> Minimum age: ${breedAttributes.life.min} years</p>
                <p id="maleweight"> Male Weight: ${breedAttributes.male_weight.min} - ${breedAttributes.male_weight.max} kg</p>
                <p id="femaleweight"> Female Weight: ${breedAttributes.female_weight.min} - ${breedAttributes.female_weight.max} kg</p>
            `;
        } else {
            console.error('Breed not found in the stored data.');
        }
    }

    // Adding a classlist to the subscribe button
    subscribeButton.classList.add('btn', 'btn-primary');

    // Subscribe button event listener
    subscribeButton.addEventListener('click', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('emailInput');
        const userEmail = emailInput.value;

        if (!userEmail) {
            alert('Enter your email.');
            return;
        }

        const emailData = { email: userEmail };

        // Using POST to store email in db.json
        fetch("http://localhost:3000/emails", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        })
        .then(response => response.json())
        .then(message => {
            alert('Thanks For Subscribing!');
        })
        // Catching the error
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
        // Clears the input box
        emailInput.value = '';
    });

    // Function to create a new comment element
    function commentSection(commentData) {
        // You can add code here for handling comments
    }

    // Function to load comments from the server when the page loads
    function loadComments() {
        // You can add code here for loading comments
    }

    // Adding a class to the comment submit button
    commentSubmitButton.classList.add('btn', 'btn-primary');

    // Event listener for submitting a comment
    commentSubmitButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Using trim() to remove whitespace characters from the beginning and end of a string
        const commentArea = commentInput.value.trim();
        if (commentArea !== '') {
            fetch('http://localhost:3000/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: commentArea }),
            })
            .then(response => response.json())
            .then(commentData => {
                const commentDiv = commentSection(commentData);
                commentList.appendChild(commentDiv);
            })
            // Catching error from the server
            .catch(error => {
                console.error(error);
            });
            // Clears the comment input box
            commentInput.value = '';
        }
    });

    // Fetch dog breeds and initialize the page
    fetchDogBreeds();

    // Load comments from the server
    loadComments();
});
