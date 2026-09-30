import getColumnWithWindw from "./utils/getColumnWithWindow";
import maxArea from "./utils/maxArea";
import updatePager from "./utils/updatePager";

export default class Column {
  width: number;
  xPosStart: number;
  windows: KWin.AbstractClient[] = [];
  padding: number;
  id: any;

  //Refer to docs/model.md
  //A Column's initial geometry is set by its initialWindow.
  //A Column's geometry is set by the intial window. The initial window will not have the padding applied to it's geometry when it is passed to the constructor. calling addWindow() will apply the geometry with padding on the initial window
  //All other operations interacting with a window that is part of a Columns windows property should factor in the padding in the window deminsions
  constructor(
    initialWindow: KWin.AbstractClient,
    padding: number,
    xPosStart: number,
  ) {
    this.id = Math.floor(Math.random() * 10000000000000);
    const leastAreaGeometry = maxArea();

    this.width = leastAreaGeometry.width;
    this.xPosStart = xPosStart;
    this.padding = padding;

    this.addWindow(initialWindow);
  }

  addWindow(window: KWin.AbstractClient, index = -1) {
    if (index > -1) {
      const firstHalf = this.windows.slice(0, index);
      const secondHalf = this.windows.slice(index, this.windows.length);
      this.windows = [...firstHalf, window, ...secondHalf];
    } else {
      this.windows.push(window);
    }

    const leastAreaGeometry = maxArea();

    const windowHeight = Math.floor(
      leastAreaGeometry.height / this.windows.length - this.padding * 2,
    );

    //Apply correct geometry with padding to windows
    let lastY = leastAreaGeometry.y;
    for (const window of this.windows) {
      const frameGeometry = {
        width: this.width - this.padding * 2,
        height: windowHeight,
        x: this.xPosStart + this.padding,
        y: Math.floor(lastY),
      };
      window.frameGeometry = frameGeometry;

      lastY = lastY + windowHeight;
    }

    window.interactiveMoveResizeStepped.connect(() => {
      //Prevents floating windows from canceling resize
      if (!window.floating) window.frameGeometry = window.frameGeometry;
    });

    window.frameGeometryChanged.connect((oldGeometry) => {
      if (!window.floating && window.move) window.frameGeometry = oldGeometry;
    });

    updatePager();
  }

  deleteWindow(newWindow: KWin.AbstractClient) {
    const newWindows = [];
    for (const window of this.windows) {
      if (newWindow.internalId === window.internalId) continue;
      newWindows.push(window);
    }

    this.windows = newWindows;
    return this.windows.length;
  }

  setXPos(number: number) {
    //Each window should already have padding applied to their width, height, and y value. It only needs to be reapplied to their X value
    for (const window of this.windows) {
      window.frameGeometry = {
        width: window.width,
        height: window.height,
        x: number + this.padding,
        y: window.y,
      };
    }

    this.xPosStart = number;
  }

  //This function maximizes the column by using the screen the least amount of area. This avoids including panels at the top or bottom. Some vlaues have to be the currentScreenGeometry and some have to be the leastAreaGeometry. Calcuations for handling panels on the left or right will need to be done in the future
  maximize(): QRect["x"] | void {
    //Screen with least amount of area geometrtody
    const leastAreaGeometry = maxArea();

    //Current Screen Geometry
    // KWin.WorkspaceWrapper.ClientAreaOption.MaximizeArea;
    const currentScreenGeometry = workspace.clientArea(2, this.windows[0]);

    const windowHeight = Math.floor(
      leastAreaGeometry.height / this.windows.length - this.padding * 2,
    );

    //Apply correct geometry with padding to windows
    let lastY = leastAreaGeometry.y;
    for (const window of this.windows) {
      const frameGeometry = {
        width: this.width - this.padding * 2,
        height: windowHeight,
        x: this.xPosStart + this.padding,
        y: Math.floor(lastY),
      };
      window.frameGeometry = frameGeometry;

      lastY = lastY + windowHeight;
    }

    this.xPosStart = currentScreenGeometry.x;
    this.width = currentScreenGeometry.width;

    return currentScreenGeometry.width;
  }

  setWidth(newWidth: number) {
    const difference = newWidth - this.width;
    const columns = workspace.__globals.getColumnsSortedByXPos();

    let columnFound = false;
    for (const column of columns) {
      if (column === this) columnFound = true;

      if (!columnFound) continue;

      const windows = column.windows;

      for (const window of windows) {
        if (column === this) {
          //Every other value should be the same, except for the width, and we still substract twice the padding
          window.frameGeometry = {
            x: window.x,
            //This calculation should work for the current column and every other column to the right
            width: newWidth - this.padding * 2,
            height: window.height,
            y: window.y,
          };

          this.width = newWidth;
        } else {
          column.setXPos(column.xPosStart + difference);
        }
      }
    }
  }

  getXPosEnd() {
    return this.xPosStart + this.width;
  }
}
