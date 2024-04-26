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
