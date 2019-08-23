
function init_radix_buttons(){
    for(var i=0; i<RALIndex[CurrentID].fields.length; i++){
        var el = document.getElementById("_RadixButton" + RALIndex[CurrentID].fields[i].name);
        el.innerHTML = RALIndex[CurrentID].fields[i].disp;
    }
}

function reset_field_inputs(){
    for(var i=0; i<RALIndex[CurrentID].fields.length; i++){
        var el = document.getElementById("_FieldValueTester" + RALIndex[CurrentID].fields[i].name);
        el.value = format_field_value(i, RALIndex[CurrentID].fields[i].reset);
    }
    update_reg_value_tester();
}

function update_field_value_testers(){
    // Update all the field tester inputs based on the register input
    for(var i=0; i<RALIndex[CurrentID].fields.length; i++){
        update_field_value_tester(i);
    }
    userHooks.onRegValueEditorChange();
}

function update_reg_value_tester(){
    // Update the register tester input based on all of the individual field inputs
    var reg_value = bigInt(0);
    for(var i=0; i<RALIndex[CurrentID].fields.length; i++){
        var msb = RALIndex[CurrentID].fields[i].msb;
        var lsb = RALIndex[CurrentID].fields[i].lsb;
        var el = document.getElementById("_FieldValueTester" + RALIndex[CurrentID].fields[i].name);
        var value = toBigInt(el.value);
        var mask = bigInt(1).shiftLeft(msb - lsb + 1).subtract(1);
        value = value.and(mask);
        reg_value = reg_value.add(value.shiftLeft(lsb));
    }
    var reg_el = document.getElementById("_RegValueTester");
    reg_el.value = "0x" + reg_value.toString(16);
    userHooks.onRegValueEditorChange();
}

function update_field_value_tester(idx){
    var reg_el = document.getElementById("_RegValueTester");
    var reg_value = toBigInt(reg_el.value);

    var msb = RALIndex[CurrentID].fields[idx].msb;
    var lsb = RALIndex[CurrentID].fields[idx].lsb;
    var value = reg_value.shiftRight(lsb);
    var mask = bigInt(1).shiftLeft(msb - lsb + 1).subtract(1);
    value = value.and(mask);
    var el = document.getElementById("_FieldValueTester" + RALIndex[CurrentID].fields[idx].name);
    el.value = format_field_value(idx, value);
}

function format_field_value(idx, value) {
    if(RALIndex[CurrentID].fields[idx].disp == "H"){
        return("0x" + value.toString(16));
    } else {
        return(value.toString());
    }
}

//==============================================================================
// Events
//==============================================================================

function onRadixSwitch(el){
    var idx = lookup_field_idx(el.dataset.name);
    var d = RALIndex[CurrentID].fields[idx].disp;
    if(d == "H") {
        d = "D";
    } else {
        d = "H";
    }

    el.innerHTML = d;
    RALIndex[CurrentID].fields[idx].disp = d;
    update_field_value_tester(idx);
}

function onDecodedFieldInput(el){
    var idx = lookup_field_idx(el.dataset.name);
    var msb = RALIndex[CurrentID].fields[idx].msb;
    var lsb = RALIndex[CurrentID].fields[idx].lsb;
    var value;

    try {
        value = toBigInt(el.value);
    } catch(error) {
        value = bigInt(-1);
    }

    var max_value = bigInt(1).shiftLeft(msb - lsb + 1);
    if(value.lt(0) || (value.geq(max_value))){
        if(!el.classList.contains("invalid")) el.classList.add("invalid");
        return;
    }
    el.classList.remove("invalid");
    update_reg_value_tester();
}

function onEncodedRegInput(el){
    var value;
    try {
        value = toBigInt(el.value);
    } catch(error) {
        value = bigInt(-1);
    }

    if(value.lt(0)){
        if(!el.classList.contains("invalid")) el.classList.add("invalid");
        return;
    }
    el.classList.remove("invalid");
    update_field_value_testers();
}
