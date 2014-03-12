/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */


/**
 * Rotate event object.
 */
qx.Class.define("qx.event.type.Rotate",
{
    extend : qx.event.type.Pointer,


    members : {

      // overridden
      _cloneNativeEvent : function(nativeEvent, clone)
      {
        var clone = this.base(arguments, nativeEvent, clone);

        clone.angle = nativeEvent.angle;

        return clone;
      },


      /**
       * Returns a number with the current calculated angle between the primary and secondary active pointers.
       *
       * @return {Number} the angle of the two active pointers.
       */
      getAngle : function() {
        return this._native.angle;
      }
    }
});
