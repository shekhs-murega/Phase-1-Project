// Dog Breed App

// Ensuring the script loads after the HTML has successfully been displayed
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault(); // This line is unnecessary here.

    // Getting elements by their ID
    const dogBreed = document.getElementById('breedList');
    const breedFact = document.getElementById('displayfact');
    const subscribeBtn = document.getElementById('subscribeButton');
    const commentsText = document.getElementById('comment-input');
    const commentList = document.getElementById('comment-list');
    const commentsButton = document.getElementById('comment-submit');

    // Initialize selected breed item and fetched breeds data
    let selectedBreedItem = null;
    let breedsData = null;

    // Using fetch to GET the dog breeds from the public API
    function fetchDogBreeds() {
        fetch('https://dogapi.dog/api/v2/breeds?page[number]=1')
            .then(response => response.json())
            .then(data => {
                breedsData = data.data;
                // To display each breed in the list
                breedsData.forEach(breedData => {
                    const breedItem = document.createElement('ul');
                    breedItem.textContent = breedData.attributes.name;
                    dogBreed.appendChild(breedItem);

                    // An event listener for the mouse hover
                    breedItem.addEventListener('mouseenter', (e) => {
                        e.preventDefault(); // This line is unnecessary here.
                        breedItem.style.backgroundColor = 'gray';
                    });

                    breedItem.addEventListener('mouseleave', (e) => {
                        e.preventDefault(); // This line is unnecessary here.
                        if (breedItem !== selectedBreedItem) {
                            breedItem.style.backgroundColor = 'transparent';
                        }
                    });

                    // Event listener for clicking a certain breed
                    breedItem.addEventListener('click', (e) => {
                        e.preventDefault(); // This line is unnecessary here.
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

    // Function to Fetch and display breed facts
    function fetchBreedDescription(selectedBreedName) {
        // Find a specific breed in the breedsData array based on the condition.
        const selectedBreedData = breedsData.find(breedData => breedData.attributes.name === selectedBreedName);
        if (selectedBreedData) {
            const breedAttributes = selectedBreedData.attributes;
            breedFact.innerHTML = `
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
    subscribeBtn.classList.add('btn', 'btn-primary');

    // Subscribe button event listener
    subscribeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('emailInput');
        const userEmail = emailInput.value;
        // Confirming if input is empty
        if (!userEmail) {
            alert('Please enter your email.');
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
            alert('Thank You For Subscribing!');
        })
        // Catching the error
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while subscribing. Please try again later.');
        });

        // Clears input box
        emailInput.value = '';
    });

    // Function to create a new comment element
    function commentSection(commentData) {
        // Creating a div for the comment section
        let commentDiv = document.createElement('div');
        // Adding a bootstrap class
        commentDiv.classList.add('comment');
        // Adding the comment box
        let commentArea = document.createElement('p');
        commentArea.textContent = commentData.text;
        // Creating a div for the buttons and added comments
        let actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');
        // Creating the edit button to edit comments
        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');

        // Edit comment actions
        editButton.addEventListener('click', (e) => {
            e.preventDefault();
            editInput.classList.remove('hidden');
            editInput.value = commentData.text;
            editInput.addEventListener('keydown', (event) => {
                event.preventDefault();
                if (event.key === 'Enter') {
                    // Updating text
                    let editedText = editInput.value;
                    let commentId = commentData.id;
                    // Using PATCH to edit a comment from the server
                    fetch(`http://localhost:3000/comments/${commentId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: editedText }),
                    })
                    .then(response => response.json())
                    .then(data => {
                    })
                    // Catching error from the server
                    .catch(error => {
                        console.error('Error:', error);
                    });
                    commentArea.textContent = editedText;
                    editInput.classList.add('hidden');
                }
            });
        });

        // Delete button actions
        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Removing the comment div from the browser
            commentDiv.remove();
            const commentId = commentData.id;
            // Removing the comment from the server side
            fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'DELETE',
            })
            .then(response => {
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });

        const editInput = document.createElement('input');
        editInput.classList.add('edit-input', 'hidden');
        editInput.setAttribute('type', 'text');
        editInput.setAttribute('placeholder', 'Edit your comment');

        // Adding the items to the elements
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteBtn);
        commentDiv.appendChild(commentArea);
        commentDiv.appendChild(actionsDiv);
        commentDiv.appendChild(editInput);
        return commentDiv;
    }

    // Function to load comments from the server when the page loads
    function loadComments() {
        fetch('http://localhost:3000/comments')
        .then(response => response.json())
        .then(data => {
            data.forEach(commentData => {
                const commentDiv = commentSection(commentData);
                commentList.appendChild(commentDiv);
            });
        })
        // Catching error from the server
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Event listener for submitting a comment
    commentsButton.classList.add('btn', 'btn-primary');
    commentsButton.addEventListener('click', (e) => {
        e.preventDefault();
        // I used trim() to remove whitespace characters from the beginning and end of a string
        const commentArea = commentsText.value.trim();
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
            commentsText.value = '';
        }
    });

    // Fetch dog breeds and initialize the page
    fetchDogBreeds();

    // Load comments from the server
    loadComments();
});

