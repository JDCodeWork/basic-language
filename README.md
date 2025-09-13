# Modern Basic Language

## Primitive values

### Syntax
```
# Can be numbers or literals
# 0 is False, x number is True
# Literals are True and False
BOOL <value> 

# Can be any number (not difference between integers and floats)
NUM <value>

# The string can be in "<str>" or (str)
STR <value> 
```

### Examples 
```
ASSIGN BOOL 0 TO bool_var
ASSIGN False TO bool_var_two

ASSIGN NUM 3.1415 TO pi
ASSIGN 3.1415 TO pi_two

ASSIGN STR (Hello world) TO str_var
ASSIGN "Hello world" TO str_var_two
```
## Logical operations

### Syntax
```
<value> EQ  <value>
<value> GT <value>
<value> LT <value>
<value> GTE  <value>
<value> LTE  <value>

<value> AND <value>
<value> OR <value>

NOT <value>
```

### Examples
```
1 EQ 1 # -> Result: True
2 GT 1 # -> Result: True
2 LT 1 # -> Result: False

True AND False # -> Result: False
True OR False # -> Result: True
NOT False # -> Result: True

(1 EQ 1) AND (2 NOT EQ  2) # -> Result: False
2 GT 1 OR 2 LT 1
```

## Variables

### Syntax
```
ASSIGN <value> TO <var-name>
```

### Examples
```
ASSIGN 3.14 TO pi # -> Result: 3.14

ASSIGN (ADD pi 2) to pi_plus_two # -> Result: 5.14
ASSIGN (pi GT 5) to pi_gt_five # -> Result: False
```


## MACROS
A macro is like a built-in function but with other syntax

```
# Read a line in console
# TYPE -> Expected value type - default is STR
# prompt -> Message to show before reading - default is empty string
READ <?TYPE> <?prompt>

# Print in console
# value -> Can be variable, primitive value or expression
PRINT <value>

# Operate the first with the second value
ADD <value> <value>
SUB <value> <value>
MUL <value> <value>

# first value is divided by the second value
DIV <value> <value>
```
