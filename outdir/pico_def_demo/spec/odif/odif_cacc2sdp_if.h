#if !defined(_cacc2sdp_if_iface_H_)
#define _cacc2sdp_if_iface_H_

#include <stdint.h>
typedef struct cacc2sdp_if_s {
    sc_int<32> pd ;
    sc_int<1> pd_batch_end ;
    sc_int<1> pd_layer_end ;
} cacc2sdp_if_t;

#endif // !defined(_cacc2sdp_if_iface_H_)
