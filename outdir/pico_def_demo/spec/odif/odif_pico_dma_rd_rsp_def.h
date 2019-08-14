#if !defined(_pico_dma_rd_rsp_IFACE)
#define _pico_dma_rd_rsp_IFACE

#define PKT_DMA_READ_RSP_data_WIDTH 64
#define PKT_DMA_READ_RSP_data_LSB 0
#define PKT_DMA_READ_RSP_data_MSB 63
#define PKT_DMA_READ_RSP_data_FIELD 63:0
#define PKT_DMA_READ_RSP_mask_WIDTH 1
#define PKT_DMA_READ_RSP_mask_LSB 64
#define PKT_DMA_READ_RSP_mask_MSB 64
#define PKT_DMA_READ_RSP_mask_FIELD 64:64
#define PKT_DMA_READ_RSP_WIDTH 65

#define FLOW_pico_dma_rd_rsp valid_ready

#define SIG_pico_dma_rd_rsp_PD_WIDTH 66
#define SIG_pico_dma_rd_rsp_PD_FIELD 65:0

#define PKT_pico_dma_rd_rsp_PAYLOAD_WIDTH    65
#define PKT_pico_dma_rd_rsp_PAYLOAD_FIELD    64:0
#define PKT_pico_dma_rd_rsp_ID_WIDTH    1
#define PKT_pico_dma_rd_rsp_ID_FIELD    65:65
#define PKT_pico_dma_rd_rsp_DMA_READ_RSP_FIELD    64:0
#define PKT_pico_dma_rd_rsp_DMA_READ_RSP_ID       1'd0
#define PKT_pico_dma_rd_rsp_DMA_READ_RSP_int_ID   0

#endif // !defined(_pico_dma_rd_rsp_IFACE)
