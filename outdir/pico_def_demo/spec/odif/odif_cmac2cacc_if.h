#if !defined(_cmac2cacc_if_iface_H_)
#define _cmac2cacc_if_iface_H_

#include <stdint.h>
typedef struct cmac2cacc_if_s {
    sc_int<21> data[4] ;
    sc_int<4> mask ;
    sc_int<1> mode ;
    sc_int<5> batch_index ;
    sc_int<1> stripe_st ;
    sc_int<1> stripe_end ;
    sc_int<1> channel_end ;
    sc_int<1> layer_end ;
} cmac2cacc_if_t;

#endif // !defined(_cmac2cacc_if_iface_H_)
