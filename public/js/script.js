function openTab(evt, tabName) {
    var i, tabContent, tabBtns;
    
    // Hide all tab content
    tabContent = document.getElementsByClassName("tab-pane");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    
    // Deactivate all tab buttons
    tabBtns = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }
    
    // Show the selected tab content
    document.getElementById(tabName).style.display = "block";
    
    // Activate the clicked tab button
    evt.currentTarget.classList.add("active");
}

// Delete button from Table
document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            deleteChat(id);
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    // Get the cancel button element
    const cancelButton = document.getElementById("cancelbtn");

    // Add click event listener to the cancel button
    cancelButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default behavior of the button (e.g., form submission)

        // Get the form element
        const form = document.getElementById("saveForm"); // Replace "yourFormId" with the actual ID of your form

        // Reset the form fields
        form.reset(); // This will clear all the input fields in the form

        // Optionally, you can perform additional actions such as hiding the form or resetting specific fields
    });
});
document.addEventListener("DOMContentLoaded", function() {
    // Get the exit button element
    const exitButton = document.getElementById("exitButton");

    // Add click event listener to the exit button
    exitButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default behavior of the button (e.g., form submission)

        // Redirect the user to the home page
        window.location.href = "http://localhost:8080/Home?username=<%= username %>"; // Replace with the URL of your home page
    });
});

