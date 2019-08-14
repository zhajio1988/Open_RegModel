# openreg
---
Use ORDT tools to generate register RTL, UVM register models, and docs using SystemRDL

## Directory Structure

In this repository, you will find:
  * tools -- tools used for building the reg models.
  * spec -- REG configuration option settings.
  * outdir -- generate register RTL and UVM regmodel dir.

```
├── outdir
│   └── pico_def_demo
│       └── spec
│           ├── defs
│           ├── manual
│           │   ├── hwa_wrapper_reg_c
│           │   └── openreg_reg_c
│           └── odif
├── spec
│   ├── defs   -- define file location
│   ├── manual -- *.rdl register description file location
│   └── odif
│       └── gen
└── tools
    ├── bin
    ├── etc
    └── make
```

## Using the openreg tools
   ./tools/bin/tmake 
