
// Modified, but originally from:
// https://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas/21961894#21961894
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

   EXIF.getData(img, function() {

       if (arguments.length === 2) {
           x = y = 0;
           w = ctx.canvas.width;
           h = ctx.canvas.height;
       }

       // default offset is center
       offsetX = typeof offsetX === "number" ? offsetX : 0.5;
       offsetY = typeof offsetY === "number" ? offsetY : 0.5;

       // keep bounds [0.0, 1.0]
       if (offsetX < 0) offsetX = 0;
       if (offsetY < 0) offsetY = 0;
       if (offsetX > 1) offsetX = 1;
       if (offsetY > 1) offsetY = 1;

       var iw = img.width,
           ih = img.height,
           r = Math.min(w / iw, h / ih),
           nw = iw * r,   // new prop. width
           nh = ih * r,   // new prop. height
           cx, cy, cw, ch, ar = 1;

       // decide which gap to fill
       if (nw < w) ar = w / nw;
       if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
       nw *= ar;
       nh *= ar;

       // calc source rectangle
       cw = iw / (nw / w);
       ch = ih / (nh / h);

       cx = (iw - cw) * offsetX;
       cy = (ih - ch) * offsetY;

       // make sure source rectangle is valid
       if (cx < 0) cx = 0;
       if (cy < 0) cy = 0;
       if (cw > iw) cw = iw;
       if (ch > ih) ch = ih;

		var orientation = EXIF.getTag(this, "Orientation");

		switch(orientation){

       	case 8:
    		ctx.save();
 		   ctx.translate(w/2, h/2);
           	ctx.rotate(90*Math.PI/180);
 		   ctx.translate(-w/2, -h/2);
 		   ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
 		   ctx.restore();
           	break;
       	case 3:
    	   ctx.save();
 		   ctx.translate(w/2, h/2);
           ctx.rotate(180*Math.PI/180);
		   ctx.translate(-w/2, -h/2);
		   ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
		   ctx.restore();
           break;
       case 6:
   		   ctx.save();
		   ctx.translate(w/2, h/2);
		   ctx.rotate(90*Math.PI/180);
		   ctx.translate(-w/2, -h/2);
		   ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
		   ctx.restore();
           break;
	   default:
		   ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
		   break;

   	 }

	});


}

if(!window.File || !window.FileReader) alert
(
  'Oops!\n' +
  'Your browser appears to be ancient.\n' +
  'You\'ll need to upgrade it to use jsMeme.'
);

$.fn.typingEnd = function(callback){ var tt, dt = 500, cb = callback, ob = $(this); ob.bind('keyup change', function(){ clearTimeout(tt); tt = setTimeout(function(){ cb.call(ob.get(0)) }, dt) }).keydown(function(){ clearTimeout(tt) }) };

var jsMeme =
{
  canvas: null,
  cache: null,

  init: function()
  {
    jsMeme.canvas = $('.canvas-container > canvas').get(0);
    jsMeme.cache = document.createElement('canvas');

    $('input[name^="line-"]').each(function()
    {
      $(this).typingEnd(function()
      {
        jsMeme.captions.list[$(this).attr('name')].text = this.value;
        jsMeme.captions.redraw();
      });
    });

    $('input[name="maximum-width"]').typingEnd(function()
    {
      var mw = parseFloat(this.value);
          if(mw < 200 || mw > 4096) return false;

      jsMeme.file.maxWidth = mw;

      var oWidth = jsMeme.canvas.width,
          oHeight = jsMeme.canvas.height,
          nWidth = jsMeme.file.maxWidth,
          nHeight = Math.round(nWidth / oWidth * oHeight);

      jsMeme.canvas.width = nWidth;
      jsMeme.canvas.height = nHeight;
      jsMeme.canvas.getContext('2d').drawImage(jsMeme.cache, 0, 0, oWidth, oHeight, 0, 0, nWidth, nHeight);

      jsMeme.cache.width = nWidth;
      jsMeme.cache.height = nHeight;
      jsMeme.cache.getContext('2d').drawImage(jsMeme.canvas, 0, 0);

    });

    // $('body > aside > h1').append(' <b>' + $('ul.changelog li[v]').first().attr('v') + '</b>');
  },

  reset: function()
  {
    window.location = window.location.href;
    var canvas_calc = $("canvas").width() / 2
  },

  captions:
  {
    list:
    {
      'line-1':
      {
        x: 5,
				y: 109,
        alignment: 'left',
        font: "500 20px \"MarkOff\", Arial, sans-serif",
        text: "",
      },
      'line-2':
      {
        x: 5,
				y: 90,
        alignment: 'left',
        font: "500 20px \"MarkOff\", Arial, sans-serif",
        text: ""
      },
      'line-3':
      {
        x: 5,
        y: 78,
        alignment: 'left',
        font: "500 20px \"MarkOff\", Arial, sans-serif",
        text: ""
      }
    },

    layout: function(layout)
    {
      switch(layout)
      {
        case 'classic-split':
          jsMeme.captions.list['line-1'].y = 20;
          jsMeme.captions.list['line-1'].alignment = 'center';
          jsMeme.captions.list['line-2'].alignment = 'center';
          break;

        case 'classic':
          jsMeme.captions.list['line-1'].y = -50;
          jsMeme.captions.list['line-1'].alignment = 'center';
          jsMeme.captions.list['line-2'].alignment = 'center';
          break;

        default:
          jsMeme.captions.list['line-1'].y = 20;
          jsMeme.captions.list['line-1'].alignment = 'left';
          jsMeme.captions.list['line-2'].alignment = 'left';
          jsMeme.captions.list['line-3'].alignment = 'left';
          break;
      }
      jsMeme.captions.redraw();
    },

    redraw: function()
    {
      jsMeme.canvas.getContext('2d').drawImage(jsMeme.cache, 0, 0);

      for(i in jsMeme.captions.list)
        jsMeme.text(
          jsMeme.captions.list[i].text,
          jsMeme.captions.list[i].x,
          jsMeme.captions.list[i].y,
          jsMeme.captions.list[i].alignment,
          jsMeme.captions.list[i].font,
          jsMeme.captions.list[i].shadow
        );
    }
  },

  text: function(val, x, y, alignment, font, shadowstrength)
  {
    var ctx = jsMeme.canvas.getContext('2d');
        ctx.font = "500 240% \"MarkOff\", Arial, sans-serif";
        ctx.textAlign = "start";
        ctx.textBaseline = "top";

        console.log(font);

    if(x < 0){
      x = jsMeme.canvas.width + x;
    }

    if(y < 0){
      y = jsMeme.canvas.height + y;
      ctx.textBaseline = "bottom";
    }

    if(alignment == 'center'){
      x = Math.round((jsMeme.canvas.width / 2) - (ctx.measureText(val).width / 2));
    }else if(alignment == 'right'){
      x -= ctx.measureText(val).width;
    }

    // ctx.shadowColor = "#000";
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 1;
    // ctx.shadowBlur = 5;

    // for(i = 0; i < shadowstrength; i ++)
    // {
    //   ctx.fillStyle = "#000";
    //   ctx.fillText(val, x, y);
    // }

    ctx.fillStyle = "#FFFFFF";

    // console.log('This is x test:', x);
    var canvas_calc = $("canvas").width()
    var one = canvas_calc * 0.25 / x
    var two = canvas_calc * 55 / y
    // font = "500 3% \"MarkOff\", Arial, sans-serif";


    console.log(one);
    // var two = y / 7


    //This is pulling in px instead of percent. How native function works
    ctx.fillText(val, one, two);

  var xhr = new XMLHttpRequest();

  xhr.open("GET", "/images/white_logo_copy.png");

    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = function()
    {
      var img = new Image;
      var canvas_calc = $("canvas").width() / 2
      blob = xhr.response; //xhr.response is now a blob object
      img.onload = function() {
          jsMeme.canvas.getContext('2d').drawImage(img,  20, canvas_calc * 1.75)

       /*    if($(window).width() <= 768 ){
          //Rotates image
          jsMeme[lo[op]].getContext('2d').translate(canvas_width /1,canvas_width /900)
          jsMeme[lo[op]].getContext('2d').rotate(90 * Math.PI / 180);


        }*/
          // jsMeme.canvas.getContext('2d').drawImage(img, 30, 30, 254, 36)
      }
      img.src = URL.createObjectURL(blob);
    }
    xhr.send();
  },

  file:
  {
    current: {},

    maxWidth: 500,

    render: function(source)
    {
      $('body > main:not(.ready)').addClass('ready');
      $('canvas').css('width', "100%");
      var a = "http://www.google.com/intl/en_com/images/logo_plain.png";
      var canvas_width = $('.canvas-container' ).width();
      var canvas_height = $('.canvas-container' ).height();
      var lo = ['canvas', 'cache'],
          width = source.width,
          height = source.width,
          nHeight = Math.round(canvas_width );

      for(op in lo){
        jsMeme[lo[op]].width = nHeight;
        jsMeme[lo[op]].height = nHeight;

        //Check so rotates only on mobile 768px
        // if($(window).width() <= 768 ){
        //   //Rotates image
        //   jsMeme[lo[op]].getContext('2d').translate(canvas_width /1,canvas_width /900)
        //   jsMeme[lo[op]].getContext('2d').rotate(90 * Math.PI / 180);


        // }

//         if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//  jsMeme[lo[op]].getContext('2d').translate(canvas_width /1,canvas_width /900)
//           jsMeme[lo[op]].getContext('2d').rotate(90 * Math.PI / 180);
// }



        //Sent variables to scale to fit
        var wrh = jsMeme[lo[op]].width / jsMeme[lo[op]].height;
        var newWidth = jsMeme[lo[op]].width;
        var newHeight = newWidth / wrh;

		drawImageProp(jsMeme[lo[op]].getContext('2d'), source, 0, 0, canvas_width, canvas_height);

        //jsMeme[lo[op]].getContext('2d').drawImage(source, 0,0, newWidth , newHeight);
      }

      var xhr = new XMLHttpRequest();
      var canvas_calc = $("canvas").width() / 2;
      xhr.open("GET", "/images/white_logo_copy.png");
      xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob

      xhr.onload = function(){
        var img = new Image;
        blob = xhr.response;//xhr.response is now a blob object
        img.onload = function() {
          jsMeme.canvas.getContext('2d').drawImage(img,  20, canvas_calc * 1.75)
        }
        img.src = URL.createObjectURL(blob);

      }
      xhr.send();

    },

    import: function(input)
    {
      $('body > main').addClass('ready');

      for(i in input.files)
        if(i != 'item' && input.files[i] && input.files[i].name)
          {
            var file = input.files[i];
                jsMeme.file.current = file;

            if(file.name.match(/\.psd$/i))
            {
              PSD.fromFile(file, function(psd)
              {
                var psdimg = document.createElement('img');
                  psdimg.src = psd.toImage();
                  psdimg.onload = function()
                  {
                    jsMeme.file.render(this);
                    $(this).remove();
                  };

                $(psdimg).prependTo('body');
              });
            }
            else
            {

              var reader = new FileReader();
                reader.onload = function(e)
                {
                  var imgimg = document.createElement('img');
                    imgimg.src = e.target.result;
                    imgimg.onload = function()
                    {
                      jsMeme.file.render(this);
                      $(this).remove();


                    };

                  $(imgimg).prependTo('body');
                };

				// reader.onloadend = function() {
//
// 					var imgimg = $('#foo');
// 					console.log(imgimg);
//
//
// 				};

                reader.readAsDataURL(file);
            }


            return !1;
          }
    },

    export: function()
    {
      jsMeme.canvas.toBlob(function(blob)
      {
        var filename = jsMeme.file.current.name
          .replace(/\.(.*?)$/, '-GlobalCitzen-ThisisAmerica.png')
          .replace(/\{date\}/gi, new Date().toUTCString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'));

        if(filename.indexOf('.png') < 0)
          filename += '.png';

        saveAs(blob, filename);
      }, 'image/png');
    }
  },

  webcam:
  {
    start: function()
    {
      if($('body > aside > .webcam').is(':visible'))
        return jsMeme.webcam.stop();

      $('body > aside > .drop').hide();
      $('body > aside > .webcam').show();

      var video = $('body > aside > .webcam > video')[0],
          streaming = !1, width = 220, height = 0;

      navigator.getMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

      navigator.getMedia
      (
        { video: !0, audio: !1 },
        function(stream)
        {
          if(navigator.mozGetUserMedia)
            video.mozSrcObject = stream;
          else
          {
            var vu = window.URL || window.webkitURL;
            video.src = vu.createObjectURL(stream);
          }
          video.play();
        },
        function(error)
        {
          console.log("Oops! Something went wrong.\n" + error);
        }
      );

      video.addEventListener('canplay', function(ev)
      {
        if(!streaming)
        {
          height = video.videoHeight / (video.videoWidth / width);
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          streaming = !0;
        }
      }, !1);
    },

    stop: function()
    {
      $('body > aside > .drop').show();
      $('body > aside > .webcam').hide();
      $('body > aside > .webcam > video')[0].pause();
    },

    reset: function()
    {
      $('body > aside > .webcam > video')[0].play();
    },

    take: function()
    {
      var video = $('body > aside > .webcam > video')[0],
          oWidth = video.width,
          oHeight = video.height,
          width = video.videoWidth,
          height = video.videoHeight;

      video.width = width;
      video.height = height;
      video.pause();

      var tmp = document.createElement('canvas');
          tmp.width = width;
          tmp.height = height;
          tmp.getContext('2d').drawImage(video, 0, 0);

      jsMeme.file.current = { name: "webcam-{date}" };
      jsMeme.file.render(tmp);

      video.width = oWidth;
      video.height = oHeight;
    }
  }
};

$(jsMeme.init);

function updateText(type) {
 var id = "third-input";
 document.getElementById(id).value = document.getElementById(type).value;
  document.getElementById("third-input").focus();
  $('#third-input').keydown();
  $('#third-input').keyup();

}

 $("#sensor").on('click', function () {
  $("#sensor").css("opacity", "0");
  });

// if($)
// if(document.getElementById('sensor').value == "Refugee.") {
//
//     }

$('.get_started').click(function() {
  $(".first-phase").addClass("first-phase-gone");
  $(".img_1-2").addClass("img_1-2_black");
  $(".second-phase").addClass("move-down");
  $(".third-phase").addClass("third_phase_appear");
  $(".1").removeClass("img_1-3");
  $(".1").addClass("img_1-3-blur");

  $(".2").removeClass("img_2-1");
  $(".2").addClass("img_2-1-blur");

  $(".3").removeClass("img_2-2");
  $(".3").addClass("img_2-2-blur");

  $(".4").removeClass("img_2-3");
  $(".4").addClass("img_2-3-blur");

  $(".5").removeClass("img_3-1");
  $(".5").addClass("img_3-1-blur");

  $(".6").removeClass("img_3-2");
  $(".6").addClass("img_3-2-blur");

  $(".7").removeClass("img_3-3");
  $(".7").addClass("img_3-3-blur");

  $(".8").removeClass("img_2-2");
  $(".8").addClass("img_1-1-blur");

  $('.upload_magic').css("display", "block");


});



$('.drag-and-drop').click(function() {
  // $('.drag-and-drop-overlay').css("display", "none");
    $('.main_input').removeClass("main_input_mask")
});

$('.interaction-button-three').click(function() {
  $('.share-dialog').addClass("share-dialog-show");
});

$(".button-bank li").click(function() {
  $('.share-this').css("display", "none");
  $('.thanks').css("display", "block");
});

$('.drag-and-drop').click(function() {
  $('.logo-stamp').css("display", "none");
});

$('.close').click(function() {
  $('.share-dialog').removeClass("share-dialog-show");
});

$('.close').click(function() {
  $('.share-dialog').removeClass("share-dialog-show");
  $('.share-this').css("display", "block");
  $('.thanks').css("display", "none");
});





        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 $('.move-down').css("transform", "translate(0px, 125px)");
 $('.drag-title').empty();

 $('.drag-title').append("Select A Photo");

 $('.share-dialog').css("height", "25%");
}


// $(".img_1-2").on('touchmove','.scrollable',function(e) {
//     e.stopPropagation();
// });

if(navigator.userAgent.match(/iPhone/)) {


    $(".dropdown").addClass("dropdown-mobile");
}

// $(function() {
//   var a = $(".img_1-2")
//    a.addEventListener("touchmove", function(e){ e.preventDefault(); }, false);
// });
