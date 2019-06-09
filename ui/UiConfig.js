  //Here start my dat gui stuff
  // The next few lines sets the intit values for all GUI content

    let obj = {
        Outlines: false,
        Cutter: false,

        Speed: 100,
        //Speed: min(-100).max(200).step(1);

        height: 10,
        Position: 0,
  
        Source: 'Video',
        Location: 'any',

        addQuad: function () {
          alert('Bang!');
        },
        addCircle: function () {
        },
        LayerUp: function () {
        },
        LayerDown: function () {
        },
        Play: true,
    };

    let gui = new dat.gui.GUI();
    //following command hides the Gui by default
    dat.GUI.toggleHide()

    //First folder of GUI
    let f1 = gui.addFolder('View');

    f1.add(obj, 'Outlines');
    f1.add(obj, 'Cutter');
    //let the folder be open:
    f1.open();

    //Second folder of GUI
    let f2 = gui.addFolder('Surfaces');
    
    f2.add(obj, 'addQuad');
    f2.add(obj, 'addCircle');
    f2.add(obj, 'LayerUp');
    f2.add(obj, 'LayerDown');
   //let the folder be open:
    f2.open();


    //Third folder of GUI
    let f3 = gui.addFolder('Content');
    // Choose from accepted values
    f3.add(obj, 'Source', [ 'Video', 'Slideshow', 'Webcam', 'Website' ] );
    f3.add(obj, 'Location', [ 'any', 'other' ] );
    //let the folder be open:
    f3.open();

    //Fourth folder of GUI
    let f4 = gui.addFolder('Control');
  
    f4.add(obj, 'Play');
    f4.add(obj, 'Speed').min(-100).max(200).step(1);
    f4.add(obj, 'Position');
    //let the folder be open:
    f3.open(); 