# Modern Basic Language

**This is a personal practice project** created to deepen my understanding of how programming languages work internally. The language is inspired by classic BASIC, bringing its simplicity and readability to a modern implementation.

It features a stack-based architecture, dynamic typing, and a minimal but powerful set of built-in operations.

## 📚 Documentation

- **[Syntax Guide (SYNTAX.md)](SYNTAX.md)** - Complete language reference, grammar, and detailed syntax
- **[Examples](examples/)** - 8 sample programs demonstrating all language features

## 🎯 Overview

**Language Type:** Interpreted, dynamically-typed  
**Paradigm:** Imperative, procedural  
**Runtime:** [Bun](https://bun.sh/) (JavaScript/TypeScript)  
**File Extension:** `.mb`

**Key Features:**

- ✅ Three primitive types: Boolean, Number, String
- ✅ Stack-based evaluation (32 elements max)
- ✅ Dynamic typing
- ✅ Control flow with IF, JUMP, and SECTION
- ✅ Built-in I/O and arithmetic operations
- ✅ Simple and readable syntax

## 🚀 Quick Start

### 1. Install Bun

```bash
# Linux/macOS
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Clone and Run

```bash
git clone https://github.com/JDCodeWork/basic-language.git
cd basic-language

# Install dependencies
bun install

# Run an example
bun run index.ts examples/types.mb
```

### 3. Create Your First Program

Create a file `hello.mb`:

```basic
PRINT "Hello, Modern Basic!"

READ AND PRINT "What's your name? "
ASSIGN S TO name

PRINT "Nice to meet you, " name "! "
```

Run it:

```bash
bun run index.ts hello.mb
# Or
bun . hello.mb
```

## 📖 Language Basics

### Simple Program Example

```basic
# Input
READ NUM AND PRINT "Enter a number: "
ASSIGN S TO num

# Processing
ASSIGN (MUL num 2) TO result

# Output
PRINT "Double of " num " is " result
```

### Core Concepts

**Variables:**

```basic
ASSIGN 10 TO age
ASSIGN "John" TO name
ASSIGN (ADD 5 3) TO sum
```

**Conditionals:**

```basic
IF (age GT 18) THEN:
    PRINT "Adult"
END
```

**Control Flow:**

```basic
JUMP process IF (status EQ 1)

SECTION process:
    PRINT "Processing..."
    EXIT
END
```

**Built-in Operations:**

- `ADD`, `SUB`, `MUL`, `DIV` - Arithmetic
- `READ`, `PRINT` - I/O
- `EQ`, `GT`, `LT`, `GTE`, `LTE` - Comparisons
- `AND`, `OR`, `NOT` - Logical operators

For complete syntax details, see **[SYNTAX.md](SYNTAX.md)**.

## 🎮 Available Examples

Run any example with: `bun run index.ts examples/<filename>.mb`

| Example | Description |
|---------|-------------|
| **types.mb** | Interactive demonstration of primitive types |
| **variables.mb** | Variables, expressions, and user input |
| **logical.mb** | All logical operations and comparisons |
| **control_flow.mb** | IF statements and JUMP/SECTION |
| **macros.mb** | Interactive calculator with control flow |
| **grade_calculator.mb** | Score to letter grade converter |
| **temperature_converter.mb** | Celsius ↔ Fahrenheit conversion |
| **ATM.mb** | Complete ATM simulator |

## 🏗️ Project Structure

```
basic-language/
├── README.md           # This file - Getting started guide
├── SYNTAX.md          # Complete language reference
├── index.ts           # Interpreter entry point
├── src/
│   ├── scanner.ts     # Lexical analysis
│   ├── parser.ts      # Syntax analysis
│   ├── interpreter.ts # Execution engine
│   ├── tokens.ts      # Token definitions
│   └── utils.ts       # Error handling
└── examples/          # Sample programs
```

## ⚠️ Known Limitations

- Stack limited to 32 elements
- No loops (use `JUMP`/`SECTION` instead)
- No user-defined functions
- No arrays or complex data structures
- No file I/O operations

## 🐛 Known Issues (Work in Progress)

We are currently working on fixing the following bugs:

- **String spacing in `STR()` syntax:** When using `PRINT STR(Some text)`, spaces between words are removed. For example:

  ```basic
  PRINT STR(The result is )  # Outputs: "Theresult is" instead of "The result is "
  ```

  **Workaround:** Use double-quoted strings for now:

  ```basic
  PRINT "The result is "  # Works correctly
  ```

- **String parsing in `PRINT` with mixed quotes:** When using `PRINT` with multiple strings and variables, strings with spaces inside quotes are incorrectly parsed as separate tokens. For example:

  ```basic
  PRINT "lorem" some_var " ipsum " some_other_var
  # Error: Variable 'ipsum' is not defined
  # The interpreter treats "ipsum" as a separate variable instead of part of the string
  ```

  **Workaround:** Concatenate strings without internal spaces or use `STR()` syntax:

  ```basic
  PRINT "lorem" some_var "ipsum" some_other_var  # Works
  PRINT STR(lorem) some_var STR(ipsum) some_other_var  # Also works (but removes spaces)
  ```

If you encounter any bugs, please report them by [opening an issue](https://github.com/JDCodeWork/basic-language/issues).

## 🔧 Technical Details

Modern Basic is implemented in TypeScript and runs on Bun. The interpreter consists of three phases:

1. **Scanner:** Source code → Raw tokens
2. **Parser:** Raw tokens → Typed tokens
3. **Interpreter:** Typed tokens → Execution

For detailed technical information, architecture details, and performance characteristics, see [SYNTAX.md](SYNTAX.md).

## 📚 Learning Resources

- **[SYNTAX.md](SYNTAX.md)** - Complete language specification with:
  - Detailed syntax rules and grammar
  - All operators and built-in functions
  - Type system and semantics
  - Error handling details
  - BNF grammar notation
  - Complete code examples

- **[examples/](examples/)** - Practical programs covering all features
