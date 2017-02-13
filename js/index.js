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
    jsMeme.canvas = $('body > main > .canvas-container > canvas').get(0);
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
  },
  
  captions:
  {
    list:
    {
      'line-1':
      {
        x: 20, y: 20,
        alignment: 'left',
        font: "500 30px \"Helvetica Neue\", Arial, sans-serif",
        text: "",
      },
      'line-2':
      {
        x: 20, y: 60,
        alignment: 'left',
        font: "500 30px \"Helvetica Neue\", Arial, sans-serif",
        text: ""
      },
      'line-3':
      {
        x: 20, y: 100,
        alignment: 'left',
        font: "500 30px \"Helvetica Neue\", Arial, sans-serif",
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
        jsMeme.text
        (
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
      ctx.font = font;
      ctx.textAlign = "start";
      ctx.textBaseline = "top";

      if(x < 0) x = jsMeme.canvas.width + x;
      if(y < 0)
      {
        y = jsMeme.canvas.height + y;
        ctx.textBaseline = "bottom";
      }
    
    if(alignment == 'center')
      x = Math.round((jsMeme.canvas.width / 2) - (ctx.measureText(val).width / 2));
    else if(alignment == 'right')
      x -= ctx.measureText(val).width;

      // ctx.shadowColor = "#000";
      // ctx.shadowOffsetX = 0;
      // ctx.shadowOffsetY = 1;
      // ctx.shadowBlur = 5;
    
    for(i = 0; i < shadowstrength; i ++)
    {
      ctx.fillStyle = "#000";
      ctx.fillText(val, x, y);
    }
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(val, x, y);
  },
  
  file:
  {
    current: {},
    
    maxWidth: 550,
    
    rotate: function(deg)
    {
      if(deg !== 90 && deg !== -90) return;
      
      var tmp = document.createElement('canvas'),
          ctx = tmp.getContext('2d'),
          width = jsMeme.canvas.width,
          height = jsMeme.canvas.height;
      
      tmp.width = height;
      tmp.height = width;
      
      ctx.rotate(deg * Math.PI / 180);
      
      switch(deg)
      {
        case 90: ctx.drawImage(jsMeme.cache, 0, -height, width, height); break;
        case -90: ctx.drawImage(jsMeme.cache, -width, 0, width, height); break;
      }
      
      jsMeme.cache.width = jsMeme.canvas.width = tmp.width;
      jsMeme.cache.height = jsMeme.canvas.height = tmp.height;
      jsMeme.canvas.getContext('2d').drawImage(tmp, 0, 0);
      jsMeme.cache.getContext('2d').drawImage(jsMeme.canvas, 0, 0);
      
      jsMeme.captions.redraw();
    },
    
    render: function(source)
    {
      $('body > main:not(.ready)').addClass('ready');
      
      var lo = ['canvas', 'cache'],
          width = source.width,
          height = source.height,
          nHeight = Math.round(jsMeme.file.maxWidth / width * height);

      for(op in lo)
      {
        jsMeme[lo[op]].width = jsMeme.file.maxWidth;
        jsMeme[lo[op]].height = nHeight;

        jsMeme[lo[op]].getContext('2d').drawImage(source, 0, 0, width, height, 0, 0, jsMeme.file.maxWidth, nHeight);
      }
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
          .replace(/\.(.*?)$/, '-modified.png')
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