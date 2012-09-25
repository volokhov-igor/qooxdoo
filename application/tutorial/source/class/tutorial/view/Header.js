/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * The Application's header
 */
qx.Class.define("tutorial.view.Header",
{
  extend : qx.ui.container.Composite,

  events : {
    "selectTutorial" : "qx.event.type.Event"
  },

  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function()
  {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.HBox);
    this.setAppearance("app-header");

    var title = new qx.ui.basic.Label("learn.qooxdoo.org");
    var select = new qx.ui.form.Button("Select Tutorial");
    select.setFont("default");
    select.setTextColor("black");
    select.addListener("execute", function() {
      this.fireEvent("selectTutorial");
    }, this);
    var version = new qxc.ui.versionlabel.VersionLabel();
    version.setFont("default");

    this.add(title);
    this.add(new qx.ui.core.Spacer, {flex : 1});
    this.add(select);
    this.add(new qx.ui.core.Spacer, {flex : 1});
    this.add(version);
  }
});