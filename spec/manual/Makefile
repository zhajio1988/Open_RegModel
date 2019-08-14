DEPTH := ../..
include $(DEPTH)/tools/make/common.make
# the output dir
OUT_DIR := $(TOT)/$(OUTDIR)/$(PROJECT)/$(REL_PATH_FROM_TOT)
MODULES := hwa_wrapper
MODULES += pico
RDL_FILES := $(MODULES:%=%.rdl)

VCP_OUT_FILES := $(addprefix $(OUT_DIR)/,$(RDL_FILES))
# Make Rules
default: $(VCP_OUT_FILES) OUT_FILES 
	@echo "=============================================="
	@echo "files are generated under $(OUT_DIR)"
	@echo "=============================================="

$(VCP_OUT_FILES) : $(OUT_DIR)/% : % $(PROJ_HEAD) $(VCP) 
ifeq (,$(wildcard $(OUT_DIR)))
	@mkdir -p $(OUT_DIR)
endif
	$(VCP) -i $< -o $@ -imacros $(PROJ_HEAD) -cpp $(CPP)

.phony OUT_FILES: $(PATH_SPEC_MANUAL)/RDLMerge.pl $(OUT_DIR)/pico.rdl $(RDL_FILES) Makefile
	$(AT)$(PERL) $(PATH_SPEC_MANUAL)/RDLMerge.pl $(OUT_DIR)/pico.rdl $(JAVA) $(PERL) $(OUT_DIR)

# ======================
.PHONE: clean
clean:
	rm $(OUT_DIR) -rf
