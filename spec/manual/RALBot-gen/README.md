# Generate uvm regmodel and C header file

## typical usage
* show help doc

    `%> python3 ralbotgen.py -h`
    
* gen header file

    `%> python3 ralbotgen.py -o output/hwa_wrapper -header all ../hwa_wrapper.rdl`

* gen uvm reg model

    `%> python3 ralbotgen.py -o output/hwa_wrapper -uvmregs ../hwa_wrapper.rdl`

* gen all can generate files

    `%> python3 ralbotgen.py -o output/hwa_wrapper -header all -uvmregs -doc ../hwa_wrapper.rdl`


## help
```
usage: ralbotgen.py [-h] [-i <dir>] [-t <addrmap>] -o <file>
                    [-header [{all,verilog,c}]] [-uvmregs] [-doc] [-verilog]
                    [-xml] [-s] [-w <warning/no-warning>] [-v] [--debug]
                    src [src ...]

positional arguments:
  src                   List of input files

optional arguments:
  -h, --help            show this help message and exit
  -i <dir>, --include-dir <dir>
                        Include search path.
  -t <addrmap>, --top <addrmap>
                        Explicitly choose which addrmap in the root namespace
                        will be the top-level component. If unset, the last
                        addrmap defined will be chosen
  -o <file>, --output <file>
                        Compile output artifact.
  -header [{all,verilog,c}]
                        generate systemverilog or C header file(default all of
                        them).
  -uvmregs              generate UVM reg model.
  -doc                  generate register html documents.
  -verilog              generate register verilog module.
  -xml                  generate IP-XACT xml file.
  -s, --skip-not-present
                        If set, compiler skips nodes whose ‘ispresent’
                        property is set to False.
  -w <warning/no-warning>
                        Enable warnings (-w warning-name) or disable (-w no-
                        warning-name)
  -v, --verbose         Enable verbose compilation status print out.
  --debug               Enable compiler debug mode (with yet more compiler
                        status print out).

```
