#if !defined(_pico_dma_wr_rsp_iface_H_)
#define _pico_dma_wr_rsp_iface_H_

#include <stdint.h>
typedef struct pico_dma_wr_rsp_s {
    sc_int<1> complete ;
} pico_dma_wr_rsp_t;

#endif // !defined(_pico_dma_wr_rsp_iface_H_)
