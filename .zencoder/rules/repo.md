---
description: Repository Information Overview
alwaysApply: true
---

# jQuery QueryBuilder Information

## Summary
A powerful web application that helps create complex SQL queries visually through a drag-and-drop interface. The application supports Vietnamese language and is optimized for various data tables. It allows users to build queries by selecting fields, operators, and values through an intuitive interface, generating both SQL and JSON output in real-time.

## Structure
- **index.html**: Main application file with HTML structure and CDN imports
- **js/**: Contains all JavaScript code
  - **app.js**: Core application logic
  - **table-manager.js**: Manages switching between different tables
  - **tables/**: Configuration for different data tables
    - **users.js**: User table configuration
    - **products.js**: Product table configuration
    - **orders.js**: Order table configuration
    - **categories.js**: Category table configuration
    - **reviews.js**: Review table configuration

## Language & Runtime
**Language**: JavaScript (ES5+)
**Framework**: jQuery with jQuery QueryBuilder plugin
**Frontend**: HTML5, CSS3
**Browser Compatibility**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## Dependencies
**Main Dependencies**:
- jQuery 3.6.0
- jQuery QueryBuilder 2.7.0
- Bootstrap 5.1.3
- Tailwind CSS (via CDN)
- Font Awesome 6.0.0

**CDN Resources**:
- jQuery: https://code.jquery.com/jquery-3.6.0.min.js
- Bootstrap CSS: https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css
- jQuery QueryBuilder: https://cdn.jsdelivr.net/npm/jQuery-QueryBuilder@2.7.0/dist/js/query-builder.standalone.min.js
- QueryBuilder CSS: https://cdn.jsdelivr.net/npm/jQuery-QueryBuilder@2.7.0/dist/css/query-builder.default.min.css
- Tailwind CSS: https://cdn.tailwindcss.com
- Font Awesome: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css

## Usage & Operations
The application can be run directly by opening the index.html file in a browser or through a local HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

## Main Files & Resources
**Entry Point**: index.html
**Core Logic**: js/app.js
**Table Configurations**:
- js/tables/users.js: User table with fields like username, email, age, status
- js/tables/products.js: Product table configuration
- js/tables/orders.js: Order table configuration
- js/tables/categories.js: Category table configuration
- js/tables/reviews.js: Review table configuration

## Data Types & Validation
**Supported Data Types**:
- String: Text with fuzzy search support
- Integer: Whole numbers
- Double: Decimal numbers
- Boolean: True/False values
- DateTime: Date and time with various operators

**Input Types**:
- Select: Dropdown with predefined values
- Radio: Single-choice options
- Checkbox: Multiple-choice options
- Text: Free input with validation

**Validation**:
- Email format validation
- Phone number validation (Vietnamese format)
- Custom regex validation for specific fields