# Modern Basic - Syntax Guide

Complete reference guide for Modern Basic language syntax and semantics.

## Table of Contents

- [Lexical Structure](#lexical-structure)
- [Data Types](#data-types)
- [Variables](#variables)
- [Operators](#operators)
- [Expressions](#expressions)
- [Statements](#statements)
- [Control Flow](#control-flow)
- [Built-in Macros](#built-in-macros)
- [Stack Operations](#stack-operations)
- [Naming Conventions](#naming-conventions)
- [Best Practices](#best-practices)
- [Error Types](#error-types)
- [Complete Example](#complete-example)

## Lexical Structure

### Tokens

Modern Basic code is composed of tokens separated by whitespace. The scanner recognizes the following token types:

- **Keywords**: Reserved words with special meaning
- **Literals**: Boolean, Number, and String values
- **Identifiers**: Variable names and labels
- **Operators**: Comparison and logical operators
- **Delimiters**: Parentheses `()` for grouping
- **Comments**: Lines starting with `#` or text after `#` on any line

### Comments

```basic
# This is a single-line comment
ASSIGN 10 TO x  # Inline comment
```

**Rules:**

- Comments start with `#` and extend to the end of the line
- Everything after `#` is ignored by the scanner
- No multi-line comment support

### Whitespace

- Tokens must be separated by at least one space
- Line breaks separate statements
- Leading and trailing whitespace is ignored

## Data Types

Modern Basic has three primitive data types:

### Boolean (`BOOL`)

Represents truth values.

**Syntax:**

```basic
BOOL <numeric-value>
True
False
```

**Semantics:**

- `0` evaluates to `False`
- Any non-zero number evaluates to `True`
- Literals `True` and `False` are recognized

**Example:**

```basic
ASSIGN BOOL 0 TO false_var    # false
ASSIGN BOOL 1 TO true_var     # true
ASSIGN True TO explicit      # true
```

### Number (`NUM`)

Represents both integers and floating-point numbers.

**Syntax:**

```basic
NUM <numeric-literal>
<numeric-literal>
```

**Semantics:**

- Supports integers: `42`, `-10`, `0`
- Supports floats: `3.14`, `-0.5`, `2.71828`
- No scientific notation support
- No explicit integer/float distinction

**Example:**

```basic
ASSIGN NUM 42 TO answer
ASSIGN 3.14159 TO pi
ASSIGN -273.15 TO absolute_zero
```

### String (`STR`)

Represents sequences of characters.

**Syntax:**

```basic
STR (<text>)
"<text>"
```

**Semantics:**

- Strings can be enclosed in parentheses: `STR (Hello World)`
- Or in double quotes: `"Hello World"`
- No escape sequences supported
- Multi-word strings require parentheses or quotes

**Example:**

```basic
ASSIGN STR (Hello World) TO greeting
ASSIGN "Modern Basic" TO name
```

## Variables

### Declaration and Assignment

Variables are created and assigned in a single statement.

**Syntax:**

```basic
ASSIGN <expression> TO <identifier>
```

**Semantics:**

- Variables don't need prior declaration
- Assignment creates the variable if it doesn't exist
- Variables are dynamically typed
- Variable names must match: `[A-Za-z_][A-Za-z0-9_]*`

**Example:**

```basic
ASSIGN 10 TO counter
ASSIGN "John" TO username
ASSIGN (ADD 5 3) TO result
```

### Variable Naming Rules

**Valid identifiers:**

- Must start with a letter or underscore: `a-z`, `A-Z`, `_`
- Can contain letters, digits, and underscores: `a-z`, `A-Z`, `0-9`, `_`
- Case-sensitive: `myVar` ≠ `myvar`

**Convention:**

- Use `snake_case` for multi-word names: `user_age`, `current_balance`
- Descriptive names preferred: `temperature` vs `t`

**Special identifiers** (stack access):

- Single character: `S`.
- These pop values from the stack instead of referencing variables

## Operators

### Comparison Operators

| Operator | Description | Syntax | Return Type |
|----------|-------------|--------|-------------|
| `EQ` | Equal | `<expr> EQ <expr>` | Boolean |
| `GT` | Greater than | `<expr> GT <expr>` | Boolean |
| `LT` | Less than | `<expr> LT <expr>` | Boolean |
| `GTE` | Greater than or equal | `<expr> GTE <expr>` | Boolean |
| `LTE` | Less than or equal | `<expr> LTE <expr>` | Boolean |

**Type Constraints:**

- Both operands must be the same type
- `GT`, `GTE`, `LT`, `LTE` only work with numbers

### Logical Operators

| Operator | Description | Syntax | Return Type |
|----------|-------------|--------|-------------|
| `AND` | Logical AND | `<expr> AND <expr>` | Boolean |
| `OR` | Logical OR | `<expr> OR <expr>` | Boolean |
| `NOT` | Logical NOT | `NOT <expr>` | Boolean |
| `NOT EQ` | Not equal | `<expr> NOT EQ <expr>` | Boolean |

**Type Constraints:**

- `AND` and `OR` require boolean operands
- `NOT` requires a boolean operand
- `NOT EQ` requires operands of the same type

### Operator Precedence

Modern Basic uses **explicit grouping** with parentheses. There is no implicit operator precedence.

```basic
# Requires parentheses for complex expressions
ASSIGN (ADD (MUL 2 3) 4) TO result  # (2 * 3) + 4 = 10

# Comparison in assignment requires parentheses
ASSIGN (x GT 5) TO is_greater
```

## Expressions

### Primary Expressions

- **Literals**: `42`, `True`, `"text"`
- **Variables**: `username`, `counter`
- **Stack access**: `S`

### Grouped Expressions

Parentheses `()` are used to group sub-expressions.

**Syntax:**

```basic
(<expression>)
```

**Example:**

```basic
ASSIGN (ADD 5 (MUL 2 3)) TO result  # 5 + (2 * 3) = 11
```

### Macro Calls

Macros are invoked within expressions.

**Syntax:**

```basic
<macro-name> <arg1> <arg2> ...
```

**Example:**

```basic
ASSIGN (ADD num1 num2) TO sum
ASSIGN (DIV (SUB 100 20) 4) TO result  # (100 - 20) / 4
```

## Statements

### Assignment Statement

**Syntax:**

```basic
ASSIGN <expression> TO <identifier>
```

**Semantics:**

- Evaluates the expression
- Stores the result in the variable
- Creates the variable if it doesn't exist

### Print Statement

**Syntax:**

```basic
PRINT <value> [<value> ...]
```

**Semantics:**

- Prints all values to stdout
- Values are concatenated without separators
- Accepts variables, literals, and expressions
- Automatically adds a newline at the end

**Example:**

```basic
PRINT "Result: " result
PRINT "X = " x " and Y = " y
```

**Best Practice:**

When printing multiple strings with intermediate variables, prefer using the `STR()` syntax to avoid parsing issues:

```basic
PRINT STR(The total is:) total STR(dollars)
```

### Read Statement

**Syntax:**

```basic
READ [<type>] [AND PRINT <prompt>]
```

**Semantics:**

- Reads a line from stdin
- Converts input to the specified type (default: `STR`)
- Pushes the value onto the stack
- Optionally displays a prompt

**Example:**

```basic
READ NUM AND PRINT "Enter age: "
ASSIGN S TO user_age
```

### Exit Statement

**Syntax:**

```basic
EXIT
```

**Semantics:**

- Immediately terminates program execution
- Often used to prevent fall-through in sections

## Control Flow

### Conditional Statement (IF)

**Syntax:**

```basic
IF <condition> THEN:
    <statements>
END
```

**Semantics:**

- Evaluates the condition
- If `True`, executes the body
- If `False`, skips to `END`
- Conditions must evaluate to boolean

**Example:**

```basic
IF (age GTE 18) THEN:
    PRINT "Adult"
END

IF (score LT 60) THEN:
    PRINT "Failed"
    EXIT
END
```

### Jump Statement

**Syntax:**

```basic
JUMP <label> IF <condition>
```

**Semantics:**

- Evaluates the condition
- If `True`, jumps to the named section
- If `False`, continues to next statement
- Section must exist in the program

**Example:**

```basic
JUMP error_handler IF (value LT 0)
JUMP process IF (status EQ 1)
```

### Section Definition

**Syntax:**

```basic
SECTION <label>:
    <statements>
END
```

**Semantics:**

- Defines a named code block
- Can be jumped to from anywhere
- Must have unique labels
- Requires `END` terminator

**Example:**

```basic
SECTION calculate_sum:
    ASSIGN (ADD x y) TO result
    PRINT "Sum: " result
    EXIT
END
```

**Note:** Sections are pre-scanned during interpretation. Use `EXIT` to prevent fall-through execution.

## Built-in Macros

### Arithmetic Macros

#### ADD - Addition

**Syntax:** `ADD <number> <number>`

**Returns:** Number (sum)

**Type Constraints:** Both arguments must be numbers

**Example:**

```basic
ASSIGN (ADD 5 3) TO sum      # 8
ASSIGN (ADD x y) TO total
```

#### SUB - Subtraction

**Syntax:** `SUB <number> <number>`

**Returns:** Number (difference)

**Type Constraints:** Both arguments must be numbers

**Example:**

```basic
ASSIGN (SUB 10 3) TO diff    # 7
```

#### MUL - Multiplication

**Syntax:** `MUL <number> <number>`

**Returns:** Number (product)

**Type Constraints:** Both arguments must be numbers

**Example:**

```basic
ASSIGN (MUL 4 5) TO product  # 20
```

#### DIV - Division

**Syntax:** `DIV <number> <number>`

**Returns:** Number (quotient)

**Type Constraints:** Both arguments must be numbers

**Runtime Error:** Division by zero

**Example:**

```basic
ASSIGN (DIV 20 4) TO quotient  # 5
```

## Stack Operations

### The Stack

Modern Basic uses a stack for temporary value storage.

**Properties:**

- Maximum size: 32 elements
- LIFO (Last In, First Out)
- Automatic management by interpreter
- Used for intermediate calculations

### Stack Access

Values are pushed and popped automatically, but can be explicitly accessed:

**Special Identifiers:**

- Single character: `S`, `R`, `X`, `A`, `B`, etc.
- Prefix `S`: `SL`, `S0`, `S1`, `S2`, etc.

**Usage:**

```basic
READ NUM AND PRINT "Enter value: "
ASSIGN S TO myvar    # Pops from stack

# Stack is used implicitly in expressions
ASSIGN (ADD 5 3) TO result  # 5 and 3 pushed, ADD pops and pushes result
```

### Stack Overflow/Underflow

**Stack Overflow:**

- Occurs when pushing to a full stack (>32 elements)
- Throws `RuntimeError`

**Stack Underflow:**

- Occurs when popping from an empty stack
- Throws `RuntimeError`

## Naming Conventions

### Variable Names

Use `snake_case` for variable names:

```basic
ASSIGN 25 TO user_age
ASSIGN "John Doe" TO full_name
ASSIGN 1000 TO account_balance
```

### Section Labels

Use `snake_case` for section labels:

```basic
SECTION calculate_total:
    # code here
END

SECTION error_handler:
    # code here
END

SECTION process_input:
    # code here
END
```

## Best Practices

### General Naming Guidelines

1. **Descriptive names**: Use meaningful variable names like `temperature` instead of `t`
2. **Consistent casing**: Always use `snake_case` for both variables and sections
3. **Avoid single letters**: Except for loop counters or mathematical formulas
4. **Clear intent**: Names like `is_valid` are better than generic names like `flag`

### Code Organization

- Add comments for complex logic using `#`
- Use consistent indentation (4 spaces recommended)
- Define sections at the end of the program
- Use `EXIT` to prevent fall-through execution into sections

### Stack Usage

- Use `S` for immediate stack access after `READ` operations
- Use descriptive variable names instead of relying on stack when possible
- Remember the stack has a limit of 32 elements

### String Output

When printing multiple strings with intermediate variables, prefer using the `STR()` syntax:

```basic
PRINT STR(The total is:) total STR(dollars)
```

**Benefits:**

- Avoids potential parsing issues with mixed quote styles
- Provides clearer intent in the code
- Is more consistent and readable

### Input Validation

- Always validate user input after `READ` statements
- Check for edge cases (division by zero, negative values where inappropriate, etc.)
- Provide clear error messages to users

### Error Handling

- Use conditional statements to validate data before processing
- Jump to error handling sections when issues are detected
- Always provide a way to exit gracefully with `EXIT`

## Error Types

### SyntaxError

Thrown during parsing when syntax rules are violated.

**Common causes:**

- Malformed strings
- Invalid numbers
- Unexpected tokens
- Unclosed parentheses

### SemanticError

Thrown during interpretation when types don't match.

**Common causes:**

- Type mismatch in operators
- Comparing different types
- Using arithmetic on non-numbers
- Undefined variables

### RuntimeError

Thrown during execution when operations fail.

**Common causes:**

- Stack overflow/underflow
- Unmatched parentheses
- Unmatched sections
- Division by zero (potential)

## Complete Example

```basic
# Temperature Converter Program
# Demonstrates: I/O, conditionals, arithmetic, sections

PRINT "=== Temperature Converter ==="
PRINT

READ NUM AND PRINT "Enter temperature: "
ASSIGN S TO temp

PRINT "1. Celsius to Fahrenheit"
PRINT "2. Fahrenheit to Celsius"
READ NUM AND PRINT "Choose option: "
ASSIGN S TO option

JUMP celsius_to_fahrenheit IF (option EQ 1)
JUMP fahrenheit_to_celsius IF (option EQ 2)

PRINT "Invalid option"
EXIT

SECTION celsius_to_fahrenheit:
    # F = C * 9/5 + 32
    ASSIGN (MUL temp 9) TO step1
    ASSIGN (DIV step1 5) TO step2
    ASSIGN (ADD step2 32) TO result
    
    PRINT temp "°C = " result "°F"
    EXIT
END

SECTION fahrenheit_to_celsius:
    # C = (F - 32) * 5/9
    ASSIGN (SUB temp 32) TO step1
    ASSIGN (MUL step1 5) TO step2
    ASSIGN (DIV step2 9) TO result
    
    PRINT temp "°F = " result "°C"
    EXIT
END
```

---

For more examples, see the `examples/` directory in the repository.
