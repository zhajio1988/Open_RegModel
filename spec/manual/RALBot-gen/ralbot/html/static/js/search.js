
var SearchState = {};
SearchState.active = false;
SearchState.query_sn = 0; // Sequence number of the current query
SearchState.query_keywords = [];
SearchState.query_start_id = 0;
SearchState.results = [];
SearchState.selected_result = null;

// Number of nodes to test per search iteration
var SEARCH_CHOMP_SIZE = 100;

function onSearchButtonClick() {
    if(SearchState.active){
        // Close search
        close_search();
    } else {
        // Open search
        open_search();
    }
}

function open_search(){
    document.getElementById("_SearchBar").style.display = "block";
    document.getElementById("_Search").style.display = "flex";
    document.getElementById("_Content").style.display = "none";
    document.getElementById("_SBSearchButton").classList.add("close-button");
    document.getElementById("_SBSearchButton").classList.remove("search-button");
    document.getElementById("_MobiSearchButton").classList.add("close-button");
    document.getElementById("_MobiSearchButton").classList.remove("search-button");
    SearchState.active = true;
    
    clear_search_results();
    
    var input_el = document.getElementById('_SearchInput');
    input_el.onkeydown = onSearchInputKeypress;
    input_el.oninput = onSearchInputUpdate;
    input_el.value = "";
    input_el.focus();
}

function close_search(){
    clear_search_results();
    document.getElementById("_SearchBar").style.display = "none";
    document.getElementById("_Search").style.display = "none";
    document.getElementById("_Content").style.display = "block";
    document.getElementById("_SBSearchButton").classList.add("search-button");
    document.getElementById("_SBSearchButton").classList.remove("close-button");
    document.getElementById("_MobiSearchButton").classList.add("search-button");
    document.getElementById("_MobiSearchButton").classList.remove("close-button");
    SearchState.active = false;
}

function onSearchInputKeypress(ev){
    if(!ev) ev = window.event;
    
    if(ev.key == "Enter"){
        // Open current selection
        if(SearchState.selected_result != null){
            open_search_result(SearchState.selected_result);
        } else if(SearchState.results.length == 1){
            open_search_result(0);
        }
        return false;
    } else if(ev.key == "Escape"){
        close_search();
        return false;
    } else if(ev.key == "ArrowUp"){
        // Move selection up
        if((SearchState.selected_result != null) && (SearchState.selected_result != 0)){
            SearchState.results[SearchState.selected_result].el.classList.remove("selected");
            SearchState.selected_result--;
            SearchState.results[SearchState.selected_result].el.classList.add("selected");
        }
        
        return false;
    } else if(ev.key == "ArrowDown"){
        // Move selection down
        if(SearchState.selected_result != null){
            // Selection already active
            if(SearchState.selected_result < SearchState.results.length-1){
                SearchState.results[SearchState.selected_result].el.classList.remove("selected");
                SearchState.selected_result++;
                SearchState.results[SearchState.selected_result].el.classList.add("selected");
            }
        }else if(SearchState.results.length){
            // Select first
            SearchState.selected_result = 0;
            SearchState.results[0].el.classList.add("selected");
        }
        
        return false;
    }
}

function onSearchInputUpdate(ev){
    var search_text = ev.target.value.trim().toLowerCase();
    
    if(search_text.startsWith("@")){
        clear_search_results();
        search_text = search_text.slice(1, search_text.length);
        if(search_text == "") return;

        try {
            addr = toBigInt(search_text);
        } catch(error) {
            addr = bigInt(-1);
        }
        
        if(addr.lt(0)) return;
        
        var result = lookup_by_address(addr);
        if(result != null) {
            add_search_result(
                [get_path(result[0], result[1])],
                result[0], result[1]
            );
        }
    } else {
        start_keyword_search(search_text);
    }
}

function start_keyword_search(query){
    clear_search_results();
    
    if(query.length < 2) return;
    
    // Sanitize query
    query = query.split(" ");
    SearchState.query_keywords = [];
    for(var i=0; i<query.length; i++){
        if(query[i] == "") continue;
        SearchState.query_keywords.push(query[i]);
    }
    SearchState.query_sn++;
    SearchState.query_start_id = 0;
    
    do_a_search_chomp(SearchState.query_sn);
}

function do_a_search_chomp(query_sn){
    
    // Abort if a new query was already started
    if(query_sn != SearchState.query_sn) {
        return;
    }
    
    var keywords = SearchState.query_keywords;
    var id = SearchState.query_start_id;
    var chomp_counter = SEARCH_CHOMP_SIZE;
    
    // Search each node in the index
    while(chomp_counter != 0){
        if(id >= RALIndex.length) return;
        
        var path = get_path(id, null, false);
        
        // Search regular path
        var text_segments = search_test_path(path, keywords);
        if(text_segments != null){
            add_search_result(text_segments, id);
        } else {
            // No match yet. If this node has fields, add them to the path and try that
            if("fields" in RALIndex[id]){
                for(var i=0; i<RALIndex[id].fields.length; i++){
                    var path_with_field = path + "." + RALIndex[id].fields[i].name;
                    text_segments = search_test_path(path_with_field, keywords);
                    if(text_segments != null){
                        add_search_result(text_segments, id, null, RALIndex[id].fields[i].name);
                    }
                }
            }
        }
        
        id++;
        chomp_counter--;
    }
    
    // Hit chomp limit.
    // Schedule another iteration later
    SearchState.query_start_id = id;
    setTimeout(function() {
        do_a_search_chomp(query_sn);
    }, 1);
}

function search_test_path(path, keywords){
    // If match, returns text_segments.
    // Otherwise, null
    var path_lc = path.toLowerCase();
    var text_segments = [];
    var start = 0;
    
    // Scan path to see if all keywords match
    for(var i=0; i<keywords.length; i++){
        var result = path_lc.indexOf(keywords[i], start);
        if(result < 0){
            // Did not match
            return(null);
        }
        
        // matched!
        // extract non-highlighted text before
        text_segments.push(path.slice(start, result));
        // highlighted text
        text_segments.push(path.slice(result, result + keywords[i].length));
        
        // move search start for next keyword
        start = result + keywords[i].length;
    }
    
    text_segments.push(path.slice(start, path.length));
    return(text_segments);
}

function clear_search_results(){
    var results_el = document.getElementById("_SearchResults");
    
    var range = document.createRange();
    range.selectNodeContents(results_el);
    range.deleteContents();
    
    SearchState.results = [];
    SearchState.selected_result = null;
}

function add_search_result(text_segments, id, idx_stack, anchor){
    if(typeof idx_stack === "undefined") idx_stack = null;
    if(typeof anchor === "undefined") anchor = "";
    // text_segments is an array of segments that should/shouldn't be highlighted
    // All odd segments are highlighted via <mark> tag.
    // text_segments[0] --> not highlighted
    // text_segments[1] --> highlighted
    
    var result_id = SearchState.results.length;
    var result_el = document.createElement("li");
    result_el.dataset.id = result_id;
    result_el.onclick = function() {
        open_search_result(result_id);
    };
    result_el.onmouseover = function() {
        onSearchResultMouseover(result_id)
    };
    document.getElementById("_SearchResults").appendChild(result_el);
    
    for(var i=0; i<text_segments.length; i++){
        var el;
        if(i%2){
            el = document.createElement("mark");
        }else{
            el = document.createElement("span");
        }
        el.innerHTML = text_segments[i];
        result_el.appendChild(el);
    }
    
    var result = {
        "id": id,
        "idx_stack": idx_stack,
        "el": result_el,
        "anchor": anchor
    };
    SearchState.results.push(result);
}

function onSearchResultMouseover(result_id){
    if(SearchState.selected_result == result_id) return;
    
    if(SearchState.selected_result != null){
        SearchState.results[SearchState.selected_result].el.classList.remove("selected");
    }
    SearchState.selected_result = result_id;
    SearchState.results[result_id].el.classList.add("selected");
}

function open_search_result(result_id){
    var result = SearchState.results[result_id];
    if(result.idx_stack == null){
        reset_indexes(0, result.id);
    }else{
        apply_idx_stack(result.id, result.idx_stack);
    }
    
    var hash = "";
    if(result.anchor != ""){
        hash = "#" + result.anchor;
    }

    close_search();

    load_page(result.id, function () {
        select_tree_node();
        expand_to_tree_node();
        open_tree_node(result.id);
        scroll_to_tree_node(result.id);
        refresh_url(hash);
        refresh_title();
        refresh_target_scroll();
    });
}
