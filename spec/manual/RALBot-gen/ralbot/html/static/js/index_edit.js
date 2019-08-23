var IndexEditState = {};
IndexEditState.active = false;
IndexEditState.id = 0;
IndexEditState.dim = 0;

function init_index_edit(){
    
    // Register index edit modal events:
    // ... close if clicking off of it
    window.onclick = function(ev) {
        var modal_el = document.getElementById('_IdxEditModal');
        if(!(isDescendant(modal_el, ev.target) || modal_el==ev.target)){
            exitIndexEditModal();
        }
    };
    // ... close if press enter in input. Cancel if esc
    document.getElementById('_IdxEditInput').onkeypress = onIndexEditKeypress;
}

function onIndexEditKeypress(ev){
    if(!ev) ev = window.event;
    var keyCode = ev.keyCode || ev.which;
    
    if(keyCode == 13){ // Enter key
        exitIndexEditModal();
        return false;
    } else if(keyCode == 27){ // ESC
        // Exit and cancel modal
        exitIndexEditModal(true);
        return false;
    }
}

function exitIndexEditModal(cancel) {
    if(typeof cancel === "undefined") cancel = false;
    
    var modal_el = document.getElementById('_IdxEditModal');
    var input_el = document.getElementById('_IdxEditInput');
    
    if(IndexEditState.active){
        modal_el.style.display = "none";
        IndexEditState.active = false;
        
        if(!cancel){
            // Commit modal input value
            var val = Number(input_el.value);
            if(!isPositiveInteger(val)) return;
            if((val < 0) || (val >= RALIndex[IndexEditState.id].dims[IndexEditState.dim])) return;
            RALIndex[IndexEditState.id].idxs[IndexEditState.dim] = val;
            
            update_crumbtrail();
            update_rdlfc_indexes();
            patch_url_path();
            update_absolute_addr(get_absolute_addr(CurrentID));
            userHooks.onAddressUpdate();
        }
    }
}

function onClickCrumbtrailIdx(ev) {
    ev.stopPropagation();
    if(IndexEditState.active){
        // Exit previous modal box
        exitIndexEditModal();
    }
    
    var modal_el = document.getElementById('_IdxEditModal');
    var input_el = document.getElementById('_IdxEditInput');
    var range_el = document.getElementById('_IdxEditRange');
    
    // Show Modal
    modal_el.style.display = "block";
    var rect = ev.target.getBoundingClientRect();
    modal_el.style.left = (rect.left + rect.right)/2 - modal_el.offsetWidth/2 + "px";
    modal_el.style.top = rect.bottom + 10 + "px";
    
    // Initialize modal
    IndexEditState.active = true;
    var sid, sdim;
    IndexEditState.id = parseInt(ev.target.dataset.id);
    IndexEditState.dim = parseInt(ev.target.dataset.dim);
    input_el.value = RALIndex[IndexEditState.id].idxs[IndexEditState.dim];
    range_el.innerHTML = "0-" + (RALIndex[IndexEditState.id].dims[IndexEditState.dim]-1);

    input_el.focus();
    input_el.select();
    
    return(false);
}
