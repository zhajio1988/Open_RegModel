`ifdef INC_pico_dma_rd_req_structs_SVH
`else
`define INC_pico_dma_rd_req_structs_SVH

`ifndef SV_STRUCT_DEFINED_DMA_READ_REQ
`define SV_STRUCT_DEFINED_DMA_READ_REQ
typedef struct packed {
  bit [31:0] addr;
  bit [14:0] size;
} DMA_READ_REQ_struct;
`endif

`ifndef SV_STRUCT_DEFINED_pico_dma_rd_req
`define SV_STRUCT_DEFINED_pico_dma_rd_req
typedef enum {
  pico_dma_rd_req_PKT_DMA_READ_REQ,
  pico_dma_rd_req_PKT_INVALID
} pico_dma_rd_req_packets;
typedef struct packed {
  struct packed {
    bit [0:0] tag;
    union packed {
      struct packed { DMA_READ_REQ_struct pkt; } DMA_READ_REQ;
    } payload;
  } pd;
} pico_dma_rd_req_struct;
`endif

`endif // !defined(INC_pico_dma_rd_req_structs_SVH)