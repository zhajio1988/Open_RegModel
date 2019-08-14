`ifdef INC_cmac2cacc_if_structs_SVH
`else
`define INC_cmac2cacc_if_structs_SVH

`ifndef SV_STRUCT_DEFINED_cmac2cacc_if
`define SV_STRUCT_DEFINED_cmac2cacc_if
typedef struct packed {
  bit [3:0][20:0] data;
  bit [3:0] mask;
  bit [0:0] mode;
  bit [4:0] batch_index;
  bit [0:0] stripe_st;
  bit [0:0] stripe_end;
  bit [0:0] channel_end;
  bit [0:0] layer_end;
} cmac2cacc_if_struct;
`endif

`endif // !defined(INC_cmac2cacc_if_structs_SVH)