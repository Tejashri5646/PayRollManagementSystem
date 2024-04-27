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

