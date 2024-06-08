// function openTab(evt, tabName) {
//     var i, tabContent, tabBtns;
    
//     // Hide all tab content
//     tabContent = document.getElementsByClassName("tab-pane");
//     for (i = 0; i < tabContent.length; i++) {
//         tabContent[i].style.display = "none";
//     }
    
//     // Deactivate all tab buttons
//     tabBtns = document.getElementsByClassName("tab-btn");
//     for (i = 0; i < tabBtns.length; i++) {
//         tabBtns[i].classList.remove("active");
//     }
    
//     // Show the selected tab content
//     document.getElementById(tabName).style.display = "block";
    
//     // Activate the clicked tab button
//     evt.currentTarget.classList.add("active");
// }

// // Delete button from Table
// document.addEventListener('DOMContentLoaded', () => {
//     const deleteButtons = document.querySelectorAll('.delete-btn');
//     deleteButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const id = button.getAttribute('data-id');
//             deleteChat(id);
//         });
//     });
// });
// document.addEventListener("DOMContentLoaded", function() {
//     // Get the cancel button element
//     const cancelButton = document.getElementById("cancelbtn");

//     // Add click event listener to the cancel button
//     cancelButton.addEventListener("click", function(event) {
//         event.preventDefault(); // Prevent the default behavior of the button (e.g., form submission)

//         // Get the form element
//         const form = document.getElementById("saveForm"); // Replace "yourFormId" with the actual ID of your form

//         // Reset the form fields
//         form.reset(); // This will clear all the input fields in the form

//         // Optionally, you can perform additional actions such as hiding the form or resetting specific fields
//     });
// });
// document.addEventListener("DOMContentLoaded", function() {
//     // Get the exit button element
//     const exitButton = document.getElementById("exitButton");

//     // Add click event listener to the exit button
//     exitButton.addEventListener("click", function(event) {
//         event.preventDefault(); // Prevent the default behavior of the button (e.g., form submission)

//         // Redirect the user to the home page
//         window.location.href = "http://localhost:8080/Home?username=<%= username %>"; // Replace with the URL of your home page
//     });
// });

// Function to handle tab switching

// Call fetchNextCode when the page loads to get the next code value
document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch the next code for a given table
    function fetchNextCode(tableName) {
        fetch(`/nextCode?tableName=${tableName}`)
            .then(response => response.json())
            .then(data => {
                const nextCode = data.nextCode;
                document.getElementById('code').value = nextCode;
            })
            .catch(error => console.error('Error fetching next code:', error));
    }

    // Fetch next code for the castCodes table on page load
    fetchNextCode('castCodes');
    fetchNextCode('branchCodes');
    fetchNextCode('sectCodes');
    fetchNextCode('gradCodes');
    // Function to open a tab and fetch next code if "Add new" tab is clicked
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

        // Fetch next code if "Add new" tab is clicked
        if (tabName === 'tab1') {
            fetchNextCode('castCodes');
        }
    }

    // Attach the openTab function to the global scope
    window.openTab = openTab;

    // Add event listener to tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.currentTarget.getAttribute('data-bs-target').substring(1);
            openTab(event, target);
        });
    });

    // Event listener for cancel button
    const cancelButton = document.getElementById("cancelbtn");
    cancelButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default behavior of the button (e.g., form submission)
        const form = document.getElementById("saveForm"); // Replace "yourFormId" with the actual ID of your form
        form.reset(); // This will clear all the input fields in the form
    });

    // Event listener for exit button
    const exitButton = document.getElementById("exitButton");
    exitButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default behavior of the button (e.g., form submission)
        // Redirect the user to the home page
        window.location.href = "http://localhost:8080/Home"; // Replace with the URL of your home page
    });

    // Event listeners for delete buttons in the table
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            deleteChat(id); // Define the deleteChat function accordingly
        });
    });
});
// Example starter JavaScript for disabling form submissions if there are invalid fields
( () => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

  $(document).ready(function(){
    $('#joining-date').datepicker({
        format: 'yyyy-mm-dd', // You can change the date format as per your requirement
        autoclose: true
    });

    $('#permanent-date').datepicker({
        format: 'yyyy-mm-dd', // You can change the date format as per your requirement
        autoclose: true
    });

    $('#birthdate').datepicker({
        format: 'yyyy-mm-dd', // You can change the date format as per your requirement
        autoclose: true
    });
});
// General function to validate input against a given regex
function validateName() {
    const nameInput = document.getElementById('name');
    const nameValue = nameInput.value;
    const regex = /^[a-zA-Z\s]+$/; // Regular expression to match only letters and spaces

    if (!regex.test(nameValue)) {
        alert('Invalid name. Only letters and spaces are allowed.');
        return false;
    }
    return true;
}

// Attach the validateName function to the form's submit event
document.getElementById('saveForm').addEventListener('submit', function(event) {
    if (!validateName()) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
});
