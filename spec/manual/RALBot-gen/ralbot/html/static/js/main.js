var CurrentID;

//==============================================================================
// User-overridable hooks
//==============================================================================
var userHooks = {
    // Triggered when page is loaded the first time
    onPageLoad: function() {
    },

    // Triggered when main pane is loaded with new content and page finished
    // updating
    onContentLoad: function() {
    },

    // Triggered when page's absolute address was updated due to an index-edit
    // value change
    onAddressUpdate: function() {
    },

    // Triggered when any of the register's encoded or decoded value form fields
    // were changed
    onRegValueEditorChange: function() {
    }
};

//==============================================================================
// Page actions
//==============================================================================

function onPageLoad() {
    if(test_browser_incompatible()) {
        show_incompatibility_nag();
        return;
    }
    
    window.onpopstate = onPopState;
    window.onkeydown = onKeyDownMain;
    init_tree();
    init_sb_resizer();
    load_page_via_url();
    init_index_edit();
    userHooks.onPageLoad();
}

function onKeyDownMain(ev) {
    if(!ev) ev = window.event;

    if(!SearchState.active && ev.key == "/"){
        open_search();
        return false;
    }
}

function show_file_protocol_nag() {
    var el = document.getElementById("_ContentContainer");
    el.innerHTML
    = "<h1>Oops!</h1>"
    + "<p>Your browser's security policy prevents this page from loading properly when using the 'file://' protocol.</p>"
    + "<p>If possible, host this page on a web server and access using the 'http://' protocol.</p>"

    + "<h2>Other workarounds</h2>"

    + "<h3>Firefox</h3>"
    + "<p>"
    + "Change your Firefox security settings:"
    + "<ol>"
    + "    <li>In your address bar, type <code>about:config</code></li>"
    + "    <li>Set <code>privacy.file_unique_origin</code> to <code>false</code></li>"
    + "</ol>"
    + "For more details, see: <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp' target='_blank'>Reason: CORS request not HTTP</a>"
    + "</p>"

    + "<h3>Chrome</h3>"
    + "<p>"
    + "Launch your Chrome session using the <code>--allow-file-access-from-files</code> command line switch"
    + "</p>"

    + "<h3>Python http server</h3>"
    + "<p>"
    + "Host using a temporary Python http server:"
    + "<pre>python -m http.server</pre>"
    + "</p>"
    ;
}

function show_incompatibility_nag() {
    var el = document.getElementById("_ContentContainer");
    el.innerHTML
    = "<h1>Nope!</h1>"
    + "<p>It looks like the browser you are using is not supported.</p>"
    + "<p>Please use a modern browser such as "
    + "<a href='https://www.mozilla.org/en-US/firefox' target='_blank'>Firefox</a>"
    + " or <a href='https://www.google.com/chrome/' target='_blank'>Chrome</a>.</p>"
    ;
}

function test_browser_incompatible() {
    // Test for browser features that absolutely have to exist
    try {
        var url = new URL(window.location.href);
    } catch(error) {
        return true;
    }
    return false;
}

function update_crumbtrail(){
    var crumb_el = document.getElementById("_Crumbtrail");
    var id = CurrentID;
    
    // Delete old crumbtrail
    while (crumb_el.hasChildNodes()) {
        crumb_el.removeChild(crumb_el.lastChild);
    }
    
    var path_ids = get_ids_in_path(id);
    
    for(var i=0; i<path_ids.length; i++){
        if(i < path_ids.length-1){
            var link = document.createElement("a");
            link.dataset.id = path_ids[i];
            link.href = "?p=" + get_path(path_ids[i]);
            link.innerHTML = RALIndex[path_ids[i]].name;
            link.onclick = onClickNodeLink;
            crumb_el.appendChild(link);
        } else {
            var el = document.createElement("span");
            el.innerHTML = RALIndex[path_ids[i]].name;
            crumb_el.appendChild(el);
        }

        if("dims" in RALIndex[path_ids[i]]){
            for(var dim=0; dim<RALIndex[path_ids[i]].dims.length; dim++){
                var el = document.createElement("span");
                el.dataset.id = path_ids[i];
                el.dataset.dim = dim;
                el.className = "crumb-idx";
                el.onclick = onClickCrumbtrailIdx;
                el.innerHTML = "[" + RALIndex[path_ids[i]].idxs[dim] + "]";
                crumb_el.appendChild(el);
            }
        }
        
        if(i < path_ids.length-1){
            var el = document.createElement("span");
            el.className = "crumb-separator";
            el.innerHTML = ".";
            crumb_el.appendChild(el);
        }
    }
}

function update_absolute_addr(addr){
    document.getElementById("_AbsAddr").innerHTML = "0x" + addr.toString(16);
}

function update_rdlfc_indexes() {
    var index_els = document.getElementsByClassName("rdlfc-index")
    var index_text = "";
    if("dims" in RALIndex[CurrentID]){
        for(var i=0; i<RALIndex[CurrentID].idxs.length; i++){
            index_text += "[" + RALIndex[CurrentID].idxs[i] + "]";
        }
    }
    for(var i=0; i<index_els.length; i++){
        index_els[i].innerHTML = index_text;
    }
    
    var index_els = document.getElementsByClassName("rdlfc-index_parent")
    var index_text = "";
    var id = RALIndex[CurrentID].parent;
    if(id != null){
        if("dims" in RALIndex[id]){
            for(var i=0; i<RALIndex[id].idxs.length; i++){
                index_text += "[" + RALIndex[id].idxs[i] + "]";
            }
        }
    }
    for(var i=0; i<index_els.length; i++){
        index_els[i].innerHTML = index_text;
    }
}

//==============================================================================
// Misc
//==============================================================================

function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return(true);
        }
        node = node.parentNode;
    }
    return(false);
}

function toBigInt(str) {
    // bigInt doesn't handle large hex strings if they use the 0x prefix
    // Wrap auto-base handling
    str = str.trim().toLowerCase();
    if(str.startsWith("0x")) {
        return(bigInt(str.substring(2), 16));
    } else if(str.startsWith("0o")) {
        return(bigInt(str.substring(2), 8));
    } else if(str.startsWith("0b")) {
        return(bigInt(str.substring(2), 2));
    } else {
        return(bigInt(str));
    }
}

//==============================================================================
// Compatibility Workarounds
//==============================================================================
// IE does not support Number.isInteger
function isPositiveInteger(num) {
    return ((num ^ 0) >>> 0) === num;
}

// IE does not support <string>.startsWith
if(!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}
