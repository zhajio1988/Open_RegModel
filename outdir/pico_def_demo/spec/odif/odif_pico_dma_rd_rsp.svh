`ifdef INC_pico_dma_rd_rsp_structs_SVH
`else
`define INC_pico_dma_rd_rsp_structs_SVH

`ifndef SV_STRUCT_DEFINED_DMA_READ_RSP
`define SV_STRUCT_DEFINED_DMA_READ_RSP
typedef struct packed {
  bit [63:0] data;
  bit [0:0] mask;
} DMA_READ_RSP_struct;
`endif

`ifndef SV_STRUCT_DEFINED_pico_dma_rd_rsp
`define SV_STRUCT_DEFINED_pico_dma_rd_rsp
typedef enum {
  pico_dma_rd_rsp_PKT_DMA_READ_RSP,
  pico_dma_rd_rsp_PKT_INVALID
} pico_dma_rd_rsp_packets;
typedef struct packed {
  struct packed {
    bit [0:0] tag;
    union packed {
      struct packed { DMA_READ_RSP_struct pkt; } DMA_READ_RSP;
    } payload;
  } pd;
} pico_dma_rd_rsp_struct;
`endif

`endif // !defined(INC_pico_dma_rd_rsp_structs_SVH)