>     Copyright (c) 2019.           
> PICOCOMTECH®  ALL RIGHTS RESERVED 
> File: README.md
> 

Make sure you have java 1.7 or later version installed
Update variable JAVA in make/tools.mk to point to your local java installation

then you can use below command to generate ral
```
make
```

Following backends will be generated:
* **regs_v.v**: verilog model
* **regs_ral.sv**: ral class  
* **cmod**: c++ model
* **sv**: systemverilog model
