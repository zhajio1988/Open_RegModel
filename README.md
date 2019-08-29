# openreg
---
Use ORDT and systemRDL tools to generate C/Verilog header files, register RTL, UVM register models, and docs using SystemRDL.

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
│           │   ├── accelera-generic_example
│           │   │   └── docs
│           │   ├── hwa_wrapper
│           │   │   └── docs
│           └── odif
├── spec
│   ├── defs            -- define file location(not used in our project)
│   ├── manual          -- *.rdl register description file location
│   │   └── RALBot-gen  -- ralbotgen python scripts(used to generate header file, uvm regmodel and html doc) 
|   |
│   └── odif            -- (not used in our project)
│       └── gen
└── tools               -- build tools
    ├── bin
    ├── etc
    └── make
```

| Directory               | Name	Description        |
|---                      |---                         |
| *.h                     | C header files             |
| *.svh                   | SystemVerilog header files |
| *_uvmreg.sv/*uvm_reg.sv | UVM register model         |
| */docs                  | Html document              |
| *_reg.v                 | Register RTL file          |

## Using the openreg tools
   ./tools/bin/tmake 
