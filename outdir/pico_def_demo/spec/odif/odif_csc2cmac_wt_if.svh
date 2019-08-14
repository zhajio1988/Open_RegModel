`ifdef INC_csc2cmac_wt_if_structs_SVH
`else
`define INC_csc2cmac_wt_if_structs_SVH

`ifndef SV_STRUCT_DEFINED_csc2cmac_wt_if
`define SV_STRUCT_DEFINED_csc2cmac_wt_if
typedef struct packed {
  bit [31:0][7:0] data;
  bit [31:0] mask;
  bit [3:0] sel;
} csc2cmac_wt_if_struct;
`endif

`endif // !defined(INC_csc2cmac_wt_if_structs_SVH)