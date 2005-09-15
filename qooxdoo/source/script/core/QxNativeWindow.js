function QxNativeWindow(vCaption, vSource, vName)
{
  QxTarget.call(this);

  this._timer = new QxTimer(100);
  this._timer.addEventListener("interval", this._ontimer, this);

  var o = this;
  this.__onload = function(e) { return o._onload(e); };

  if (isValidString(vSource)) {
    this.setSource(vSource);
  };
  
  if (isValidString(vCaption)) {
    this.setCaption(vCaption);
  };

  if (isValidString(vName)) {
    this.setName(vName);
  };
};

QxNativeWindow.extend(QxTarget, "QxNativeWindow");

/*!
  The outer width of the window.
*/
QxNativeWindow.addProperty({ name : "width", defaultValue : 400, groups : [ "dimension" ] });

/*!
  The outer height of the window.
*/
QxNativeWindow.addProperty({ name : "height", defaultValue : 250, groups : [ "dimension" ] });

/*!
  The left screen coordinate of the window.
*/
QxNativeWindow.addProperty({ name : "left", type : Number, defaultValue : 100, groups : [ "location" ] });

/*!
  The top screen coordinate of the window.
*/
QxNativeWindow.addProperty({ name : "top", type : Number, defaultValue : 200, groups : [ "location" ] });

/*!
  Should be window be modal
*/
QxNativeWindow.addProperty({ name : "modal", type : Boolean, defaultValue : false });

/*!
  The text of the caption
*/
QxNativeWindow.addProperty({ name : "caption", type : String });

/*!
  The source url
*/
QxNativeWindow.addProperty({ name : "source", type : String });

/*!
  The window name
*/
QxNativeWindow.addProperty({ name : "name", type : String });

/*!
  The text of the statusbar
*/
QxNativeWindow.addProperty({ name : "status", type : String, defaultValue : "Ready" });

/*!
  Should the statusbar be shown
*/
QxNativeWindow.addProperty({ name : "showStatusbar", type : Boolean, defaultValue : false });

/*!
  Should the menubar be shown
*/
QxNativeWindow.addProperty({ name : "showMenubar", type : Boolean, defaultValue : false });

/*!
  Should the location(bar) be shown
*/
QxNativeWindow.addProperty({ name : "showLocation", type : Boolean, defaultValue : false });

/*!
  Should the toolbar be shown
*/
QxNativeWindow.addProperty({ name : "showToolbar", type : Boolean, defaultValue : false });

/*!
  Should the caption be shown
*/
QxNativeWindow.addProperty({ name : "showCaption", type : Boolean, defaultValue : true });

/*!
  If the window is resizeable
*/
QxNativeWindow.addProperty({ name : "resizeable", type : Boolean, defaultValue : true });

/*!
  If the window is moveable
*/
QxNativeWindow.addProperty({ name : "moveable", type : Boolean, defaultValue : true });

/*!
  If the window is able to scroll and has visible scrollbars if needed
*/
QxNativeWindow.addProperty({ name : "allowScrollbars", type : Boolean, defaultValue : false });




/*
------------------------------------------------------------------------------------
  SUB WIDGET GETTER
------------------------------------------------------------------------------------
*/

proto.getPane = function() {
  return this._pane;
};




/*
------------------------------------------------------------------------------------
  MODIFIY ADDER LOGIC
------------------------------------------------------------------------------------
*/

proto.addToWindow = proto.add;

proto.addToPane = function() {
  this._pane.add.apply(this._pane, arguments);
};

// Overwrite default
proto.add = proto.addToPane;




/*
------------------------------------------------------------------------------------
  COORDINATES
------------------------------------------------------------------------------------
*/

proto._modifyLeft = function(propValue, propOldValue, propName, uniqModIds) {
  return this._applyPosition();
};

proto._modifyTop = function(propValue, propOldValue, propName, uniqModIds) {
  return this._applyPosition();
};

proto._applyPosition = function()
{
  if (this._window && !this._window.closed) {
    this._window.moveTo(this.getLeft(), this.getTop());
  };

  return true;  
};



/*
------------------------------------------------------------------------------------
  CAPTION
------------------------------------------------------------------------------------
*/

proto._modifyCaption = function(propValue, propOldValue, propName, uniqModIds) {
  return this._applyCaption();  
};

proto._modifyShowCaption = function(propValue, propOldValue, propName, uniqModIds) {
  return this._applyCaption();    
};

proto._applyCaption = function()
{
  if (this._window && this._instance) 
  {
    var v = "";
    
    if (this.getShowCaption())
    {
      var vc = this.getCaption();
      if (isValidString(vc)) {
        v = vc;
      };
    };
    
    this._instance.getClientDocument().getDocumentElement().title = v;
  };
  
  return true;
};






/*
------------------------------------------------------------------------------------
  SOURCE
------------------------------------------------------------------------------------
*/

proto._modifySource = function(propValue, propOldValue, propName, uniqModIds) {

  if(this._window && this._window.closed == false) {
    this._window.location.replace(isValidString(propValue) ? propValue : ("javascript:/" + "/"));
  };

  return true;
};




/*
------------------------------------------------------------------------------------
  NAME
------------------------------------------------------------------------------------
*/

proto.getName = function()
{
  if (this._window)
  {
    if ( this._window.name == this._valueName )
    {
      return this._window.name;
    }
    else
    {
      throw new Error("window name and name property are not identical");
    };
  }
  else
  {
    return this._valueName;
  };
};


proto._modifyName = function(propValue, propOldValue, propName, uniqModIds)
{

  if (this._window) 
  {
    this._window.name = propValue;
  };

  return true;
};




/*
------------------------------------------------------------------------------------
  UTILITY
------------------------------------------------------------------------------------
*/

proto._chromeCaptionSize = 24;

proto._isOpened = false;

proto._isLoaded = false;

proto.isLoaded = function() {
  return this._isLoaded;
};

proto.close = function() 
{
  if (this._window) {
    this._window.close();
  };
};

proto.getReady = function() {
  return this._readyState == 5;
};

proto.open = function()
{
  /* 
  -----------------------------------------------------------------------------
    PRE CONFIGURE WINDOW
  -----------------------------------------------------------------------------
  */ 
  
  var conf = "dependent=yes,";
  
  if (isValidNumber(this.getWidth())) {
      conf += "width=" + this.getWidth() + ",";      
    };
   
  if (isValidNumber(this.getHeight())) 
  {
    if ((new QxClient).isMshtml())
    {
      if (this.getShowMenubar())
      {
        conf += "height=" + (this.getHeight() + (this.getAllowScrollbars() ? -20 : -8)) + ",";
      }
      else
      {
      conf += "height=" + this.getHeight() + ",";      
    };
    }
    else
    {
      conf += "height=" + this.getHeight() + ",";
    };
  };
  
  if (isValidNumber(this.getLeft())) {
    conf += "left=" + this.getLeft() + ",";
  };
  
  if (isValidNumber(this.getTop())) {
    conf += "top=" + this.getTop() + ",";
  };  
  
  /*
    http://www.microsoft.com/technet/prodtechnol/winxppro/maintain/sp2brows.mspx
    Changes to Functionality in Microsoft Windows XP Service Pack 2
    Part 5: Enhanced Browsing Security
    URLACTION_FEATURE_WINDOW_RESTRICTIONS
    Allow script-initiated windows without size or position constraints
    Code: 2102      
  */

  
  conf += "resizable=" + (this.getResizeable() ? "yes" : "no") + ",";
  conf += "status=" + (this.getShowStatusbar() ? "yes" : "no") + ",";
  conf += "location=" + (this.getShowLocation() ? "yes" : "no") + ",";
  conf += "menubar=" + (this.getShowMenubar() ? "yes" : "no") + ",";
  conf += "toolbar=" + (this.getShowToolbar() ? "yes" : "no") + ",";
  conf += "scrollbars=" + (this.getAllowScrollbars() ? "yes" : "no") + ",";
  conf += "modal=" + (this.getModal() ? "yes" : "no") + ",";


  /* 
  -----------------------------------------------------------------------------
    TIMER
  -----------------------------------------------------------------------------
  */

  this._isOpened = false;
  this._isLoaded = false;
  this._readyState = 0;


  /* 
  -----------------------------------------------------------------------------
    BLOCKER
  -----------------------------------------------------------------------------
  */
  
  if (this.getModal()) {
    window.application.getClientWindow().getClientDocument().block(this);
  };
  



  /* 
  -----------------------------------------------------------------------------
    OPEN WINDOW
  -----------------------------------------------------------------------------
  */
  
  if ( isInvalidString(this.getName()) ) {
    this.setName("w" + this.toHash());
  };

  this._window = window.open("about:blank", this.getName(), conf);
  
  if (!this._window) 
  {
    this.debug("Window could not be opened. It seems there is a popup blocker active!");
    
    // release window again
    if (this.getModal()) {
      window.application.getClientWindow().getClientDocument().release(this);
    };
  };
  
  this._timer.restart();
};





/*
  -------------------------------------------------------------------------------
    CENTER SUPPORT
  -------------------------------------------------------------------------------
*/

proto.centerToScreen = function() {
  return this._centerHelper((screen.width - this.getWidth()) / 2, (screen.height - this.getHeight() - this._chromeCaptionSize) / 2);
};

proto.centerToScreenArea = function() {
  return this._centerHelper((screen.availWidth - this.getWidth()) / 2, (screen.availHeight - this.getHeight() - this._chromeCaptionSize) / 2);
};

proto.centerToOpener = function() {
  return this._centerHelper(((QxDOM.getWindowInnerWidth(window) - this.getWidth()) / 2) + QxDOM.getComputedScreenBoxLeft(window.document.body), ((QxDOM.getWindowInnerHeight(window) - this.getHeight() - this._chromeCaptionSize) / 2) + QxDOM.getComputedScreenBoxTop(window.document.body));
};

proto._centerHelper = function(l, t)
{
  // to force the move of the window
  this.forceLeft(0);
  this.forceTop(0);
  
  // set new values
  this.setLeft(l);
  this.setTop(t);

  // focus window if opened
  if (this._window && !this._window.closed) {
    this.focus();
  };
};





/*
  -------------------------------------------------------------------------------
    FOCUS HANDLING
  -------------------------------------------------------------------------------
*/

proto.focus = function() 
{
  if (this._window) {
    try {
      this._window.focus();
    } catch(ex) {
    };
  };
};

proto.blur = function() 
{
  if (this._window) {
    this._window.blur();
  };
};




/*
  -------------------------------------------------------------------------------
    TIMER
  -------------------------------------------------------------------------------
*/

proto._ontimer = function(e)
{
  try
  {
    if (isValidNumber(this._readyState) && this._isOpened && (!this._window || (this._window && this._window.closed != false))) 
  {
    if (this.getModal()) {
      window.application.getClientWindow().getClientDocument().release(this);
    };    
    
    this._timer.stop();
    
    if (this._instance) 
    {
      this._instance.dispose();
      this._instance = null;
    };
    
    this._isOpened = false;
    this._isLoaded = false;
    this._readyState = null;    
    return;
  };
  
  if (!this._window || this._timerRun) {
    return;
  };

  if (this._window) {
    this._isOpened = true;
  };
  }
  catch(ex)
  {
    this.debug("QxNativeWindow: _ontimer: Error in window pre check handler: " + ex);
    return;
  };
  
  this._timerRun = true;
  
  try
  {
  switch(this._readyState)
  {
    case 0:
      this._isLoaded = false;
    
      var d = this._window.document;
      if (d) 
      {
        try {
          this._window._QxNativeWindow = this;
        } catch(ex) {};  
  
        if (isValidString(this.getSource()))
        {
          try
          {
            // in mshtml it seems not to work, even not for onreadystatechange
            // (workaround see case 5 below)
            QxDOM.addEventListener(this._window, "load", this.__onload);
          }
          catch(ex) {
          };

          this._window.location.replace(this.getSource());
          this._timer.setInterval(500);
          this._readyState = 5;  
        }
        else
        {
          this._readyState = 1;
        };
        
        if (!this.getResizeable() && !(new QxClient).isMshtml())
        {
          var w = this.getWidth();
          var h = this.getHeight();
          var win = this._window;
          
          this._window.addEventListener("resize", function(e) { win.resizeTo(w, h); }, false);
        };
      };
      
      break;

    case 1:
      // Find stylesheet
      var ls = document.getElementsByTagName("head")[0].getElementsByTagName("link");

      for (var i=0, l=ls.length; i<l; i++)
        {
          if (ls[i].getAttribute("href").indexOf("layouts/") != -1) 
            {
              var s = ls[i].getAttribute("href");
              break;
            };
        };
      
      // Building new document
      var d = this._window.document;

      d.open("text/html", true);
      
      d.write('<?xml version="1.0" encoding="iso-8859-1"?>');
      
      // Some magick for our optimizer
      d.write('<!DOCTYPE html PUBLIC "-/' + '/W3C/' + '/DTD XHTML 1.1/' + '/EN" "http:/' + '/www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">');
      d.write('<html xmlns="http:/' + '/www.w3.org/1999/xhtml" xml:lang="en">');
      
      d.write('<head>');
      d.write('<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-15" />');
      d.write('<meta http-equiv="MsThemeCompatible" content="yes" />');
      d.write('<meta http-equiv="ImageToolBar" content="no" />');
      d.write('<meta http-equiv="Pragma" content="no-cache" />');
      d.write('<meta http-equiv="Expires" content="-1" />');
      d.write('<meta http-equiv="Cache-Control" content="no-cache" />');
      d.write('<meta name="MSSmartTagsPreventParsing" content="yes" />');
      
      if (this.getShowCaption()) {
        d.write('<title>' + this.getCaption() + '</title>');
      };
      
      if (isValidString(s)) {
        d.write('<link type="text/css" rel="StyleSheet" href="' + s + '"/>');
      };
       
      d.write('</head><body></body></html>');
      
      d.close();
        
      this._readyState++;
      
      break;      
      
    case 2:
      var d = this._window.document;
      if (d && d.body) 
      {
        this._instance = new QxClientWindow(this._window);
        this._pane = this._instance.getClientDocument();
      
        this._readyState++;
      };
      
      break;
      
    case 3:
      try{
        if (this.hasEventListeners("ready")) {
          this.dispatchEvent(new QxEvent("ready"));
        };    
      }
      catch(ex)
      {
        this.debug("Error in ready implementation: " + ex);
        this._timer.stop();
      };
      
      this._readyState++;
      
      break;
      
    case 4:
      this.focus();
      this._readyState++;
      
      this._onload();
      
      this._timer.setInterval(500);
      this._timer.restart();      
      break;
      
    case 5:
      // workaround for mshtml (see case 0 below)
      try {
        if (this._window.document.readyState == "complete") {
          this._onload();
        };
      } catch(ex) {};
      
      if (!this.getMoveable()) {
        try{
        this._window.moveTo(this.getLeft(), this.getTop());
        } catch(ex) {};
      };
      
      if (!this.getResizeable() && (this.getWidth() == "auto" || this.getHeight() == "auto")) 
      {
          var w, h;
          
          if (this.getWidth() == "auto") {
            w = this._instance.getClientDocument().getPreferredWidth();
          };
        
          if (this.getHeight() == "auto") {
            h = this._instance.getClientDocument().getPreferredHeight();
          };          

          if (isValidNumber(w) || isValidNumber(h)) 
          {
            if ((new QxClient).isMshtml())
            {
            try {
              this._window.resizeTo(isValidNumber(w) ? w : this.getWidth(), isValidNumber(h) ? h + this._chromeCaptionSize : this.getHeight());  
            } catch(ex) {};
            }
            else
            {
              if (isValidNumber(w)) {
                this._window.innerWidth = w;
              };
              
              if (isValidNumber(h)) {
                // https://bugzilla.mozilla.org/show_bug.cgi?id=176320
                // Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.5) Gecko/20041107 Firefox/1.0
                if( this._window.innerHeight != 150 && h != 150) {
                  this._window.innerHeight = h;
                };
              };
            };
          };
        };
      
      break;
  };  
  }
  catch(ex)
  {
    this.debug("QxNativeWindow: _ontimer: Error in window ready state handler: " + ex);
    return;
  };
  
  delete this._timerRun;
};

proto._onload = function()
{
  if (!this._isLoaded) 
  {
    this._isLoaded = true;
    this.focus();
    this.dispatchEvent(new QxEvent("load"));
  };
};




/*
------------------------------------------------------------------------------------
  DISPOSER
------------------------------------------------------------------------------------
*/

proto.dispose = function()
{
  if (this.getDisposed()) {
    return;
  };
  
  if (this._timer)
  {
    this._timer.removeEventListener("interval", this._ontimer, this);
    this._timer.dispose();
    
    this._timer = null;
  };

  if (this._instance) 
  {
    this._instance.dispose();
    this._instance = null;
  };
  
  if (this._pane)
  {
    this._pane.dispose();
    this._pane = null;
  };  

  if (this._window)
  {
    if (!this._window.closed)
    {
      QxDOM.removeEventListener(this._window, "load", this.__onload);
    };

    this.close();

    try
    {
      if (this._window._QxNativeWindow)
      {
        this._window._QxNativeWindow.dispose();
        this._window._QxNativeWindow = null;
      };
    }
    catch(ex) {};

    this._window = null;
  };
  
  this._readyState = null;
  
  return QxTarget.prototype.dispose.call(this);
};
