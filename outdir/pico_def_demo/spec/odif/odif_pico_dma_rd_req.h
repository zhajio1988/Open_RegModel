#if !defined(_pico_dma_rd_req_iface_H_)
#define _pico_dma_rd_req_iface_H_

#include <stdint.h>
#ifndef _DMA_READ_REQ_struct_H_
#define _DMA_READ_REQ_struct_H_

typedef struct DMA_READ_REQ_s {
    sc_int<32> addr ;
    sc_int<15> size ;
} DMA_READ_REQ_t;

#endif
union pico_dma_rd_req_u {
    sc_int<1> tag;
    DMA_READ_REQ_t DMA_READ_REQ;
};
typedef struct pico_dma_rd_req_s {
    union pico_dma_rd_req_u pd ;
} pico_dma_rd_req_t;

#endif // !defined(_pico_dma_rd_req_iface_H_)
