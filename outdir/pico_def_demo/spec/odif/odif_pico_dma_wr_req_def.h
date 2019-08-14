#if !defined(_pico_dma_wr_req_IFACE)
#define _pico_dma_wr_req_IFACE

#define PKT_DMA_WR_REQ_addr_WIDTH 32
#define PKT_DMA_WR_REQ_addr_LSB 0
#define PKT_DMA_WR_REQ_addr_MSB 31
#define PKT_DMA_WR_REQ_addr_FIELD 31:0
#define PKT_DMA_WR_REQ_size_WIDTH 13
#define PKT_DMA_WR_REQ_size_LSB 32
#define PKT_DMA_WR_REQ_size_MSB 44
#define PKT_DMA_WR_REQ_size_FIELD 44:32
#define PKT_DMA_WR_REQ_WIDTH 45

#define PKT_DMA_WR_DATA_data_WIDTH 64
#define PKT_DMA_WR_DATA_data_LSB 0
#define PKT_DMA_WR_DATA_data_MSB 63
#define PKT_DMA_WR_DATA_data_FIELD 63:0
#define PKT_DMA_WR_DATA_mask_WIDTH 1
#define PKT_DMA_WR_DATA_mask_LSB 64
#define PKT_DMA_WR_DATA_mask_MSB 64
#define PKT_DMA_WR_DATA_mask_FIELD 64:64
#define PKT_DMA_WR_DATA_WIDTH 65

#define FLOW_pico_dma_wr_req valid_ready

#define SIG_pico_dma_wr_req_PD_WIDTH 66
#define SIG_pico_dma_wr_req_PD_FIELD 65:0

#define PKT_pico_dma_wr_req_PAYLOAD_WIDTH    65
#define PKT_pico_dma_wr_req_PAYLOAD_FIELD    64:0
#define PKT_pico_dma_wr_req_ID_WIDTH    1
#define PKT_pico_dma_wr_req_ID_FIELD    65:65
#define PKT_pico_dma_wr_req_DMA_WR_REQ_FIELD    44:0
#define PKT_pico_dma_wr_req_DMA_WR_REQ_ID       1'd0
#define PKT_pico_dma_wr_req_DMA_WR_REQ_int_ID   0
#define PKT_pico_dma_wr_req_DMA_WR_DATA_FIELD    64:0
#define PKT_pico_dma_wr_req_DMA_WR_DATA_ID       1'd1
#define PKT_pico_dma_wr_req_DMA_WR_DATA_int_ID   1

#endif // !defined(_pico_dma_wr_req_IFACE)
