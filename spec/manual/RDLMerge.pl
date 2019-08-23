#!/usr/bin/env perl
##################################################################################################
# File Name: RDLMerge.pl
# Description: This script is used to merge sub rdl files for submodules to a global rdl file.
##################################################################################################
use strict;
use warnings;
use File::Basename;
my @regfile_baseaddr=();
my $usr_def_property="";
my $content="";
my $first=1;
if(!@ARGV)
{
    print "#############################################\n";
    print "#\tERROR:There is no input RDL file!\n";
    print "#############################################\n";
    exit 1;
}
my $filename=$ARGV[0];
my $java_version=$ARGV[1];
my $perl_version=$ARGV[2];
my $OutDir="outdir";
$OutDir=$ARGV[3] if(defined $ARGV[3]);
if($filename!~/.*\.rdl\z/)
{
    print "#############################################\n";
    print "#\tERROR:The input file is not a RDL file!\n";
    print "#############################################\n";
    exit 1;
}
open FILE,'<',$filename or die "Cannot open \"$filename\": $!";
while(<FILE>)
{
    next unless /^\s*import\s+(.+?)\s*$/;
    my $sub_filename = $1;
    open my $fh,'<',$sub_filename or die $!;
    my $sub_file_prefix=basename($sub_filename);
    $sub_file_prefix = (split /\./,$sub_file_prefix)[0];
    #generate backends for sub rdl.
    #system("$java_version -jar Ordt.jar -parms openreg.parms -xml $OutDir/$sub_file_prefix.xml -verilog $OutDir/${sub_file_prefix}_reg.v -vbench $OutDir/${sub_file_prefix}_reg_tb.v -uvmregspkg $OutDir/ordt_uvm_reg_pkg.sv -uvmregs $OutDir/${sub_file_prefix}_reg.sv -cppmod $OutDir/${sub_file_prefix}_reg_c $sub_filename") == 0 or die $!;
    system("$perl_version RDL_prepro.pl $sub_filename") == 0 or die $!;    
    system("$java_version -jar Ordt.jar -parms openreg.parms -verilog $OutDir/${sub_file_prefix}_reg.v -uvmregs $OutDir/${sub_file_prefix}_uvm_reg.sv $sub_filename.pp.final") == 0 or die $!;
    system("rm $sub_filename.pp.final");
    system("python3 RALBot-gen/ralbotgen.py -o $OutDir/${sub_file_prefix} -header all -uvmregs -doc $sub_filename");
    system("sed -i '1,6d' $OutDir/${sub_file_prefix}_reg.v; sed -i '1,5d' $OutDir/${sub_file_prefix}_uvm_reg.sv");
    # TODO
    #system("$perl_version   ORDT_xml2others.pl -c -v -py -f $OutDir/$sub_file_prefix.xml -o $OutDir") == 0 or die $!;
    my $usr_def_flag=1;
    my $end_flag=0;
    while(<$fh>)
    {
        if(/\A\s*regfile\s+regs_(.*?)\s*{\s+\z/)
        {
            $usr_def_flag=0; 
        }elsif(/\A\s*addrmap\s*{\s+\z/)
        {
            $end_flag=1;
        }elsif(/\A\s*regs_.+?\s+.+\s*\@.*?\s*;\s+\z/)
        {
            push @regfile_baseaddr,"$_" if($end_flag);
        }
        if($usr_def_flag && $first)
        {
            $usr_def_property.=$_;
            next;
        }
        if(!$usr_def_flag && !$end_flag)
        {
            $content.=$_;
            next;
        } 
    }
    close $fh;
    $first=0;
}
close FILE;
open FILE,'>',"$OutDir/openreg.rdl" or die $!;
print FILE $usr_def_property;
print FILE $content;
print FILE "addrmap  {\n";
foreach my $regfile(@regfile_baseaddr){
    print FILE "$regfile";
}
print FILE "}addrmap_PICO;";
close FILE;

#generate backends for global rdl.
#system("$java_version -jar Ordt.jar -parms openreg.parms -xml $OutDir/openreg.xml -verilog $OutDir/openreg_reg.v -vbench $OutDir/openreg_reg_tb.v -uvmregs $OutDir/openreg_reg.sv -cppmod $OutDir/openreg_reg_c $OutDir/openreg.rdl") == 0 or die $!;
system("$perl_version RDL_prepro.pl $OutDir/openreg.rdl") == 0 or die $!;    
system("$java_version -jar Ordt.jar -parms openreg.parms -verilog $OutDir/openreg_reg.v -uvmregs $OutDir/openreg_uvm_reg.sv $OutDir/openreg.rdl.pp.final") == 0 or die $!;
system("rm $OutDir/openreg.rdl.pp.final");
# TODO
#system("python3 RALBot-gen/ralbotgen.py -o $OutDir/openreg_reg -header all -uvmregs -doc $OutDir/openreg.rdl");
system("sed -i '1,6d' $OutDir/openreg_reg.v; sed -i '1,5d' $OutDir/openreg_uvm_reg.sv");

# TODO
#system("$perl_version   ORDT_xml2others.pl -c -v -py -u -f $OutDir/openreg.xml -o $OutDir") == 0 or die $!; 
