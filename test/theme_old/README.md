# Mendix UI Framework
#### Theme Mendix
This is one of the default themes that uses the Mendix UI Framework to quickly create a beautiful app with Mendix. The Mendix UI Framework consist of a Sass framework that compiles CSS files and all other files you need to build a complete Mendix app!

### Theme folder structure
The theme folder consists of the default HTML pages, Sass, CSS and resources needed to style your application.

#### Styles / Sass
In the Sass folder you will notice two main folders, custom and library. The library folder houses the complete Mendix UI Framework and the custom folder is a duplication of the library folder. We advice to do *all customization* in the custom folder.

##### Library Folder
We created a framework so our users have a clear understanding what Mendix is capable of. The library folder structure is as follows:

- Base
- Building Blocks
- Components
- Layouts
- Mobile

###### Base
The base folder holds the *architecture* for our framework. Here we have our *mixins*, *variables* and *resets*. The variables is what makes our framework, which holds all global variables for the project (for typography, color schemes, and so on).

###### Components
This directory contains all kind of basic components like a datagrid, buttons, label, form, listview, or anything along those lines. They have distinct properties and can't be broken down further without losing their meaning.

###### Building Blocks
Building blocks are combined components/widgets. For example *cards* or *headers* are building blocks. A building block could be an image, title and a button built together.

###### Layouts
The layout directory contains some styles for the main sections of the layout (topbar, sidebar, footer and so on).

###### Mobile
The mobile directory include specific styling for your tablet or phone pages and widgets. This is useful to target only mobile use cases.

##### Custom Folder
The custom folder is a duplication from the library folder. We advice all of our users to make their customizations in this folder so you can always go back to the library. We made sure you are able to easily find all the elements and resources needed to style an Mendix application.

###### Custom Variables file
It's possible to do almost all your default styling in the *_custom-variables* file. In this file you are able to change your default colors, layouts, spacing, typography, widgets and more.


#### Styles / CSS
This folder includes the compiled files from Sass. It contains the custom and lib CSS files. You are able to adjust only the CSS files without using Sass. However, when you are going to use Sass the CSS files will be overwritten by the Sass compiler.

#### Resources
Resources combine startup images and icons to support Windows, Android and Apple devices. You would only need to use these files if you want your users to bookmark your app to their phones since Mendix supports hybrid applications in the Mendix platform. 

#### Other files

###### components.json
This file is needed for creating hybrid apps with Mendix. Read more about this [here](https://world.mendix.com/display/refguide5/Customizing+Hybrid+Mobile+Apps).
###### config.rb
Sass/Compass compilers need a config file called config.rb in which the settings of the project are defined. The compiler will read this and use the settings when compiling your css.

### Where to place the theme files
The theme has to be added to the following folder */project-directory/theme*. Make sure to place all the files in the */theme/* folder directly. When you use the Mendix App Store the theme will be automatically placed in the correct folder.

### Useful links
- [Live theme demo](https://ux.mendix.com/index-theme-mendix.html)
- [Mendix UI Framework Website](https://ux.mendix.com/)
- [Blog article about Mendix UI Framework](https://www.mendix.com/blog/the-eye-catching-mendix-ui-framework/)
- [Create a custom theme with the Mendix UI Framework](https://world.mendix.com/display/howto50/Create+a+custom+theme+with+the+Mendix+UI+Framework)

### License

MIT