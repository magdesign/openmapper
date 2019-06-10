This is a sidechain sketchboard for openmapper stuff.


### Since I dont get the Typescript stuff, I write here the JavaScript solution.


In the version on gitlab, we had the problem that dat.gui could not be hidden by default, here I made the solution where it is hidden by default.

Next step is to figure out how to custom place the menu so I can add 2 menus on the screen, one left and one right.


## It might come that I rewrite all the hardwork to Javascript, since it sucks big time when you are not able to modify/fix your own project.



Do again the tutorial of Kris: http://fabacademy.org/2018/labs/barcelona/students/krisjanis-rijnieks/assignments/week13/

and then start over recoding this: 
https://gitlab.com/Jaun1011/openmapper/tree/master

To display the position state, use see here for updating menu:
https://workshop.chromeexperiments.com/examples/gui/#9--Updating-the-Display-Automatically

## Usage
Clone to your computer and run index.html
then press 'h' on keyboard to see the dat.gui menu

# Notes
I could not figure out so far on how to use the matrix with dat.gui:

myMatrix = DatGuiMatrix(string label, int numButtons, bool showLabels = false)

DatGuiMatrix* myMatrix = DatGuiMatrix("MATRIX", 15, true)
