This is a sidechain sketchboard for openmapper stuff.


### Since I dont get the Typescript stuff, I write here the JavaScript solution and Jan or someone has to rewrite it into typescript.

In the version on gitlab, we had the problem that dat.gui could not be hidden by default, here I made the solution where it is hidden by default.

Next step is to figure out how to custom place the menu so I can add 2 menus on the screen, one left and one right.

To display the position state, use see here for updating menu:
https://workshop.chromeexperiments.com/examples/gui/#9--Updating-the-Display-Automatically

## Usage
Clone to your computer and run index.html

then press 'h' on keyboard to see menu

# Notes
I could not figure out so far on how to use the matrix with dat.gui:

myMatrix = DatGuiMatrix(string label, int numButtons, bool showLabels = false)

DatGuiMatrix* myMatrix = DatGuiMatrix("MATRIX", 15, true)
