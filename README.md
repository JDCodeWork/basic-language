# Modern Basic Language

This document provides an overview of the Modern Basic programming language, including its syntax, data types, and features.

## The Stack

The stack is a crucial component of the Modern Basic runtime. It serves as a temporary storage area for primitive values during program execution. When a value is needed for an operation or a function call, it can be pushed onto the stack. When the operation is complete, the value can be popped off the stack.

## Primitive Values

Modern Basic supports the following primitive data types:

*   **Boolean (`BOOL`):** Represents truth values. `0` is treated as `False`, and any other number is treated as `True`. The literals `True` and `False` can also be used.
*   **Number (`NUM`):** Represents both integers and floating-point numbers.
*   **String (`STR`):** Represents a sequence of characters. Strings can be enclosed in double quotes (`"`) or parentheses (`()`).

### Syntax

```
BOOL <value>  # 0 is False, any other number is True.
True
False

NUM <value>   # Can be any number (integer or float)
123
3.141516

STR (<value>) 
"<value>"
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

## Variables

Variables are used to store and reference values.

### Syntax

```
ASSIGN <value> TO <variable-name>
```

### Examples

```
ASSIGN 3.14 TO pi                  # Assigns the value 3.14 to the variable 'pi'
ASSIGN (ADD pi 2) TO pi_plus_two   # Assigns the result of the expression to 'pi_plus_two'
ASSIGN (pi GT 5) TO is_pi_gt_five     # Assigns the result of the comparison to 'pi_gt_five'
```

## Logical Operations

Modern Basic provides a set of logical operators for comparisons and boolean logic.

### Syntax

```
<value> EQ  <value>  # Equal
<value> GT  <value>  # Greater than
<value> LT  <value>  # Less than
<value> GTE <value>  # Greater than or equal to
<value> LTE <value>  # Less than or equal to

<value> AND <value>  # Logical AND
<value> OR  <value>  # Logical OR

NOT <value>        # Logical NOT
```

### Examples

```
1 EQ 1       # -> Result: True
2 GT 1       # -> Result: True
2 LT 1       # -> Result: False

True AND False # -> Result: False
True OR False  # -> Result: True
NOT False      # -> Result: True

(1 EQ 1) AND (2 NEQ 2) # -> Result: False
(2 GT 1) OR (2 LT 1)   # -> Result: True
```

## Macros

Macros are built-in functions that provide additional functionality. By default, if a macro needs to store a value, it will use the stack.

### `READ`

Reads a line from the console.

*   **`TYPE`:** The expected data type of the input (default is `STR`).
*   **`prompt`:** A message to display before reading the input (default is an empty string).

**Syntax:** `READ <?TYPE> <?prompt>`

### `PRINT`

Prints a value to the console.

*   **`value`:** Can be a variable, a primitive value, or an expression.

**Syntax:** `PRINT <value>`

### `EXIT`

Kill the program

### Arithmetic Macros

*   `ADD <value> <value>`: Adds two values.
*   `SUB <value> <value>`: Subtracts the second value from the first.
*   `MUL <value> <value>`: Multiplies two values.
*   `DIV <value> <value>`: Divides the first value by the second.

## Conditional Statements (`IF`)

Executes a block of code if a condition is true.

### Syntax

```
IF <condition> THEN:
    # Code to execute if the condition is true
END
```

### Example

```
READ INT AND PRINT "What is your age?"

ASSIGN R0 TO user_age

IF (user_age GT 18) THEN:
    PRINT "You are an adult."
END

IF (user_age LT 18) THEN:
    PRINT "You are a minor."
END
```

## Control Flow (`JUMP` and `SECTION`)

Transfers control to a different part of the program.

### Syntax

```
JUMP <section-name> IF <condition>

SECTION <section-name>:
    # Code block
END
```

### Example

```
ASSIGN True TO is_new_user

JUMP say_hi IF (is_new_user)

SECTION say_hi:
    PRINT "Hello World"
END
```
