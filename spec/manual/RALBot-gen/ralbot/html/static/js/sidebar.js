var SBResizeState = {};
SBResizeState.old_width = 0;
SBResizeState.start_x = 0;

function init_tree() {
    var el = document.getElementById("_SBTree");
    add_tree_node(el, 0);
}

function add_tree_node(parent_el, id){
    var node = RALIndex[id];
    
    var div;
    div = document.createElement("div");
    div.id = "_SBNode" + id;
    div.dataset.id = id;
    div.className = "node";
    parent_el.appendChild(div);
    
    var icon;
    icon = document.createElement("div");
    icon.className = "node-icon";
    icon.onclick = onClickTreeFold;
    div.appendChild(icon);
    
    var link = document.createElement("a");
    link.href = "?p=" + get_path(id, null, false);
    link.className = "node-link";
    link.onclick = onClickTreeLink;
    if("dims" in node){
        var txt = node.name;
        for(var i=0; i<node.dims.length; i++) {
            txt += "[]";
        }
        link.innerHTML = txt;
    }else{
        link.innerHTML = node.name;
    }
    div.appendChild(link);
    
    if(node.children.length > 0){
        // has children
        div.classList.add("closed");
        
        var cdiv;
        cdiv = document.createElement("div");
        cdiv.className = "node-children";
        parent_el.appendChild(cdiv);
        
        for(var i=0; i<node.children.length; i++){
            add_tree_node(cdiv, node.children[i]);
        }
    } else {
        // is leaf node
        div.classList.add("leaf");
    }
}

function select_tree_node() {
    var id = CurrentID;
    // Changes the selected tree node
    var selected = document.getElementsByClassName("selected");
    for(var i=selected.length-1; i>=0; i--){
        selected[i].classList.remove("selected");
    }
    var el = document.getElementById("_SBNode" + id);
    el.classList.add("selected");
}

function open_tree_node(id) {
    var el = document.getElementById("_SBNode" + id);
    if(el.classList.contains("leaf")) return;
    
    el.classList.add("open")
    el.classList.remove("closed")
}

function close_tree_node(id) {
    var el = document.getElementById("_SBNode" + id);
    if(el.classList.contains("leaf")) return;
    
    el.classList.add("closed")
    el.classList.remove("open")
}

function expand_to_tree_node() {
    // Expand tree nodes as needed to make id visible
    var el;
    var id = CurrentID;
    
    // Expand parents as needed
    while(RALIndex[id].parent !== null) {
        id = RALIndex[id].parent;
        open_tree_node(id);
    }
}

function scroll_to_tree_node(id) {
    var node_el = document.getElementById("_SBNode" + id);
    var tree_el = document.getElementById("_SBTree");
    
    var node_rect = node_el.getBoundingClientRect();
    var tree_rect = tree_el.getBoundingClientRect();
    
    if((node_rect.top < tree_rect.top) || (node_rect.bottom > tree_rect.bottom)) {
        if(typeof node_el.scrollIntoView === "function") { 
            node_el.scrollIntoView();
        }
    }
}

function sidebar_open() {
    document.getElementById("_Sidebar").style.display = "flex";
    document.getElementById("_Overlay").style.display = "block";
}

function sidebar_close() {
    document.getElementById("_Sidebar").style.display = "none";
    document.getElementById("_Overlay").style.display = "none";
}

function onClickTreeFold(ev) {
    var el = ev.target.parentNode;
    if(el.classList.contains("leaf")) return;
    
    if(el.classList.contains("closed")){
        // Open this node
        el.classList.add("open")
        el.classList.remove("closed")
    }else{
        // Close this node
        el.classList.add("closed")
        el.classList.remove("open")
    }
}

function onClickTreeLink(ev) {
    var el = ev.target.parentNode;
    var id = parseInt(el.dataset.id);
    
    close_search();
    sidebar_close();
    
    if(id == CurrentID) return(false);
    
    if(!el.classList.contains("leaf")){
        el.classList.add("open");
        el.classList.remove("closed");
    }
    
    reset_indexes_to_next(id);
    load_page(id, function (){
        select_tree_node();
        refresh_url();
        refresh_title();
    });
    return(false);
}

function onClickTreeExpandAll() {
    var els = document.getElementsByClassName("closed");
    for(var i=els.length-1; i>=0; i--){
        els[i].classList.add("open");
        els[i].classList.remove("closed");
    }
}

function onClickTreeCollapseAll() {
    var els = document.getElementsByClassName("open");
    for(var i=els.length-1; i>=0; i--){
        els[i].classList.add("closed");
        els[i].classList.remove("open");
    }
}

function init_sb_resizer() {
    var el = document.getElementById("_SBResizer")
    el.addEventListener("mousedown", onResizeMouseDown);
}

function onResizeMouseDown(e) {
    var sb_el = document.getElementById("_SBContents");
    SBResizeState.old_width = sb_el.getBoundingClientRect().width;
    SBResizeState.start_x = e.clientX;
    window.addEventListener('mousemove', onResizeMouseMove);
    window.addEventListener('mouseup', onResizeMouseUp);
    e.preventDefault();
}

function onResizeMouseMove(e) {
    var sb_el = document.getElementById("_SBContents");
    var new_width;
    new_width = SBResizeState.old_width + e.clientX - SBResizeState.start_x;
    sb_el.style.width = new_width + "px";
}

function onResizeMouseUp(e) {
    window.removeEventListener('mousemove', onResizeMouseMove);
    window.removeEventListener('mouseup', onResizeMouseUp);
}
