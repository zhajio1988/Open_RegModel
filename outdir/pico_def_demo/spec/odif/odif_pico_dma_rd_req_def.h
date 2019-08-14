#if !defined(_pico_dma_rd_req_IFACE)
#define _pico_dma_rd_req_IFACE

#define PKT_DMA_READ_REQ_addr_WIDTH 32
#define PKT_DMA_READ_REQ_addr_LSB 0
#define PKT_DMA_READ_REQ_addr_MSB 31
#define PKT_DMA_READ_REQ_addr_FIELD 31:0
#define PKT_DMA_READ_REQ_size_WIDTH 15
#define PKT_DMA_READ_REQ_size_LSB 32
#define PKT_DMA_READ_REQ_size_MSB 46
#define PKT_DMA_READ_REQ_size_FIELD 46:32
#define PKT_DMA_READ_REQ_WIDTH 47

#define FLOW_pico_dma_rd_req valid_ready

#define SIG_pico_dma_rd_req_PD_WIDTH 48
#define SIG_pico_dma_rd_req_PD_FIELD 47:0

#define PKT_pico_dma_rd_req_PAYLOAD_WIDTH    47
#define PKT_pico_dma_rd_req_PAYLOAD_FIELD    46:0
#define PKT_pico_dma_rd_req_ID_WIDTH    1
#define PKT_pico_dma_rd_req_ID_FIELD    47:47
#define PKT_pico_dma_rd_req_DMA_READ_REQ_FIELD    46:0
#define PKT_pico_dma_rd_req_DMA_READ_REQ_ID       1'd0
#define PKT_pico_dma_rd_req_DMA_READ_REQ_int_ID   0

#endif // !defined(_pico_dma_rd_req_IFACE)
