/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tristan Koch (tristankoch)

************************************************************************ */

qx.Class.define("qx.test.ui.form.TextArea",
{
  extend : qx.test.ui.LayoutTestCase,

  members :
  {
    __textArea: null,

    setUp : function()
    {
      var textArea = this.__textArea = new qx.ui.form.TextArea();
      this.getRoot().add(textArea);
      this.flush();
    },

    // Of course, <br/> in a function name is far from optimal

    //
    // "Plain" textarea
    //

    "test: textarea<br/> set value": function() {
      var textArea = this.__textArea;
      textArea.setValue("Affe");
      this.flush();

      this.assertEquals("Affe", textArea.getValue());
    },

    "test: textarea<br/> set minimal line-height": function() {
      var textArea = this.__textArea;
      this.flush();
      var heightInitial = textArea.getSizeHint().height;

      textArea.setMinimalLineHeight(1);
      this.flush();
      var heightSmall = textArea.getSizeHint().height;

      var msg =  "Widget height must decrease (was: " + heightInitial +
                 " is: " + heightSmall + ")";
      this.assert(heightSmall < heightInitial, msg);
    },

    //
    // Auto-Size
    //

    "test: textarea with autoSize<br/> grows when input would trigger scrollbar": function() {
      var textArea = this.__textArea;
      textArea.setAutoSize(true);
      this.flush();

      textArea.setValue("Affe\nMaus\nElefant");
      this.flush();
      var heightSmall = textArea.getSizeHint().height;

      // Grow
      textArea.setValue("Affe\nMaus\nElefant\nGiraffe\nTiger");
      this.flush();
      var heightTall = textArea.getSizeHint().height;

      var msg =  "Widget height must increase (was: " + heightSmall +
                 " is: " + heightTall + ")";
      this.assert(heightTall > heightSmall, msg);
    },

    "test: textarea with autoSize<br/> shrinks when removal would hide scrollbar": function() {
      var textArea = this.__textArea;
      textArea.setAutoSize(true);
      this.flush();

      textArea.setValue("Affe\nMaus\nElefant");
      this.flush();

      // Grow
      textArea.setValue("Affe\nMaus\nElefant\nGiraffe\nTiger");
      this.flush();
      var heightTall = textArea.getSizeHint().height;

      // Shrink
      textArea.setValue("Affe\nMaus\nElefant");
      this.flush();
      var heightShrink = textArea.getSizeHint().height;

      var msg =  "Widget height must decrease (was: " + heightTall +
                 " is: " + heightShrink + ")";
      this.assert(heightShrink < heightTall, msg);
    },

    "test: textarea with autoSize<br/> does not shrink below original height": function() {
      var textArea = this.__textArea;
      textArea.setAutoSize(true);
      this.flush();

      var originalHeight = textArea.getBounds().height;

      textArea.setValue("Affe\nMaus\nElefant\nGiraffe\nTiger");
      this.flush();

      // Shrink
      textArea.setValue("Affe\nMaus\nElefant");
      var heightShrink = textArea.getSizeHint().height;
      this.flush();

      var msg =  "Widget height must not shrink below original height (is: " + heightShrink +
                 " original: " + originalHeight + ")";
      this.assert(!(heightShrink < originalHeight), msg);
    },

    "test: textarea with autoSize<br/> shows scroll-bar when above maxHeight": function() {
      var textArea = this.__textArea;
      textArea.set({
        autoSize: true,
        maxHeight: 50,
        value: "Affe\nMaus\nElefant"
      });
      this.flush();

      // Grow
      textArea.setValue("Affe\nMaus\nElefant\nGiraffe\nTiger");
      this.flush();

      var overflow = textArea.getContentElement().getStyle("overflowY");
      this.assertEquals("auto", overflow);
    },

    "test: textarea with autoSize<br/> shows scroll-bar when finally above maxHeight": function() {
      var textArea = this.__textArea;
      textArea.set({
        autoSize: true,
        value: "Affe\nMaus\nElefant"
      });
      this.flush();

      // Grow
      textArea.setValue("Affe\nMaus\nElefant\nGiraffe\nTiger");
      this.flush();

      // Limit height
      textArea.setMaxHeight(50);
      this.flush();

      var overflow = textArea.getContentElement().getStyle("overflowY");
      this.assertEquals("auto", overflow);
    },

    "test: textarea with autoSize<br/> hides scroll-bar when finally below maxHeight": function() {
      var textArea = this.__textArea;
      textArea.set({
        autoSize: true,
        maxHeight: 50
      });
      this.flush();

      // Grow
      textArea.setValue("Affe\nMaus\nElefant\nGiraffe\nTiger");
      this.flush();

      // Shrink
      textArea.setValue("Affe");
      this.flush();

      var overflow = textArea.getContentElement().getStyle("overflowY");
      this.assertEquals("hidden", overflow);
    },

    "test: textarea with autoSize<br/> shrinks when long line is unwrapped": function() {

      if (!this.__supportsLiveWrap()) {
        return;
      }

      var textArea = this.__textArea;
      textArea.setAutoSize(true);
      this.flush();

      // Grow
      var longValue = this.__getLongValue();
      textArea.setValue(longValue);
      this.flush();
      var wrapHeight = textArea.getSizeHint().height;

      // Shrink
      textArea.setWrap(false);
      this.flush();
      var noWrapHeight = textArea.getSizeHint().height;

      var msg = "Must shrink when long line is unwrapped";
      this.assertNotEquals(wrapHeight, noWrapHeight, msg);
      this.assert(noWrapHeight < wrapHeight, msg);
    },

    "test: textarea with autoSize<br/> grows when long line is wrapped": function() {

      if (!this.__supportsLiveWrap()) {
        return;
      }

      var textArea = this.__textArea;
      textArea.set({
        autoSize: true,
        wrap: true
      });
      this.flush();

      // Does not work unfortunately
      //
      // var longValue = new qx.type.Array(50).map(function() {
      //   return "AffeMausElefantGiraffeTiger";
      // }).join("");

      var longValue = this.__getLongValue();

      // Wrap
      textArea.setValue(longValue);
      this.flush();
      var initialWrapHeight = textArea.getSizeHint().height;

      // Unwrap
      textArea.setWrap(false);
      this.flush();
      var noWrapHeight = textArea.getSizeHint().height;

      // Wrap
      textArea.setWrap(true);
      this.flush();
      var wrapHeight = textArea.getSizeHint().height;

      var msg = "Must grow when long line is unwrapped";
      this.assertNotEquals(wrapHeight, noWrapHeight, msg);
      this.assert(wrapHeight > noWrapHeight, msg);

      var msg = "Must be same height when wrap is toggled"
      this.assertEquals(initialWrapHeight, wrapHeight, msg);
    },

    __getLongValue: function() {
      var val = new qx.type.Array(50);
      for(var i=0; i < val.length; i++) {
        val[i] = "AAAAA ";
      }
      return val.join("");
    },

    __supportsLiveWrap: function() {

      // Opera and older versions of IE ignore changes to wrap settings
      // once the textarea is in the DOM
      var Engine = qx.bom.client.Engine;
      if (Engine.OPERA || (Engine.MSHTML && Engine.FULLVERSION < 8)) {
        this.warn("Skipping test");
        return false;
      }

    },

    tearDown : function()
    {
      this.__textArea.destroy();
    }
  }
});
