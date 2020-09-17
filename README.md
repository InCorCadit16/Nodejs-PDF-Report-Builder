# Nodejs-PDF-Report-Builder

* Usage
* Getting started
  * Troubleshooting
* Endpoints
* Query structure
  * Data formats
    * Privitive values
    * Objects
    * Arrays of primitives
    * Arrays of objects
  * Template structure
* Limitations

## Usage

  This is a simple Node-js project which allows user to send an html template along with an object with data and build a pdf report in a very fast and simple manner. 
  
  This module is easy to integrate in your currently existing project. It's fast, intuitive (I hope) and platform independent. 

  Carefully read the instructions in order to use this tool.
  
  **Important:** necessarily read the Limitations part of README, because this tool might not suite your requirements and using it will be a waste of time.
  
  **Note:** but also note that you have the source code (which is quite simple) and you can customize the tool in order to fit your expectations. 

## Gettings started
 After clonning repository run **npm install** to install all dependencies.
 
 In orders to launch the project run **node start**.
 
### Troubleshooting:
 If project fails on start, it might be because of some dependencies where not installed (anyway, read the error description, but dependencies is the most frequent cause).
 In this case run **npm install express**. Express might not install together will all dependencies, so you will need to install it mannualy with command written before.
 
 If project fails on sending request, it might be because of [puppeteer](https://github.com/puppeteer/puppeteer) is not installed (this is one of the most important dependencies, which may not install after **npm install**). In this case install it manually with **npm install puppeteer**.
 

## Endpoints

  **Note:** app is running on port 3000. 
  
  The application has only one endpoint: **'api/pdf'** whis is a **POST** endpoint.

## Query Structure

  The single endpoint of application receives only JSON request in the following format:
  ```javascript
    {
      data: {
        // your values for template
      },
      template: // your html template as a string
    }
  ```
  
## Data formats
  
  There is 4 data formats available for the data model. You can combine all of then together in order to build a suitable data model.
   
### Primitive values

You can pass a primitive value, for example:
  ```javascript
    data: {
      numberOfStudents: 12,
      universityName: 'MIT',
      hasQuotasForForeignStudents: true
    }
  ```
  
**Note:** it's a good practise to send strings, because they are independent of different languages limitations (while numbers are limited by precision).

### Objects

You can pass an object, but it must contain **only primitive values** (without objects or arrays):
  ```javascript
    data: {
      article: {
        name: 'Top 10 Pokemons',
        rating: 9.5,
        commentsAmount: 2157
      }
    }
  ```

### Arrays of primitives

In some cases it's more convenient to send an array of values instead of many alike values:
  ```javascript
    data: {
      currencyValues: [ 1.0432, 1.09332, 1.12333, 1.17231, 1.14232 ]
    }
  ```
  
**Note:** all arrays **must end with 's' letter** as it will be used at moment of parsing.

### Arrays of objects

  ```javascript
    data: {
      references: [
        {
          name: 'Lewis, John; Loftus, William (2008); Object-Oriented Programming', 
          link: 'http://source.com'
        },
        {
          name: ' John C. Mitchell; Cambridge University Press, 2003; Types and Programming Languages.', 
          link: 'http://another.source.com'
        },
        {
          name: 'Jacobsen, Ivar; Gunnar Overgaard (1992); Object Oriented Software Engineering', 
          link: 'http://last.source.com'
        }
      ]
    }
  ```
  
**Note:** objects are not required to have same model (they might have different attributes and they will still be parsed).
  
## Template structure
  
  Template is the html content of your report where all values are replaced by their variables names. There are a few rules to consider:
    
  every variable name (which will be replace with value) must be in double curly braces like this: 
  
```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Document</title>
  </head>
  <body>
    <h1>{{universityName}}</h1>
    <h2>Number of students: {{numberOfStudents}}</h2>
    <h2>Has quotas for foreign students: {{hasQuotasForForeignStudents}}</h2>
  </body>
  </html>
```
    
**Note:** varible names must be enclosed in double curly braces **without any spaces**.

If you pass an object, then name of object will be concatenated with name of attribute (and last letter of attribute name will transform to uppercase), like this:

```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Document</title>
  </head>
  <body>
    <h1>{{articleName}}</h1>
    <h2>Rating: {{articleRating}}</h2>
    <h2>Number of comments: {{articleCommentsAmount}}</h2>
  </body>
  </html>
```

In case of array of primitives, every value of array in template must have the same name as name of array, but without 's' 
letter and with it's index + 1, e.g. in template counting is starting from 1:

```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Document</title>
  </head>
  <body>
    <p>{{currencyValue1}}</p>
    <p>{{currencyValue2}}</p>
    <p>{{currencyValue3}}</p>
    <p>{{currencyValue4}}</p>
    <p>{{currencyValue5}}</p>
  </body>
  </html>
```

**Note:** every array name **must end with 's' letter**, because last letter of array name is removed at time of parsing. **Not following this rule might result in multiple errors.** 

In case of array of objects the rules for object and array are used together, so, in case of an array of references it might have the following template:
```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Document</title>
  </head>
  <body>
    <div>
        <a href="{{referenceLink1}}">{{referenceName1}}</a>
    </div>
    <div>
        <a href="{{referenceLink2}}">{{referenceName2}}</a>
    </div>
    <div>
        <a href="{{referenceLink2}}">{{referenceName2}}</a>
    </div>
  </body>
  </html>
```

**Note:** you can insert value not only as part of content, but also as an attribute. For example as value of link href attribute.


## Limitations

  This tool doesn't support multiple level of nesting.
  
  All arrays in data object must have an 's' at the end.
  
  Currently the tool doesn't support sending CSS files, so all styles must be written in <style></style> tags.
  
  The overall size of request must not exeed 50 megabytes (otherwise the server won't respond).
  
