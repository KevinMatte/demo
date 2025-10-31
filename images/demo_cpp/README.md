# CPP Demo

## Notes

* Using Qt Creator for debugging.
* The Makefile run's cmake to generate the cmake_build directory.
* Find only source files:
```shell
find . \
    \( \
       \( -name build -o -name cmake_build -o -name tmp \) \
       -prune \
    \) \
   -o -type f -print0 | 
   xargs -0 grep -lw tmp
```