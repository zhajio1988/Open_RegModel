`ifdef INC_sdp2pdp_if_structs_SVH
`else
`define INC_sdp2pdp_if_structs_SVH

`ifndef SV_STRUCT_DEFINED_sdp2pdp_if
`define SV_STRUCT_DEFINED_sdp2pdp_if
typedef struct packed {
  bit [7:0] pd;
} sdp2pdp_if_struct;
`endif

`endif // !defined(INC_sdp2pdp_if_structs_SVH)