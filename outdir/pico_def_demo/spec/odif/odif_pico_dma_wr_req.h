#if !defined(_pico_dma_wr_req_iface_H_)
#define _pico_dma_wr_req_iface_H_

#include <stdint.h>
#ifndef _DMA_WR_REQ_struct_H_
#define _DMA_WR_REQ_struct_H_

typedef struct DMA_WR_REQ_s {
    sc_int<32> addr ;
    sc_int<13> size ;
} DMA_WR_REQ_t;

#endif
#ifndef _DMA_WR_DATA_struct_H_
#define _DMA_WR_DATA_struct_H_

typedef struct DMA_WR_DATA_s {
    sc_int<64> data ;
    sc_int<1> mask ;
} DMA_WR_DATA_t;

#endif
union pico_dma_wr_req_u {
    sc_int<1> tag;
    DMA_WR_REQ_t DMA_WR_REQ;
    DMA_WR_DATA_t DMA_WR_DATA;
};
typedef struct pico_dma_wr_req_s {
    union pico_dma_wr_req_u pd ;
} pico_dma_wr_req_t;

#endif // !defined(_pico_dma_wr_req_iface_H_)
