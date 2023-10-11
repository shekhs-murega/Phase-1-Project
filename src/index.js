//dog breed app
document.addEventListener('DOMContentLoaded', () => {
    const breedList = document.getElementById('breedList');
    const displayFact = document.getElementById('displayfact');
    //declare variable names using let
    let selectedBreedItem = null;
    let breedsData = null;

    // Fetching data from the server
    function fetchDogBreeds() {
        //dog api
        fetch('https://dogapi.dog/api/v2/breeds?page[number]=1')
            .then(response => response.json())
            .then(data => {
                breedsData = data.data;
                breedsData.forEach(breedData => {
                    const breedItem = document.createElement('ul');
                    breedItem.textContent = breedData.attributes.name;

                    breedList.appendChild(breedItem);

                    breedItem.addEventListener('mouseenter', () => {
                        breedItem.style.backgroundColor = 'lightgray';
                    });

                    breedItem.addEventListener('mouseleave', () => {
                        if (breedItem !== selectedBreedItem) {
                            breedItem.style.backgroundColor = 'transparent';
                        }
                    });

                    breedItem.addEventListener('click', () => {
                        if (selectedBreedItem !== null) {
                            selectedBreedItem.style.backgroundColor = 'transparent';
                        }

                        let selectedBreedName = breedData.attributes.name;
                        selectedBreedItem = breedItem;
                        breedItem.style.backgroundColor = 'lightblue';

                        fetchBreedDescription(selectedBreedName);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
            });
    }
//fetching breed description
    function fetchBreedDescription(selectedBreedName) {
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

    // Adding an event listener to the Subscribe button
    const subscribeButton = document.getElementById('subscribeButton');
    subscribeButton.addEventListener('click', () => {
        const emailInput = document.getElementById('emailInput');
        const userEmail = emailInput.value;

        if (!userEmail) {
            alert('Enter your email.');
            return;
        }

        const emailData = { email: userEmail };
// HTTP POST
        fetch("http://localhost:3000/emails", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        })
        .then(response => response.json())
        .then(message => {
            alert('Thank You For Subscribing!')
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while subscribing. Please try again later.');
        });

        emailInput.value = '';
    });

    const commentInput = document.getElementById('comment-input');
    const commentList = document.getElementById('comment-list');
    const commentSubmitButton = document.getElementById('comment-submit');

    function createCommentElement(text) {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        const commentText = document.createElement('p');
        commentText.textContent = text;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => {
            // The edit comment logic here
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            //The delete comment logic here
            commentList.removeChild(commentElement);
        });

        const editInput = document.createElement('input');
        editInput.classList.add('edit-input', 'hidden');
        editInput.setAttribute('type', 'text');
        editInput.setAttribute('placeholder', 'Edit your comment...');
        editInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                // The saved edited comment logic here
            }
        });

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        commentElement.appendChild(commentText);
        commentElement.appendChild(actionsDiv);
        commentElement.appendChild(editInput);

        return commentElement;
    }

    function submitComment() {
        const commentText = commentInput.value.trim();

        if (commentText !== '') {
            const commentElement = createCommentElement(commentText);
            commentList.appendChild(commentElement);
            commentInput.value = '';
        }
    }

    commentSubmitButton.addEventListener('click', submitComment);
    commentInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            submitComment();
        }
    });

    fetchDogBreeds();
});
