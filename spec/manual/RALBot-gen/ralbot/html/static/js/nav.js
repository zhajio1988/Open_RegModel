
function load_page(id, done_callback) {
    // Clears and populates the main div with content/{id}.html's content

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        var main_el = document.getElementById("_ContentContainer");
        if (this.readyState == 4 && (this.status == 200 || this.status == 0 && this.responseText)) {
            // Page loaded successfully
            CurrentID = id;
            update_crumbtrail();
            
            main_el.innerHTML = this.responseText;
            update_absolute_addr(get_absolute_addr(id));
            update_rdlfc_indexes();
            if(is_register(id)) {
                reset_field_inputs();
                init_radix_buttons();
            }
            if(typeof done_callback !== "undefined") done_callback();
            userHooks.onContentLoad();

        } else {
            // Page load failed
            if(window.location.protocol == "file:"){
                show_file_protocol_nag();
            }
        }
    };
    
    
    try {
        xhttp.open("GET", "content/" + id + ".html", true);
        xhttp.send();
    } catch(error) {
        if(window.location.protocol == "file:"){
            show_file_protocol_nag();
        }
    }
}

function load_page_via_url(){
    // An event triggered such that the page should be loaded based on the URL
    var prev_id = CurrentID;

    var url = new URL(window.location.href);
    var path = url.searchParams.get("p", path);
    if(path == null){
        // No path specified. Default to root node
        CurrentID = 0;
    } else {
        // URL contains a hier path
        var parsed_path = parse_path(path);
        var new_path;
        if(parsed_path == null) {
            // Bad path. Discard it
            new_path = "";
            CurrentID = 0;
        } else {
            // Path is good.
            var id, idx_stack;
            id = parsed_path[0];
            idx_stack = parsed_path[1];
            apply_idx_stack(id, idx_stack);
            
            // Recompute the path in case it needs to be cleaned up
            new_path = get_path(id);
            CurrentID = id;
        }
        
        if(path != new_path){
            // Path was sanitized. Patch URL
            url.searchParams.set("p", new_path);
            window.history.replaceState({}, "", url.toString())
        }
    }
    if(prev_id != CurrentID) {
        load_page(CurrentID, function () {
            select_tree_node();
            expand_to_tree_node();
            open_tree_node(CurrentID);
            scroll_to_tree_node(CurrentID);
            refresh_title();
            refresh_target_scroll();
        });
    } else {
        refresh_target_scroll();
    }
}

function onClickNodeLink(ev) {
    var el = ev.target;
    var id = parseInt(el.dataset.id);
    if(id == CurrentID) return(false);
    
    reset_indexes_to_next(id);
    load_page(id, function () {
        select_tree_node();
        expand_to_tree_node();
        open_tree_node(id);
        scroll_to_tree_node(id);
        refresh_url();
        refresh_title();
    });
    
    return(false);
}

function refresh_url(hash) {
    // Given current state, refresh the URL
    if(typeof hash === "undefined") hash = "";
    var path = get_path(CurrentID);

    var url = new URL(window.location.href);
    url.searchParams.set("p", path);
    url.hash = hash;
    window.history.pushState({}, "", url.toString())
}

function patch_url_path() {
    // refresh only the URL's hier path without affecting history
    var path = get_path(CurrentID);
    var url = new URL(window.location.href);
    url.searchParams.set("p", path);
    window.history.replaceState({}, "", url.toString())
}

function refresh_title() {
    // Given current state, refresh the page title text
    document.title = RALIndex[CurrentID].name + " \u2014 " + PageInfo.title;
}

function onPopState(event) {
    load_page_via_url();
}

function refresh_target_scroll() {
    // Manually implement scroll to hash targets since AJAX-based page loads
    // make the normal mechanism a little unreliable

    // Clear any target-highlight elements
    var target_els = document.getElementsByClassName("target-highlight");
    for(var i=target_els.length-1; i>=0; i--){
        target_els[i].classList.remove("target-highlight");
    }
    
    if(window.location.hash){
        // URL has hash! Scroll to it and apply highlight class
        var el = document.getElementById(window.location.hash.slice(1));
        if(el){
            el.scrollIntoView();
            el.classList.add("target-highlight");
        }

    } else {
        document.getElementById("_Content").parentElement.scrollTop = 0;
    }
}
