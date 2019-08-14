#if !defined(_csc2cmac_data_if_iface_H_)
#define _csc2cmac_data_if_iface_H_

#include <stdint.h>
typedef struct csc2cmac_data_if_s {
    sc_int<5> batch_index ;
    sc_int<1> stripe_st ;
    sc_int<1> stripe_end ;
    sc_int<1> channel_end ;
    sc_int<1> layer_end ;
    sc_int<32> mask ;
    sc_int<8> data[32] ;
} csc2cmac_data_if_t;

#endif // !defined(_csc2cmac_data_if_iface_H_)
