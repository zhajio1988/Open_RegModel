
function get_common_ancestor(id1, id2) {
    var lineage1;
    var lineage2;
    
    lineage1 = get_ancestors(id1);
    lineage1.push(id1);
    
    lineage2 = get_ancestors(id2);
    lineage2.push(id2);
    
    var id = 0;
    while(lineage1.length && lineage2.length && lineage1[0] == lineage2[0]) {
        id = lineage1[0];
        lineage1.shift();
        lineage2.shift();
    }
    return(id);
}

function get_ancestors(id) {
    // Returns a list of id's ancestors
    // first in list is root of the tree
    var ancestors = [];
    while(RALIndex[id].parent !== null) {
        id = RALIndex[id].parent;
        ancestors.unshift(id);
    }
    return(ancestors);
}

function get_child(id, name){
    // get child of id that matches name
    // returns null if not found
    for(var i=0; i<RALIndex[id].children.length; i++){
        var cid = RALIndex[id].children[i];
        if(RALIndex[cid].name == name){
            return(cid);
        }
    }
    return(null);
}

function reset_indexes(from_id, to_id){
    // Reset array indexes of all nodes in range.
    // from_id is the one closest to the root
    // Does not reset the index of from_id
    var id = to_id;
    while(RALIndex[id].parent !== null) {
        if(id == from_id) break;
        if("dims" in RALIndex[id]){
            // reset idxs to all 0s
            RALIndex[id].idxs = RALIndex[id].dims.slice();
            for(var i=0; i<RALIndex[id].idxs.length; i++){
                RALIndex[id].idxs[i] = 0;
            }
        }
        
        id = RALIndex[id].parent;
    }
}

function reset_indexes_to_next(id){
    // When switching pages, make sure any array nodes that are new to the hier
    // path get their indexes reset
    var common_anc = get_common_ancestor(id, CurrentID);
    reset_indexes(common_anc, id);
}

function parse_path(path){
    // Parses the given path
    // If the path is invalid, null is returned
    // Otherwise, the following two values are returned as an array:
    //  [id, idx_stack]
    // Any invalid indexes in the path are fixed silently
    
    // Decompose the path
    var pathparts = path.split(".");
    var segments = [];
    var segment_idxs = [];
    for(var i=0; i<pathparts.length; i++){
        if(pathparts[i] == "") return(null);
        var idxs = [];
        var split_element = pathparts[i].split("[");
        segments.push(split_element.shift());
        for(var dim=0; dim<split_element.length; dim++){
            if(!split_element[dim].endsWith("]")) return(null);
            var n = Number(split_element[dim].slice(0, -1));
            if(!isPositiveInteger(n)) return(null);
            if(n<0) return(null);
            idxs.push(n);
        }
        segment_idxs.push(idxs);
    }
    
    // Validate first node
    if(segments[0] != RALIndex[0].name) return(null);
    if("dims" in RALIndex[0]){
        var sanitized_idxs = [];
        for(var dim=0; dim<RALIndex[0].dims.length; dim++){
            if(dim >= segment_idxs[0].length){
                sanitized_idxs.push(0);
            } else {
                sanitized_idxs.push(Math.min(segment_idxs[0][dim], RALIndex[0].dims[dim]-1));
            }
        }
        segment_idxs[0] = sanitized_idxs;
    } else {
        if(segment_idxs[0].length != 0) segment_idxs[0] = [];
    }
    
    // Validate the path and find the end ID
    var id=0;
    for(var i=1; i<segments.length; i++){
        // try to get the child by name
        var next_id = get_child(id, segments[i]);
        if(next_id == null) return(null);
        id = next_id;
        
        // sanitize indexes
        if("dims" in RALIndex[id]){
            var sanitized_idxs = [];
            for(var dim=0; dim<RALIndex[id].dims.length; dim++){
                if(dim >= segment_idxs[i].length){
                    sanitized_idxs.push(0);
                } else {
                    sanitized_idxs.push(Math.min(segment_idxs[i][dim], RALIndex[id].dims[dim]-1));
                }
            }
            segment_idxs[i] = sanitized_idxs;
        } else {
            if(segment_idxs[i].length != 0) segment_idxs[i] = [];
        }
    }
    
    return([id, segment_idxs]);
}

function apply_idx_stack(id, idx_stack){
    // Applies the given index stack onto the RAL
    // Assumes the indexes are valid
    for(var i=idx_stack.length-1; i>=0; i--){
        if(idx_stack[i].length){
            RALIndex[id].idxs = idx_stack[i];
        }
        id = RALIndex[id].parent;
    }
}

function get_path(id, idx_stack, show_idx){
    if(typeof idx_stack === "undefined") idx_stack = null;
    if(typeof show_idx === "undefined") show_idx = true;
    
    // Get string representation of the hierarchical path
    if(show_idx && (idx_stack == null)){
        idx_stack = get_current_idx_stack(id);
    }
    var ids = get_ids_in_path(id);
    var pathparts = [];
    for(var i=0; i<ids.length; i++){
        var segment = RALIndex[ids[i]].name;
        if(show_idx && idx_stack[i].length){
            segment += "[" + idx_stack[i] + "]";
        }
        pathparts.push(segment);
    }
    
    return(pathparts.join("."));
}

function get_ids_in_path(id){
    // Get a list of ids that represent the path
    var ids = [];
    while(id !== null) {
        ids.unshift(id);
        id = RALIndex[id].parent;
    }
    return(ids);
}

function get_current_idx_stack(id){
    var idx_stack = [];
    while(id !== null) {
        if("dims" in RALIndex[id]){
            idx_stack.unshift(RALIndex[id].idxs);
        } else {
            idx_stack.unshift([]);
        }
        id = RALIndex[id].parent;
    }
    return(idx_stack);
}

function get_addr_offset(id){
    if("dims" in RALIndex[id]){
        var flat_idx = 0;
        for(var i=0; i<RALIndex[id].idxs.length; i++){
            var sz = 1;
            for(var j=i+1; j<RALIndex[id].dims.length; j++){
                sz *= RALIndex[id].dims[j];
            }
            flat_idx += sz * RALIndex[id].idxs[i];
        }
        return(RALIndex[id].offset.add(RALIndex[id].stride.multiply(flat_idx)));
    } else {
        return(RALIndex[id].offset);
    }
}

function get_absolute_addr(id){
    if(RALIndex[id].parent != null){
        return(get_absolute_addr(RALIndex[id].parent).add(get_addr_offset(id)));
    } else {
        return(get_addr_offset(id));
    }
}

function get_total_size(id){
    // Total size of entire array of this node
    if("dims" in RALIndex[id]){
        var num_elements = 1;
        for(var i=0; i<RALIndex[id].dims.length; i++){
            num_elements *= RALIndex[id].dims[i];
        }
        return(RALIndex[id].stride.multiply(num_elements - 1).add(RALIndex[id].size));
    }else{
        return(RALIndex[id].size);
    }
}

function lookup_by_address(addr){
    // Finds the deepest RAL node that contains addr
    // If found, returns:
    //  [id, idx_stack]
    // Otherwise, returns null
    var id=0;
    var idx_stack = [];
    var iter_count = 0;
    
    if(addr.lt(RALIndex[id].offset)) return(null);
    if(addr.geq(RALIndex[id].offset.add(get_total_size(id)))) return(null);
    
    while(iter_count < 100){
        iter_count++;
        // addr is definitely inside this node
        
        // Adjust addr to be relative to this node
        addr = addr.subtract(RALIndex[id].offset);
        
        // Determine index stack entry for this node
        if("dims" in RALIndex[id]){
            var idxs = [];
            
            // First check if address lands between sparse array entries
            if(addr.mod(RALIndex[id].stride).geq(RALIndex[id].size)) {
                // missed! Give up and just return the parent node
                if(RALIndex[id].parent == null){
                    return(null);
                }else{
                    return([RALIndex[id].parent, idx_stack]);
                }
            }
            
            // index of the flattened array
            var flat_idx = addr.divide(RALIndex[id].stride).toJSNumber();
            
            // Re-construct dimensions
            for(var dim=RALIndex[id].dims.length-1; dim>=0; dim--){
                var idx;
                idx = flat_idx % RALIndex[id].dims[dim];
                flat_idx = Math.floor(flat_idx / RALIndex[id].dims[dim]);
                idxs.unshift(idx);
            }
            idx_stack.push(idxs);
            
            // Adjust addr offset to be relative to this index
            addr = addr.mod(RALIndex[id].stride);
        } else {
            idx_stack.push([]);
        }
        
        // Search this node's children to see which child 'addr' is in
        var found_match = false;
        for(var i=0; i<RALIndex[id].children.length; i++) {
            var child = RALIndex[id].children[i];
            if(addr.geq(RALIndex[child].offset) && addr.lt(RALIndex[child].offset.add(get_total_size(child)))){
                // hit!
                id = child;
                found_match = true;
                break;
            }
        }
        if(!found_match){
            // No further match. Current node is the result
            return([id, idx_stack]);
        }
    }
    
    // Hit iteration limit. Something is wrong :-(
    throw "Agh! iteration limit reached while looking up by address";
}

function is_register(id) {
    return("fields" in RALIndex[id]);
}

function lookup_field_idx(name) {
    for(var i=0; i<RALIndex[CurrentID].fields.length; i++){
        if(name == RALIndex[CurrentID].fields[i].name){
            return(i);
        }
    }
    return(-1);
}