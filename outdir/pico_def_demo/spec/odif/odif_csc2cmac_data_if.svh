`ifdef INC_csc2cmac_data_if_structs_SVH
`else
`define INC_csc2cmac_data_if_structs_SVH

`ifndef SV_STRUCT_DEFINED_csc2cmac_data_if
`define SV_STRUCT_DEFINED_csc2cmac_data_if
typedef struct packed {
  bit [4:0] batch_index;
  bit [0:0] stripe_st;
  bit [0:0] stripe_end;
  bit [0:0] channel_end;
  bit [0:0] layer_end;
  bit [31:0] mask;
  bit [31:0][7:0] data;
} csc2cmac_data_if_struct;
`endif

`endif // !defined(INC_csc2cmac_data_if_structs_SVH)