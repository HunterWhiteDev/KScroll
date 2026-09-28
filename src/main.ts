import Column from "./Column";
import Grid from "./Grid";
import { initShortcuts } from "./shortcuts/index";
import updatePager from "./utils/updatePager";
import getTotalWidth from "./utils/getTotalWidth";
import getColumnWithWindow from "./utils/getColumnWithWindow";
import removeColumnAtIndex from "./utils/removeColumnAtIndex";
import addWindow from "./utils/addWindow";

const grid = new Grid();
const padding = 8;
const floatingIds = new Set<QUuid>();

function getColumnsSortedByXPos(): Column[] {
  return workspace.__globals.grid.columns.sort((a, b) => {
    if (a.xPosStart < b.xPosStart) return -1;
    else if (a.xPosStart === b.xPosStart) return 0;
    else return 1;
  });
}

function getColumnWithActiveWindow(): [Column, number] | null {
  const columns = getColumnsSortedByXPos();
  let counter = 0;
  for (const column of columns) {
    for (const window of column.windows) {
      if (window.active) return [column, counter];
    }
    counter++;
  }
  return null;
}

workspace["__globals"] = {
  getColumnWithActiveWindow,
  getColumnsSortedByXPos,
  getColumnWithWindow,
  padding,
  grid,
  autoFocus: true,
  getTotalWidth,
  removeColumnAtIndex,
  floatingIds,
};

const removeWindow = (removedWindow: KWin.AbstractClient) => {
  const columnWithWindow = getColumnWithWindow(removedWindow);
  if (!columnWithWindow) return;
  const columns = getColumnsSortedByXPos();

  let removedColumnIdx = 0;
  let found = false;
  const newColumns = columns.filter((col, idx) => {
    //Compares memory addres so should work fine. It's possible giving each column a UUID will be a better solution in the future
    if (col === columnWithWindow) {
      removedColumnIdx = idx;
      found = true;

      if (removedColumnIdx === columns.length - 1) {
        const nextColumnToFocus = columns[idx - 1];

        //If the column that is removed is the last one in thne row, we want to focus the last window in the oclumn to the left
        const nextWindowToFocus =
          nextColumnToFocus.windows[nextColumnToFocus.windows.length - 1];
        workspace.activeWindow = nextWindowToFocus;
      }

      return;
    }

    //Found needs to be true, because if we only check if idx > removedColumnIdx, this will be true before we actually find the column we need
    if (idx > removedColumnIdx && found) {
      col.setXPos(col.xPosStart - columns[removedColumnIdx + 1].width);
    }

    //As long as we didnt reach the condition where we are removing the last column, focus the window to the right
    if (idx === removedColumnIdx + 1) {
      workspace.activeWindow = col.windows[0];
    }

    return col;
  });

  workspace.__globals.grid.columns = newColumns as Column[];

  updatePager();
};

//This only scrolls when windowsAreFocused not currently on screen. Sliding over by the width of the window while within the total widht is handled by keyboard shortcuts
const windowActivated = (window: KWin.AbstractClient) => {
  const totalWidth = getTotalWidth();
  //Which way the windows will scroll, Left = all windows decrease XPosStart. Right = all windows increase XPosStart
  let scrollDirection: "LEFT" | "RIGHT" | "NONE" = "NONE";

  const column = getColumnWithWindow(window);
  if (!column) return;

  if (column?.getXPosEnd() > getTotalWidth()) scrollDirection = "LEFT";
  else if (column.xPosStart < 0) scrollDirection = "RIGHT";

  let scrollDifference: number = 0;

  if (scrollDirection === "LEFT") {
    scrollDifference = column.getXPosEnd() - totalWidth;
  } else {
    scrollDifference = column.xPosStart;
  }

  const columns = getColumnsSortedByXPos();

  for (const col of columns) {
    if (scrollDirection === "LEFT")
      col.setXPos(col.xPosStart - scrollDifference);
    else if (scrollDirection === "RIGHT")
      col.setXPos(col.xPosStart + Math.abs(scrollDifference));
  }
};

workspace.windowActivated.connect(windowActivated);
workspace.windowAdded.connect(addWindow);
workspace.windowRemoved.connect(removeWindow);

const main = () => {
  const stackingOrder = workspace.stackingOrder;
  for (let i = stackingOrder.length - 1; i >= 0; i--) {
    const window = stackingOrder[i];
    addWindow(window);
  }

  updatePager();
  initShortcuts();
};

main();
