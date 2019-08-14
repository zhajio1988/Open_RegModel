`ifdef INC_cacc2sdp_if_structs_SVH
`else
`define INC_cacc2sdp_if_structs_SVH

`ifndef SV_STRUCT_DEFINED_cacc2sdp_if
`define SV_STRUCT_DEFINED_cacc2sdp_if
typedef struct packed {
  bit [31:0] pd;
  bit [0:0] pd_batch_end;
  bit [0:0] pd_layer_end;
} cacc2sdp_if_struct;
`endif

`endif // !defined(INC_cacc2sdp_if_structs_SVH)